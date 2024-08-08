import * as React from 'react';
import LandLordListing from '../listing/landLordListing';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import ListingView from '../listing/listingView';
import ResponsiveAppBar from '../Navigation/appBar';
import { useRadioGroup } from '@mui/material';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../contexts/AuthContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const UploadedPostings = () => {
  const fetch = require('node-fetch');
  const navigate = useNavigate();

  const [listings, setListings] = React.useState([]);

  React.useEffect(() => {
    // Send token to your backend via HTTPS
    const userToken = sessionStorage.getItem('userToken');
    callApiGetMyListings(userToken).then(res => {
      var parsed = JSON.parse(res.express);
      setListings(parsed);
    });
  }, []);

  const callApiGetMyListings = async userToken => {
    const url = '/api/MyListings';

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
  };

  const callApiRemoveListing = async (postingID, landlordID) => {
    const userToken = sessionStorage.getItem('userToken');
    const url = '/api/removeListing';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userToken
      },
      body: JSON.stringify({ postingID: postingID, landlordID: landlordID }),
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  const handleRemoveListing = (postingID, landlordID) => {
    callApiRemoveListing(postingID, landlordID)
      .then(
        setListings(prevListings => prevListings.filter(listing => listing.postingID !== postingID))
      )
  }


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <ResponsiveAppBar />
      <div>
      <Button
        variant="contained"
        onClick={e => navigate('/submitPosting')}
        startIcon={<AddIcon />}
        fullWidth
        sx={{
          mt: 2,
          fontWeight: 'bold',
          backgroundColor: '#f44336',
          color: '#ffffff',
          height: '48px', // Set the height to 48px
          width: '200px' // Set the width to 200px
        }}
      >
        Submit New Listing
      </Button>
      </div>
      <div>
        <Grid container spacing={2} style={{ marginTop: '16px' }}>
          {listings.map((listing) => (
            <Grid item xs={6} key={listing.id}>
              <LandLordListing listing={listing} handleRemoveListing={handleRemoveListing} />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default UploadedPostings;
