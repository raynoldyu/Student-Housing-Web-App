import React from 'react';
import { Link } from 'react-router-dom';
import image from '../../images/landingPageImg2.jpg'
import { Grid, Typography } from '@mui/material';
import { Stack } from 'react-bootstrap';


const LandingPage = () => {
    

    return (
        <div style={{ height: '100vh', width: '100vw', backgroundColor: '#99C9DD' }}>
            <Grid container>
                <Grid item xs={7} spacing={0}>
                    <img style={{ display: 'block', width: '100%', height: '90%', margin: '0px' }} src={image} />
                    <div style={{height: '10%', backgroundColor: '#99C9DD'}}/>
                </Grid>
                <Grid item xs={5}>
                    <div style={{height: '4%', backgroundColor: '#DAE5EB'}}/>
                    <div style={{height: '96%', width: '100%', backgroundColor: '#99C9DD', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography variant='h1' style={{padding: '25px', color: '#000000'}}>Welcome to your housing solution.</Typography>
                        <Typography variant='h4' style={{padding: '25px', color: '#000000'}}>Streamline Your Rental Experience. Connect with other waterloo students in under 10 minutes</Typography>
                        <Link to='/SignIn' style={{textDecoration: 'none'}}>
                            <button style={{padding: '15px', width: '200px', height: '50px', backgroundColor: '#000000', color: '#FFFFFF', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Get Started</button>
                        </Link>
                    </div>
                </Grid>
            </Grid>
            <div style={{height: '10%', backgroundColor: '#99C9DD'}}/>
        </div>
    );
};

export default LandingPage;
