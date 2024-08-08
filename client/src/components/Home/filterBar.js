import * as React from 'react';
import { Stack, TextField } from '@mui/material';
import Slider from '@mui/material/Slider';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MuiInput from '@mui/material/Input';
import VolumeUp from '@mui/icons-material/VolumeUp';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';


function FilterBar({ listings, setFilteredListings }) {

    const [keyword, setKeyword] = React.useState()
    const [priceRange, setPriceRange] = React.useState();
    const [numTerms, setTerms] = React.useState()
    const [semester, setSemester] = React.useState()

    const Input = styled(MuiInput)`
  width: 60px;
`;

    const handleSearchChange = (event) => {
        setKeyword(event.target.value);
    };

    const handlePriceSliderChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handlePriceInputChange = (event) => {
        setPriceRange(event.target.value === '' ? 0 : Number(event.target.value));
    };
    const handleSemesterChange = (event) => {
        setSemester(event.target.value);
    };

    const handleBlur = () => {
        if (priceRange < 0) {
            setPriceRange(0);
        } else if (priceRange > 5000) {
            setPriceRange(5000);
        }
    };

    const handleLengthChange = (event) => {
        setTerms(event.target.value);
    }

    const handleFilterApply = () => {
        let filteredList = listings
        if (numTerms) {
            console.log('numterms')
            filteredList = filteredList.filter(listing => listing.length == numTerms)
        }
        if (priceRange) {
            console.log('price')
            filteredList = filteredList.filter(listing => listing.Price < priceRange)
        }
        if (keyword) {
            console.log('keyword')
            filteredList = filteredList.filter(listing => listing.title.trim().toLowerCase().includes(keyword.toLowerCase()) || listing.description.trim().toLowerCase().includes(keyword.toLowerCase()) || listing.address.trim().toLowerCase().includes(keyword.toLowerCase()))
        }
        if (semester) {
            console.log('keyword')
            filteredList = filteredList.filter(listing => listing.semester == semester)
        }
        setFilteredListings(filteredList)
    }

    const handleFilterRemove = () => {
        setFilteredListings(listings)
        setKeyword('')
        setPriceRange('')
        setTerms('')
        setSemester('')
    }

    return (
        <Box
            style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '5px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <TextField
                id="input-with-icon-textfield"
                label="Search"
                value={keyword}
                onChange={handleSearchChange}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                variant="filled"
                style={{ width: '100%', marginBottom: '20px' }}
            />
            <Box sx={{ width: '100%', marginBottom: '20px' }}>
                <Typography variant="h8" gutterBottom sx={{color: 'black'}}>
                    Price Range (Min $0 - Max $2500)
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                        <Slider
                            variant="filled"
                            sx={{color: 'black'}}
                            value={typeof priceRange === 'number' ? priceRange : 0}
                            onChange={handlePriceSliderChange}
                            aria-labelledby="input-slider"
                            min={0}
                            max={2500}
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            sx={{ backgroundColor: 'white', color: 'black' }}
                            value={priceRange}
                            size="large"
                            onChange={handlePriceInputChange}
                            onBlur={handleBlur}
                            inputProps={{
                                step: 50,
                                min: 0,
                                max: 2500,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>
            <InputLabel variant="h6">Number of Terms</InputLabel>
            <Select
                style={{ width: '100%', marginBottom: '20px' }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={numTerms}
                label="Length"
                variant="filled"
                onChange={handleLengthChange}
            >
                <MenuItem value={'1 Term'}>1 Term</MenuItem>
                <MenuItem value={'2 Terms'}>2 Terms</MenuItem>
            </Select>
            <Select
                style={{ width: '100%', marginBottom: '20px' }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={semester}
                label="Semester"
                variant="filled"
                onChange={handleSemesterChange}
            >
                <MenuItem value="Spring 2024">Spring 2024</MenuItem>
                <MenuItem value="Fall 2024">Fall 2024</MenuItem>
                <MenuItem value="Winter 2025">Winter 2025</MenuItem>
                <MenuItem value="Spring 2025">Spring 2025</MenuItem>
                <MenuItem value="Fall 2025">Fall 2025</MenuItem>
                <MenuItem value="Winter 2026">Winter 2026</MenuItem>
                <MenuItem value="Spring 2026">Spring 2026</MenuItem>
                <MenuItem value="Fall 2026">Fall 2026</MenuItem>
            </Select>
            <Box style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Button
                    variant="outlined"
                    style={{ flex: '1', fontSize: '0.8rem', backgroundColor: 'black', color: 'white'}}
                    startIcon={<FilterAltIcon />}
                    onClick={handleFilterApply}
                >
                    Apply Filter
                </Button>
                <Button
                    variant="outlined"
                    style={{ flex: '1', fontSize: '0.8rem', backgroundColor: 'black', color: 'white' }}
                    startIcon={<FilterAltOffIcon />}
                    onClick={handleFilterRemove}
                >
                    Clear Filter
                </Button>
            </Box>
        </Box>
    );
}
export default FilterBar;
