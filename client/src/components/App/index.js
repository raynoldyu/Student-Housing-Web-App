import * as React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../Home';
import LandlordHome from '../StudentList/'
import Shortlist from '../Shortlist/shortlist';
import SignUp from '../SignUp/signUp';
import SignIn from '../SignIn/signIn';
import SubmitPostings from '../submitPosting/submitListing';
import MatchMaker from '../MatchMaker/MatchMaker';
import LandingPage from '../LandingPage/LandingPage';
import Matches from '../Matches/Matches.js';
import { useUserAuth } from '../../contexts/AuthContext';
import UploadedPostings from '../UploadedPostings/uploadedPostings';
import { UserAuthContextProvider } from '../../contexts/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {auth} from '../Firebase/config';
import 'firebase/auth';
import { useEffect, useState } from 'react';




const App = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
      <UserAuthContextProvider>
        <Router>
          <>
            <Routes>
              <Route path="/" element={user ? <Home /> : <LandingPage />} />
              <Route path="/LandingPage" element={<LandingPage />} />
              <Route path="/Listings" element={user ? <Home /> : <LandingPage />} />
              <Route path="/Students" element={user ? <LandlordHome /> : <LandingPage />} />
              <Route path="/Profile" element={user ? <Shortlist /> : <LandingPage />} />
              <Route path="/Shortlist" element={user ? <Shortlist /> : <LandingPage />} />
              <Route path="/My Postings" element={user ? <UploadedPostings /> : <LandingPage />} />
              <Route path="/submitPosting" element={user ? <SubmitPostings /> : <LandingPage />} />
              <Route path="/Match Maker" element={user ? <MatchMaker /> : <LandingPage />} />
              <Route path="/Matches" element={user ? <Matches /> : <LandingPage />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/SignIn" element={<SignIn />} />
            </Routes>
          </>
        </Router>
      </UserAuthContextProvider>
  );
}

export default App;