import React from 'react';
import { Card, CardWrapper } from 'react-swipeable-cards';
import ListingCard from './ListingCard';
import './MatchMaker.css';
import { IconButton, Typography, Box } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';




const MatchMakerStudent = ({ listings }) => {

    const [numListingsLeft, setNumListingsLeft] = React.useState(listings.length);


    const handleSwipeRight = (listing) => {
        callApiListingSwiped(listing.postingID)
        setNumListingsLeft(numListingsLeft - 1)
    }

    const handleSwipeLeft = (listing) => {
        console.log('swiped left')
        setNumListingsLeft(numListingsLeft - 1)
    }

    const callApiListingSwiped = async (postingID) => {
        const url = '/api/postingSwiped';
        const userToken = sessionStorage.getItem('userToken');

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: userToken
            },
            body: JSON.stringify({ postingID }),
        });

        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    const getEndCard = () => {
        return (
            <div style={{ width: '550px', height: '650px', minWidth: '550px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #ccc', borderRadius: '5px' }}>
                <Typography variant="h5" style={{ fontWeight: 'bold' }}>No More Listings! Check Again Later</Typography>
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
                    <Box sx={{ display: 'flex', justifyContent: 'left',alignItems: 'center' }}>
                        <Typography variant="body1">Swipe right to save</Typography>
                        <IconButton color="primary">
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Box>
                </Box>
                <CardWrapper addEndCard={getEndCard} style={{ width: '600px', height: '700px', maxWidth: '600px' }}>
                    {listings.length >= 0 ? (
                        listings.map((listing) => (
                            <Card style={{ width: '550px', height: '650px', maxWidth: '550px' }} data={listing} onSwipeRight={handleSwipeRight} onSwipeLeft={handleSwipeLeft}>
                                <ListingCard listing={listing} />
                            </Card>
                        ))) : (
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