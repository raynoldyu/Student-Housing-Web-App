import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FullScreenDialog from './listingPage';
import EditListingPopUp from './editListingPage';
import { useUserAuth } from '../../contexts/AuthContext';
import { Grid, Box, Divider, Stack } from '@mui/material';

const LandLordListing = ({ listing, handleRemoveListing, handleEditListing }) => {
    const { userData } = useUserAuth();
    const userID = sessionStorage.getItem('userID');

    return (
        <Card sx={{ width: '550px', height: '650px' }}>
            <CardMedia
                component="img"
                style={{ height: '40%' }}
                image={listing.image ? `${listing.image}` : "https://raw.githubusercontent.com/julien-gargot/images-placeholder/master/placeholder-landscape.png"}
                alt="green iguana"
            />
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Stack>
                            <Typography variant="h5" style={{ fontWeight: 'bold' }}>{listing.title}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="h5">${listing.Price}/month</Typography>
                                <Divider orientation="vertical" variant="middle" flexItem sx={{ bgcolor: '#000000', marginX: '8px' }} />
                                <Typography variant="h5">{listing.semester}</Typography>
                                <Divider orientation="vertical" variant="middle" flexItem sx={{ bgcolor: '#000000', marginX: '8px' }} />
                                <Typography variant="h5">{listing.length}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body1" gutterBottom>{listing.description}</Typography>
                            </Box>
                        </Stack>

                    </Grid>
                    <Grid item xs={12} style={{ marginTop: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <FullScreenDialog listing={listing} index={listing.postingID} />
                            {
                                userID === listing.landlordID && (
                                    <>
                                        <EditListingPopUp listing={listing} index={listing.postingID} />
                                        <Button
                                            variant="contained"
                                            style={{ width: '30%', backgroundColor: 'black', color: 'white' }}
                                            onClick={() => handleRemoveListing(listing.postingID, listing.landlordID)}
                                            startIcon={<DeleteForeverIcon />}
                                        >
                                            Remove
                                        </Button>
                                    </>
                                )
                            }
                        </div>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default LandLordListing;

