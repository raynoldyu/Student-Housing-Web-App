import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import Grid from '@mui/material/Unstable_Grid2';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import ImageGallery from './ImageGallery';
import CategoryItem from '../CategoryItem/CategoryItem';
import Stack from '@mui/material/Stack';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import ProgressProvider from './percentageBar/ProgressProvider';
import Resident from './Resident/Resident';
import InterestsIcon from '@mui/icons-material/Interests';
import FilterListIcon from '@mui/icons-material/FilterList';
import PsychologyIcon from '@mui/icons-material/Psychology';
import GroupsIcon from '@mui/icons-material/Groups';
import ReviewsIcon from '@mui/icons-material/Reviews';
import 'react-circular-progressbar/dist/styles.css';



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function FullScreenDialog(props) {

    const [open, setOpen] = React.useState(false);
    const [shortlisted, setShortlisted] = React.useState(props.listing.shortListed)
    const [images, setImages] = React.useState([])
    const [reviews, setReviews] = React.useState(JSON.parse(props.listing.reviews))
    const [residentData, setResidentData] = React.useState([])

    React.useEffect(() => {
        let places = [];
        if (open == true) {
            callApiGetResidentData(props.listing.postingID)
                .then(res => {
                    setResidentData(JSON.parse(res.express))
                })
            callApiGetListingImages(props.listing.postingID)
                .then(res => {
                    var imageList = JSON.parse(res.express)
                    const base64list = imageList.map(({ image }) => ({ image }));
                    setImages(base64list)
                })
        }
    }, [open])


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const callApiGetListingImages = async (postingID) => {
        const userToken = sessionStorage.getItem('userToken');
        const url = "/api/getListingImages";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: userToken
            },
            body: JSON.stringify({ postingID: postingID })
        });

        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    const callApiGetResidentData = async (postingID) => {
        const userToken = sessionStorage.getItem('userToken');
        const url = "/api/getResidentData";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: userToken
            },
            body: JSON.stringify({ postingID: postingID })
        });

        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }


    return (
        <React.Fragment>
            <Button
                variant="outlined"
                style={{ width: '30%', backgroundColor: 'black', color: 'white' }}
                startIcon={<ExpandCircleDownIcon />}
                onClick={handleClickOpen}
            >
                Open
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative', height: '8vh', backgroundColor: 'black', color: 'white' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Listing
                        </Typography>
                        {props.listing.shortListed ? (
                            <Button
                                variant="outlined"
                                sx={{ background: '#FFFFFF' }}
                                onClick={() => props.handleClick(props.index)}
                                startIcon={<PlaylistAddCheckIcon />}
                            >
                                Shortlisted
                            </Button>
                        ) : (
                            <Button
                                variant="outlined"
                                sx={{ background: '#FFFFFF' }}
                                onClick={() => props.handleClick(props.index)}
                                startIcon={<PlaylistAddIcon />}
                            >
                                Shortlist
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>

                <Grid container columns={16} style={{ height: '92vh', width: '100%' }}>
                    <Grid md={9} style={{ height: '100%' }}>
                        <ImageGallery images={images} />
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '45%', padding: '10px' }}>
                            <div style={{ backgroundColor: '#000000', height: '100%', width: '650px' }}>
                                <iframe src={props.listing.map}
                                    style={{width: "650px",height: "100%"}}
                                    loading="lazy">
                                </iframe>
                            </div>
                        </div>
                    </Grid>
                    <Grid md={7} sx={{ height: '100%', padding: '10px', overflowY: 'auto' }}>
                        <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Stack spacing={1}>
                                <Typography variant="h4" style={{ fontWeight: 'bold' }}>{props.listing.title}</Typography>
                                <Stack direction="row" spacing={2}>
                                    <Typography variant="h5" style={{ fontWeight: 'bold' }} gutterBottom>${props.listing.Price}/month</Typography>
                                    <Divider orientation="vertical" sx={{ backgroundColor: 'black' }} />
                                    <Typography variant="h5" style={{ fontWeight: 'bold' }} gutterBottom>{props.listing.semester}</Typography>
                                    <Divider orientation="vertical" sx={{ backgroundColor: 'black' }} />
                                    <Typography variant="h5" style={{ fontWeight: 'bold' }} gutterBottom>{props.listing.length}</Typography>
                                </Stack>
                                <Typography variant="h5" gutterBottom>{props.listing.address}</Typography>
                                <Box>
                                    <Typography variant="h5" gutterBottom>{props.listing.landlordEmail}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1" gutterBottom>{props.listing.description}</Typography>
                                </Box>
                                <Box style={{ marginTop: '40px' }}>
                                    <Grid container columns={16}>
                                        <Grid md={7} >
                                            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', marginRight: '25px' }} gutterBottom>
                                                <PsychologyIcon style={{ marginRight: '10px', fontSize: '250%' }} /> Personality Match:
                                            </Typography>
                                        </Grid>

                                        <Grid md={9}>
                                            <Box sx={{ paddingRight: '25%' }}>
                                                <ProgressProvider valueStart={0} valueEnd={props.listing.personalityMatch}>
                                                    {value => <CircularProgressbar styles={buildStyles({ pathColor: `rgba(62, 152, 199)` })} strokeWidth={5} value={value} text={`${value}%`} />}
                                                </ProgressProvider>
                                            </Box>
                                        </Grid>

                                    </Grid>
                                </Box>
                                <Box style={{ marginTop: '40px' }}>
                                    <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', marginRight: '25px' }} gutterBottom>
                                        <FilterListIcon style={{ marginRight: '10px', fontSize: '250%' }} /> Criteria:
                                    </Typography>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
                                        {props.listing.residentLookedFor?.map((criterion, index) => (
                                            <CategoryItem key={index} item={criterion} category={'Criteria'} />
                                        ))}
                                    </div>
                                </Box>
                                <Box style={{ marginTop: '40px' }}>
                                    <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', marginRight: '25px' }} gutterBottom>
                                        <InterestsIcon style={{ marginRight: '10px', fontSize: '250%' }} /> Interests:
                                    </Typography>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
                                        {props.listing.residentInterests?.map((criterion, index) => (
                                            <CategoryItem key={index} item={criterion} category={'Interests'} />
                                        ))}
                                    </div>
                                </Box>

                                <Box style={{ display: 'flex', flexDirection: 'column', marginTop: '40px' }}>
                                    <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }} gutterBottom>
                                        <GroupsIcon style={{ marginRight: '10px', fontSize: '250%' }} /> Residents:
                                    </Typography>
                                    <Resident residentData={residentData} />
                                </Box>

                                <Box sx={{ width: '100%', height: '500px', padding: 'inherit' }}>
                                    <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }} gutterBottom>
                                        <ReviewsIcon style={{ marginRight: '10px', fontSize: '250%' }} /> Reviews:
                                    </Typography>
                                    <Stack spacing={1} style={{ marginLeft: '50px', paddingLeft: '16px' }}>
                                        {reviews?.map((review) => (
                                            <>
                                                <Box sx={{ display: 'flex', alignItems: 'bottom' }}>
                                                    <AccountCircleIcon sx={{ marginRight: '8px' }} />
                                                    <Typography variant="h6" gutterBottom>{review.username}</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'bottom' }}>
                                                    <Rating name="read-only" value={review.reviewScore} readOnly></Rating>
                                                    <Typography variant="body1" gutterBottom> - {review.reviewDescription}</Typography>
                                                </Box>

                                            </>
                                        ))}
                                    </Stack>
                                </Box>
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>

            </Dialog>
        </React.Fragment >
    );
}
