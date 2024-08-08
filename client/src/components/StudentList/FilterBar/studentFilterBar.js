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
import Autocomplete from '@mui/material/Autocomplete';
import Tags from './tags';


function StudentFilterBar({ students, setFilteredStudents }) {

    const [keyword, setKeyword] = React.useState('')
    const [criteria, setCriteria] = React.useState([])
    const [interests, setInterests] = React.useState([])
    const [personalityMatch, setPersonalityMatch] = React.useState('')
    const [year, setYear] = React.useState('')
    const [gender, setGender] = React.useState('')
    const [semester, setSemester] = React.useState('')
    // Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
    const top100Films = [
        'Friends',
        'Party',
        'Study',
        'Quiet'
    ];

    const handleKeywordChange = (event) => {
        setKeyword(event.target.value);
    };

    const handleCriteriaChange = (criterium) => {
        setCriteria(criterium);
    };

    const handleInterestsChange = (interest) => {
        setInterests(interest);
    };

    const handlePersonalityMatchChange = (event) => {
        setPersonalityMatch(event.target.value);
    };

    const handleYearChange = (event) => {
        setYear(event.target.value);
    };

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    const handleSemesterChange = (event) => {
        setSemester(event.target.value);
    };

    const handleFilterApply = () => {
        const filtered = students.filter(student => {
            return (
                (student.firstName.toLowerCase().includes(keyword.toLowerCase()) || student.lastName.toLowerCase().includes(keyword.toLowerCase()) || keyword === '') &&
                (criteria.length === 0 || student.lookingFor.some(c => criteria.includes(c))) &&
                (interests.length === 0 || student.interests.some(i => interests.includes(i))) &&
                (personalityMatch === '' || student.personalityMatch >= personalityMatch) &&
                (year === '' || student.year === year) &&
                (gender === '' || student.gender === gender)
            );
        });

        setFilteredStudents(filtered);
    }

    const handleFilterRemove = () => {
        setKeyword('');
        setCriteria([]);
        setInterests([]);
        setPersonalityMatch('');
        setYear('');
        setGender('');
        setSemester('');
        setFilteredStudents(students);
    }

    return (
        <Box
            style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '5px',
                width: '90%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <TextField
                id="keyword-input"
                label="Search Names"
                value={keyword}
                onChange={e => handleKeywordChange(e)}
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
            <Autocomplete
                multiple
                limitTags={3}
                id="tags-standard"
                options={top100Films}
                value={criteria}
                style={{ width: '100%', marginBottom: '20px' }}
                onChange={(event, value) => handleCriteriaChange(value)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Criteria"
                        placeholder="Criteria"
                    />
                )}
            />
            <Autocomplete
                multiple
                limitTags={3}
                id="tags-standard"
                options={top100Films}
                value={interests}
                style={{ width: '100%', marginBottom: '20px' }}
                onChange={(event, value) => handleInterestsChange(value)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Interests"
                        placeholder="Interests"
                    />
                )}
            />
            <Typography id="personalityMatch-label" gutterBottom>
                Minimum Personality Match
            </Typography>
            <Slider
                id="personalityMatch-input"
                track="inverted"
                style={{ width: '80%', marginBottom: '20px',color: 'black' }}
                value={personalityMatch}
                onChange={e => handlePersonalityMatchChange(e)}
                aria-labelledby="range-slider"
                valueLabelDisplay="auto"
                min={0}
                max={100}
                marks={[
                    {
                        value: 0,
                        label: '0% Match',
                    },
                    {
                        value: 100,
                        label: '100% Match',
                    },
                ]}
            />
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Year</InputLabel>
                <Select
                    id="year-input"
                    label="Year"
                    style={{ width: '100%', marginBottom: '20px' }}
                    value={year}
                    onChange={e => handleYearChange(e)}
                    variant="filled"
                >
                    <MenuItem value={"1st Year"}>1st Year</MenuItem>
                    <MenuItem value={"2nd Year"}>2nd Year</MenuItem>
                    <MenuItem value={"3rd Year"}>3rd Year</MenuItem>
                    <MenuItem value={"4th Year"}>4th Year</MenuItem>
                    <MenuItem value={"5th Year"}>5th Year</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                <Select
                    id="gender-input"
                    label="Gender"
                    value={gender}
                    onChange={e => handleGenderChange(e)}
                    variant="filled"
                    style={{ width: '100%', marginBottom: '20px' }}
                >
                    <MenuItem value={"Male"}>Male</MenuItem>
                    <MenuItem value={"Female"}>Female</MenuItem>
                    <MenuItem value={"other"}>Other</MenuItem>
                </Select>
            </FormControl>
            <Box style={{ display: 'flex', width: '100%' }}>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ flex: '1', fontSize: '0.9rem', fontWeight: 'bold', marginRight: '10px', backgroundColor: 'black', color: 'white' }}
                    startIcon={<FilterAltIcon />}
                    onClick={handleFilterApply}
                >
                    Apply Filter
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    style={{ flex: '1', fontSize: '0.9rem', fontWeight: 'bold', backgroundColor: 'black', color: 'white'}}
                    startIcon={<FilterAltOffIcon />}
                    onClick={handleFilterRemove}
                >
                    Clear Filter
                </Button>
            </Box>
        </Box>
    );
}
export default StudentFilterBar;
