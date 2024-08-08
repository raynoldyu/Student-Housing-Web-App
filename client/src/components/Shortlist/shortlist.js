import React, { useState, useEffect, useContext } from 'react';

import ResponsiveAppBar from '../Navigation/appBar';
import { useUserAuth } from '../../contexts/AuthContext';
import Listing from '../listing/listing';
import { Box, Grid } from '@mui/material';
import ListingView from '../listing/listingView';

const Shortlist = () => {
  /*
  const [savedListings, setSavedListings] = useState([]);
  const { listings } = useUserAuth();
  const fetch = require('node-fetch');

  React.useEffect(() => {

  }, []);

  const callApiGetShortlistIDs = async () => {
    const url = '/api/getShortlistIDs';
    const userToken = sessionStorage.getItem('userToken');

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

  const callApiRemoveFromShortlist = async listing => {
    const url = '/api/removeFromShortlist';
    const userToken = sessionStorage.getItem('userToken');

    let postingData = {
      userToken: userToken,
      postingID: listing.postingID,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userToken
      },
      body: JSON.stringify({ data: postingData }),
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  //handles what happens when Shortlist Button is clicked on each listijng
  const handleClick = clickedIndex => {
    console.log(clickedIndex);
    setListings(prevState => {
      return prevState
        .map((listing) => {
          if (listing.postingID === clickedIndex) {
            callApiRemoveFromShortlist(listing);
            return null;
          }
          return listing;
        })
        .filter(listing => listing !== null);
    });
    setFilteredListings(prevState => {
      return prevState
        .map((listing) => {
          if (listing.postingID === clickedIndex) {
            callApiRemoveFromShortlist(listing);
            return null;
          }
          return listing;
        })
        .filter(listing => listing !== null);
    });
  };
  */

  const { listings, setListings, setFilteredListings } = useUserAuth();
  const [shortListedListings, setShortListedListings] = useState([]);

  useEffect(() => {
    const shortListed = listings.filter(listing => listing.shortListed);
    setShortListedListings(shortListed);
  }, [listings]);

  const handleClick = async (id) => {
    // Call the API to remove from shortlist
    await callApiRemoveFromShortlist(id);

    // Update the shortListedListings state
    const updatedShortListed = shortListedListings.filter(listing => listing.postingID !== id);
    setShortListedListings(updatedShortListed);

    // Update the listings state
    const updatedListings = listings.map(listing => {
      if (listing.postingID === id) {
      return { ...listing, shortListed: false };
      }
      return listing;
    });
    console.log(updatedListings)
    setListings([...updatedListings]);
    setFilteredListings([...updatedListings]);
    
  };

  const callApiRemoveFromShortlist = async postingID => {
    const url = '/api/removeFromShortlist';
    const userToken = sessionStorage.getItem('userToken');

    let postingData = {
      userToken: userToken,
      postingID: postingID,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userToken
      },
      body: JSON.stringify({ data: postingData }),
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };


  return (
    <div>
      <ResponsiveAppBar />
      {shortListedListings.length === 0 && <h1>No shortlisted listings</h1>}
      <ListingView listings={shortListedListings} handleClick={handleClick} />
    </div>
  );
};

export default Shortlist;
