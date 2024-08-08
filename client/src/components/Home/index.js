import * as React from 'react';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import ListingView from '../listing/listingView';
import ResponsiveAppBar from '../Navigation/appBar';
import FilterBar from './filterBar';
import Pagination from '@mui/material/Pagination';
import { calculateAverageSimilarity } from '../../calculations/groupSimilarity';
import { useUserAuth } from '../../contexts/AuthContext';
import { memo } from 'react';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Home = () => {

  // const [listings, setListings] = React.useState([])
  // const [filteredListings, setFilteredListings] = React.useState([])
  const { userData, listings, setListings, filteredListings, setFilteredListings, fetchListings, fetchListingData } = useUserAuth()
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState([]);
  const postsPerPage = 10;

  const fetch = require('node-fetch');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        let listingData = listings;

        if (listingData.length === 0) {
          listingData = await fetchListingData();
        }

        // Calculate total pages
        const numPages = Math.ceil(listingData.length / postsPerPage);
        setTotalPages(numPages);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData()
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        let listingData = await fetchListingData();

        // Calculate total pages
        const numPages = Math.ceil(listingData.length / postsPerPage);
        setTotalPages(numPages);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData()
  }, [userData]);


  React.useEffect(() => {
    let numPages = Math.ceil(filteredListings.length / 10)
    setTotalPages(numPages)
  }, [filteredListings])

  const callApiAddToShortlist = async listing => {
    const url = '/api/addToShortlist';
    const userToken = sessionStorage.getItem('userToken');
    const userRole = sessionStorage.getItem('userRole');

    let postingData = {
      userToken: userToken,
      postingID: listing.postingID,
      userRole: userRole,
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
  const handleClick = async clickedIndex => {
    const updatedListings = listings.map(listing => {
      if (listing.postingID === clickedIndex) {
        console.log(listing.postingID)
        if (listing.shortListed) {
          callApiRemoveFromShortlist(listing);
        } else {
          callApiAddToShortlist(listing);
        }
        return { ...listing, shortListed: !listing.shortListed };
      }
      return listing;
    });

    setListings(updatedListings);
    setFilteredListings(updatedListings);
  };

 


  const handlePageChange = (event, value) => {
    setCurrentPage(value)
  }

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredListings.slice(indexOfFirstPost, indexOfLastPost)


  return (
    <div style={{backgroundColor: 'white'}}>
      <ResponsiveAppBar />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50px' }}>
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
      </div>
      <Grid container spacing={1} columns={16}>
        <Grid item xs={3}>
          <FilterBar listings={listings} setFilteredListings={setFilteredListings} />
        </Grid>
        <Grid item xs={13}>
          <ListingView listings={currentPosts} handleClick={handleClick} />
        </Grid>
      </Grid>
    </div>
  );
};

export default memo(Home);
