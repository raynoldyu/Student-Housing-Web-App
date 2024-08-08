import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../components/Firebase/config';
import { calculateAverageSimilarity } from '../calculations/groupSimilarity'; 

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(''); //data from firebase
  const [userData, setUserData] = useState(''); //data from database
  const [loading, setLoading] = useState(true); // Loading state
  const [numMatches, setNumMatches] = useState();
  const [listings, setListings] = useState([])
  const [filteredListings, setFilteredListings] = useState([])
  const [isSignedUp, setIsSignedUp] = useState(true)
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logOut() {
    setUserData('');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('firstName');
    sessionStorage.removeItem('userToken');
    return signOut(auth);
  }

  const fetchListings = async () => {
    const userToken = sessionStorage.getItem('userToken');
    const url = "/api/getAllListings";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: userToken
      },
      body: JSON.stringify({ userToken: userToken })
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    const parsedListings = JSON.parse(body.express);
    setListings(parsedListings);
    setFilteredListings(parsedListings);
    return parsedListings;
  };

  const getAllStudents = async () => {
    const userToken = sessionStorage.getItem('userToken');
    const url = "/api/getAllStudents";
  
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: userToken
      },
      body: JSON.stringify({ userToken: userToken })
    });
  
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    const parsedStudents = JSON.parse(body.express);
    setStudents(parsedStudents);
    return parsedStudents;
  };

  const callApiGetShortlistIDs = async (userToken) => {
    const url = "/api/getShortlistIDs";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: userToken
      },
      body: JSON.stringify({ userToken: userToken })
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  const callApiGetUserCriteria = async (userToken) => {
    const url = "/api/getUserCriteria";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: userToken
      }
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  const fetchStudentData = async () => {
      const userToken = sessionStorage.getItem('userToken');
      // Wait for callApiGetUsersListingCriteria to complete
      const res = await callApiGetUsersListingCriteria(userToken);
      let parsedResidentCriteria = JSON.parse(res.express);

      // Split interests and lookingFor into arrays
      parsedResidentCriteria = parsedResidentCriteria.map(resident => {
        resident.lookingFor = resident.lookingFor ? resident.lookingFor.split(',') : [];
        resident.interests = resident.interests ? resident.interests.split(',') : [];
        return resident;
      });

      // Now call callApiGetAllStudents
      const resStudents = await getAllStudents();

      // Split interests and lookingFor into arrays
      const parsed = resStudents.map(student => {
        
        student.lookingFor = student.lookingFor ? student.lookingFor.split(',') : [];
        student.interests = student.interests ? student.interests.split(',') : [];
        student.personalityScores = JSON.parse(student.personality_scores_array);

        // Initialize matchingInterests and matchingLookingFor arrays
        student.matchingInterests = [];
        student.matchingLookingFor = [];
        
        let resident_personality_arrays = []

        // Iterate over each resident
        parsedResidentCriteria.forEach(resident => {
          // Check for matching interests
          let residentPersonality = JSON.parse(resident.personality_scores_array);
          resident_personality_arrays.push(residentPersonality)

          resident.interests.forEach(interest => {
            if (student.interests.includes(interest) && !student.matchingInterests.includes(interest)) {
              student.matchingInterests.push(interest);
            }
          });

          // Check for matching lookingFor items
          resident.lookingFor.forEach(lookingFor => {
            if (student.lookingFor.includes(lookingFor) && !student.matchingLookingFor.includes(lookingFor)) {
              student.matchingLookingFor.push(lookingFor);
            }
          });
        });
        console.log(student.personalityScores)
        console.log(resident_personality_arrays)
        let personalityMatch = calculateAverageSimilarity(student.personalityScores, resident_personality_arrays);
        return {
          ...student, 
          personalityMatch: personalityMatch
        };
      });

      setStudents(parsed);
      setFilteredStudents(parsed);
      return parsed
  };

  const fetchListingData = async () => {
      try {
        const userToken = sessionStorage.getItem('userToken');
        const userID = sessionStorage.getItem('userID')
        const userRole = userData[0].userRole;

        let listingData = listings;
        // Fetch listings and shortlist IDs
        if (listings.length === 0) {
          console.log('ran')
          listingData = await fetchListings();
        }

        const [shortlistData, userCriteriaData] = await Promise.all([
          callApiGetShortlistIDs(userToken),
          callApiGetUserCriteria(userToken)
        ]);


        const parsedShortlist = JSON.parse(shortlistData.express);
        const userCriteria = JSON.parse(userCriteriaData.express);
        const shortListedMap = new Map(parsedShortlist.map(item => [item.postingID, true]));

        // Update listings state with shortlist status
        const updatedListings = listingData.map(listing => {
          const shortListed = shortListedMap.get(listing.postingID) || false;
          let personalityMatch = "";
          let sharedInterests = [];
          let sharedLookedFor = [];
          let residentLookedFor = [];
          let residentPersonality = [];
          let residentInterests = [];

          if (listing.residents) {
            let residentsIDArray = listing.residents.split(',');

            residentsIDArray.forEach((residentID) => {
              let residentCriteria = userCriteria.find(entry => entry.userID === residentID);
              if (residentCriteria) {
                let residentScoresString = residentCriteria.personality_scores_array;
                if (residentScoresString) {
                  residentPersonality.push(JSON.parse(residentScoresString));
                }

                let residentInterestsString = residentCriteria.interests;
                if (residentInterestsString) {
                  residentInterests = residentInterests.concat(residentInterestsString.split(','));
                }

                let residentLookedForString = residentCriteria.lookingFor;
                if (residentLookedForString) {
                  residentLookedFor = residentLookedFor.concat(residentLookedForString.split(','));
                }
              }
            });

            // Remove duplicates from residentInterests and residentLookedFor
            residentInterests = [...new Set(residentInterests)];
            residentLookedFor = [...new Set(residentLookedFor)];
          }

          // Handles creating the personality, interest, and lookingFor match  
          if (userRole === 'Student') {
            let currentUserPersonality;
            let currentUserInterests = [];
            let currentUserLookedFor = [];

            let currentUserCriteria = userCriteria.find(entry => entry.userID === userID);
            if (currentUserCriteria) {
              let currentUserPersonalityString = currentUserCriteria.personality_scores_array;
              if (currentUserPersonalityString) {
                currentUserPersonality = JSON.parse(currentUserPersonalityString);
              }

              let userInterestsString = currentUserCriteria.interests;
              currentUserInterests = userInterestsString ? userInterestsString.split(',') : [];

              let userLookedForString = currentUserCriteria.lookingFor;
              currentUserLookedFor = userLookedForString ? userLookedForString.split(',') : [];
            }

            personalityMatch = calculateAverageSimilarity(currentUserPersonality, residentPersonality);
            sharedInterests = currentUserInterests.filter(interest => residentInterests.includes(interest));
            sharedLookedFor = currentUserLookedFor.filter(lookedFor => residentLookedFor.includes(lookedFor));
          }

          return {
            ...listing,
            shortListed: shortListed,
            personalityMatch: personalityMatch,
            residentInterests: residentInterests,
            residentLookedFor: residentLookedFor,
            sharedInterests: sharedInterests,
            sharedLookedFor: sharedLookedFor
          };
        });

        

        setListings(updatedListings);
        setFilteredListings(updatedListings);
        return updatedListings 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
  }


  async function callApiGetUser(userToken) {
    const url = '/api/getUser';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userToken
      },
      body: JSON.stringify({ userToken: userToken }),
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  const callApiGetUsersListingCriteria = async (userToken) => {
    const url = "/api/getMyListingCriteria";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: userToken
      }

    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      //sets user info from database
      setUser(currentUser); //sets firebase user info
      if (currentUser && isSignedUp) {
        currentUser.getIdToken(true)
          .then(function (idToken) {
            callApiGetUser(idToken)
              .then(res => {
                var parsed = JSON.parse(res.express);
                setUserData(parsed);
                sessionStorage.setItem('userToken', idToken);
                sessionStorage.setItem('userID', parsed[0].userID);
                sessionStorage.setItem('userRole', parsed[0].userRole);
                sessionStorage.setItem('firstName', parsed[0].firstName);
                setLoading(false);
              });
          });
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
      const currentUser = auth.currentUser
      setUser(currentUser); //sets firebase user info
      if (currentUser && isSignedUp) {
        currentUser.getIdToken(true)
          .then(function (idToken) {
            callApiGetUser(idToken)
              .then(res => {
                var parsed = JSON.parse(res.express);
                setUserData(parsed);
                sessionStorage.setItem('userToken', idToken);
                sessionStorage.setItem('userID', parsed[0].userID);
                sessionStorage.setItem('userRole', parsed[0].userRole);
                sessionStorage.setItem('firstName', parsed[0].firstName);
                setLoading(false);
              });
          });
      }

  }, [isSignedUp]);

  return (
    <userAuthContext.Provider
      value={{ user, userData, loading, listings, filteredListings, isSignedUp, setIsSignedUp, fetchListings, fetchListingData, students, setStudents, fetchStudentData, filteredStudents, setFilteredStudents, setFilteredListings, setListings, numMatches, setNumMatches, signUp, signIn, logOut }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
