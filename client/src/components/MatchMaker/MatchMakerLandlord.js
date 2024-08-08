import React from 'react';
import { Card, CardWrapper } from 'react-swipeable-cards';
import StudentCard from './studentCard';
import './MatchMaker.css';
import { IconButton, Typography, Box } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


const MatchMakerStudent = ({ students }) => {


    const handleSwipeRight = (student) => {
        callApiStudentSwiped(student.userID)
    }

    const handleSwipeLeft = (student) => {
        console.log(student)
    }

    const callApiStudentSwiped = async (studentID) => {
        const url = '/api/studentSwiped';
        const userToken = sessionStorage.getItem('userToken');

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: userToken
            },
            body: JSON.stringify({ studentID: studentID }),
        });

        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    const getEndCard = () => {
        return (
            <div style={{ width: '500px', height: '550px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #ccc', borderRadius: '5px' }}>
                <Typography variant="h5" style={{ fontWeight: 'bold' }}>No More Students! Check Again Later</Typography>
            </div>
        )
    }

    return (
        <div className="page-container">
            <div className='content-container'>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', width: '60%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton color="primary">
                            <ArrowBackIosIcon />
                        </IconButton>
                        <Typography variant="body1">Swipe left to discard</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                        <Typography variant="body1">Swipe right to save</Typography>
                        <IconButton color="primary">
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Box>
                </Box>
                <CardWrapper addEndCard={getEndCard} style={{ width: '550px', height: '700px', maxWidth: '600px' }}>
                    {students?.length > 0 ? (
                        students.map((student) => (
                            <Card style={{ width: '500px', height: '550px', maxWidth: '550px' }} data={student} onSwipeRight={handleSwipeRight} onSwipeLeft={handleSwipeLeft}>
                                <StudentCard student={student} />
                            </Card>
                        ))
                    ) : (
                        <div style={{ width: '550px', height: '650px', maxWidth: '550px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #ccc', borderRadius: '5px' }}>
                            No more students to swipe
                        </div>
                    )}
                </CardWrapper>
            </div>
        </div>
    );
}

export default MatchMakerStudent;