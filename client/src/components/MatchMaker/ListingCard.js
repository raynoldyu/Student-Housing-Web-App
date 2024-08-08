import * as React from 'react';
import CategoryItem from '../CategoryItem/CategoryItem';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { Stack } from '@mui/material';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ReviewForm from '../Review/review';
import FullScreenDialog from '../listing/listingPage';
import { Box } from '@mui/material';
import { Grid } from '@mui/material';
import Divider from '@mui/material/Divider';
import InterestsIcon from '@mui/icons-material/Interests';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import FilterListIcon from '@mui/icons-material/FilterList';
import PsychologyIcon from '@mui/icons-material/Psychology';
import Paper from '@mui/material/Paper';
import ProgressProvider from '../listing/percentageBar/ProgressProvider';

const ListingCard = (props) => {

    const userRole = sessionStorage.getItem('userRole');


    return (
        <Card sx={{ width: '550px', height: '650px', pointerEvents: 'none' }}>
            <CardMedia
                component="img"
                style={{ height: '40%' }}
                src={props.listing.image ? `${props.listing.image}` : "https://raw.githubusercontent.com/julien-gargot/images-placeholder/master/placeholder-landscape.png"}
            />

            <CardContent style={{ height: '60%', display: 'flex', flexDirection: 'column' }}>
                <Grid container spacing={1} style={{ height: '100%' }}>
                    <Grid item xs={12} sx={{ height: 'fit-content' }}>
                        <Grid container>
                            <Grid item xs={8}>
                                <Stack>
                                    <Typography variant="h5" style={{ fontWeight: 'bold' }}>{props.listing.title}</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="h5">${props.listing.Price}/month</Typography>
                                        <Divider orientation="vertical" variant="middle" flexItem sx={{ bgcolor: '#000000', marginX: '8px' }} />
                                        <Typography variant="h5">{props.listing.semester}</Typography>
                                        <Divider orientation="vertical" variant="middle" flexItem sx={{ bgcolor: '#000000', marginX: '8px' }} />
                                        <Typography variant="h5">{props.listing.length}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{props.listing.description}</Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                            <Grid item xs={4}>
                                <Box sx={{ width: '150px', height: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <ProgressProvider valueStart={0} valueEnd={props.listing.personalityMatch}>
                                        {value => <CircularProgressbar styles={buildStyles({ textColor: 'black', pathColor: '#E95C64' })}  strokeWidth={5} value={value} text={`${value}%`} />}
                                    </ProgressProvider>
                                    <Typography variant="h7" sx={{ fontWeight: 'bold', textAlign: 'center' }} gutterBottom>
                                        Personality Match
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Stack direction="row" spacing={2} sx={{ width: '100%', maxHeight: '150px' }}>
                            <Box sx={{ flexBasis: '50%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <InterestsIcon style={{ fontSize: '250%' }} />
                                    <Typography variant="h6" sx={{ alignSelf: 'center', fontWeight: 'bold', marginLeft: 1 }} gutterBottom>
                                        Shared Interests
                                    </Typography>
                                </Box>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', flexGrow: 1, marginTop: '5px', overflow: 'auto' }}>
                                    {props.listing.sharedInterests?.map((interests, index) => (
                                        <CategoryItem key={index} item={interests} category={'Interests'} />
                                    ))}
                                </div>
                            </Box>
                            <Box sx={{ flexBasis: '50%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <FilterListIcon style={{ fontSize: '250%' }} />
                                    <Typography variant="h6" sx={{ alignSelf: 'center', fontWeight: 'bold', marginLeft: 1 }} gutterBottom>
                                        Shared Criteria
                                    </Typography>
                                </Box>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', flexGrow: 1, marginTop: '5px', overflow: 'auto' }}>
                                    {props.listing.sharedLookedFor?.map((criterion, index) => (
                                        <CategoryItem key={index} item={criterion} category={'Criteria'} />
                                    ))}
                                </div>
                            </Box>

                        </Stack>
                    </Grid>

                </Grid>

            </CardContent>
        </Card>
    );
}




export default ListingCard;

