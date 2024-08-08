import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import {Box} from '@mui/material';
import Listing from './listing';
import LandLordListing from './landLordListing';

const ListingView = ({listings, handleClick}) => {


  return (
    <Box sx={{flexGrow: 1}} style={{margin: '25px'}}>
      <Grid container spacing={{xs: 2, md: 2}} columns={{xs: 4, sm: 8, md: 12}}>

        {
          listings?.map((listing) => (
            <Grid xs={2} sm={4} md={6} key={listing.postingID}>
              <Listing
                listing={listing}
                handleClick={handleClick}
              />
            </Grid>
          ))
  }
      </Grid>
    </Box>
  );
};

export default ListingView;
