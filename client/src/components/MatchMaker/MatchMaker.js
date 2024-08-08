import React, { useEffect, useState } from 'react';
import MatchMakerStudent from './MatchMakerStudent';
import MatchMakerLandlord from './MatchMakerLandlord';
import { useUserAuth } from '../../contexts/AuthContext';
import ResponsiveAppBar from '../Navigation/appBar';

const MatchMaker = () => {

    const [notSwipedList, setNotSwipedList] = useState([])
    const [loading, setLoading] = useState(true);
    const { listings, students, fetchStudentData, fetchListings } = useUserAuth()
    const userRole = sessionStorage.getItem('userRole')

    useEffect(() => {

        const fetchData = async () => {
            let studentData = students;
            let listingData = listings;

            if (userRole === 'Landlord' && studentData.length === 0) {
                console.log('ran here to fetch data on first render')
                studentData = await fetchStudentData();
            }

            if (userRole === 'Student' && listingData.length === 0) {
                listingData = await fetchListings();
            }

            if(userRole == 'Student') {
                await fetchListingSwipes(listingData)
                setLoading(false);
            }else if(userRole == 'Landlord') {
                await fetchStudentSwipes(studentData)
                setLoading(false);
            }
        };

        fetchData();
    }, [])


    const fetchListingSwipes = async (listingData) => {
        try {
            const res = await callApiGetListingSwipes();
            const parsed = JSON.parse(res.express);
            const postingIDs = parsed.map(obj => obj.postingID);
            if (postingIDs.length > 0) {
                setNotSwipedList(listingData.filter(listing => !postingIDs.includes(listing.postingID)));
                
            } else {
                console.log('no swipes')
                setNotSwipedList(listingData);
                
            }
        } catch (error) {
            console.error("Error fetching student swipes:", error);
            // Handle error if needed
        }
    };

    const fetchStudentSwipes = async (studentData) => {
        try {
            const res = await callApiGetStudentSwipes();
            const swipes = JSON.parse(res.express)

            if (swipes.length > 0) {
                const userIDs = swipes.map(obj => obj.studentID);
                setNotSwipedList(studentData.filter(student => !userIDs.includes(student.userID)));
                //setLoading(false);
            }
            else {

                setNotSwipedList(studentData);
                //setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching student swipes:", error);
            // Handle error if needed
        }
    };

    const callApiGetListingSwipes = async () => {
        const url = '/api/getListingSwipes';
        const userToken = sessionStorage.getItem('userToken');

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: userToken
            }
        });

        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    const callApiGetStudentSwipes = async () => {
        const url = '/api/getStudentSwipes';
        const userToken = sessionStorage.getItem('userToken');

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: userToken
            }
        });

        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    return (
        <>
            <ResponsiveAppBar />
                {!loading && (
                    <>
                        {userRole === 'Landlord' ? (
                            <MatchMakerLandlord students={notSwipedList} />
                        ) : (
                            <MatchMakerStudent listings={notSwipedList} />
                        )}
                    </>
                )}

        </>
    );
}

export default MatchMaker;
