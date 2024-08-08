import React, { useState, useEffect } from 'react';
import ResponsiveAppBar from '../Navigation/appBar'; // Import Navbar component
import { useUserAuth } from '../../contexts/AuthContext';
import Student from '../StudentList/student'; // Import Student component at the top of your file
import Listing from '../listing/listing';
import ListingView from '../listing/listingView';
import StudentListView from '../StudentList/studentListView';


const Matches = () => {
    const { students, listings, setListings, setStudents, fetchListingData, fetchStudentData } = useUserAuth(); // Get students from context
    const [matches, setMatches] = useState([]);
    const userRole = sessionStorage.getItem('userRole');

    useEffect(() => {
        const fetchData = async () => {
            if (userRole === 'Student') {
                let listingData = listings;
                if (listings.length === 0) {
                    listingData = await fetchListingData();
                }
                console.log(listings)
                getStudentMatches(listingData);
            } else {
                let studentData = students;
                if (students.length === 0) {
                    console.log('hello')
                    studentData = await fetchStudentData();
                }
                getLandlordMatches(studentData);
            }
        }
        fetchData()


    }, []);

    const getLandlordMatches = async (studentData) => {
        const url = '/api/getLandlordMatches';
        const userToken = sessionStorage.getItem('userToken');

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: userToken
            },
        });

        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        // Parse the matches from the response
        const matches = JSON.parse(body.express);

        // Filter the students based on the matches
        const matchedStudents = studentData.filter(student =>
            matches.some(match => match.studentID === student.userID)
        );

        // Update the matches state with the filtered students
        setMatches(matchedStudents);
    };

    const getStudentMatches = async (listingData) => {
        const url = '/api/getStudentMatches';
        const userToken = sessionStorage.getItem('userToken');

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: userToken
            },
        });

        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        // Parse the matches from the response
        const matches = JSON.parse(body.express);
        // Filter the students based on the matches
        const matchedListings = listingData.filter(listing =>
            matches.some(match => match.postingID === listing.postingID)
        );

        // Update the matches state with the filtered students
        setMatches(matchedListings);
    };

    return (
        <div>
            <ResponsiveAppBar /> {/* Render Navbar */}
            <h1>Your Matches Below!</h1>
            {userRole === 'Student' ? (
                <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <ListingView listings={matches} />
                </div>
            ) : (
                <div style={{ height: '100vh', width: '100wv', display: 'flex', justifyContent: 'center' }}>
                    <StudentListView students={matches} />
                </div>
            )}
        </div>
    );
};

export default Matches;