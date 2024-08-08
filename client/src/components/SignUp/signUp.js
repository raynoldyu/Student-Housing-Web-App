import * as React from 'react';
import { useState } from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Radio, RadioGroup } from '@mui/material';
import { FormLabel } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { MenuItem } from '@mui/material'
import { Select as MuiSelect } from '@mui/material'
import { FormControl } from '@mui/material'
import { InputLabel } from '@mui/material'
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';

import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../contexts/AuthContext';
import { auth } from '../Firebase/config.js';
import PersonalityTest from './personalityTest.js';


export default function SignUp() {
  //const { user, login } = React.useContext(AuthProvider);
  const navigate = useNavigate();
  const [errorStatus, setErrorStatus] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userCredentials, setUserCredentials] = useState({});
  const { signUp, setIsSignedUp } = useUserAuth();


  const criteria = [
    "Clean",
    "Male",
    "Female",
    "Non-binary",
    "Close proximity",
    "Quiet",
    "Affordable",
    "Spacious",
    "Furnished",
    "Safe neighborhood",
    "Pet-friendly",
    "Parking",
    "Utilities included",
    "Laundry",
    "Gym",
    "Pool",
    "Accessibility",
    "Privacy",
    "Natural light",
    "Air conditioning",
    "Heating",
    "Internet",
    "Storage",
    "Appliances",
    "Outdoor space",
    "Maintenance",
    "Convenience",
    "School district",
    "Community",
    "Flexibility",
    "Sustainability",
    "Rental insurance",
    "Smoking policy",
    "Students",
    "Food",
    "Apartment",
    "House",
    "Reliable",
    "Creditworthy",
    "Employment",
    "Background check",
    "References",
    "Financial stability",
    "Lease compliance",
    "Maintenance skills",
    "Trustworthy",
    "Legal status",
    "Compatibility",
    "Property value",
    "Insurance coverage",
    "Awareness of laws",
    "Agreement",
    "Security deposit",
    "Lifestyle",
    "Occupation",
    "Tenant rights",
    "Flexibility",
    "Intended use",
    "References",
    "Family size",
    "Insurance",
    "Cleanliness",
    "Respectful",
    "Communication",
    "Privacy",
    "Lease duration",
    "Rent payment"
  ]

  const interests = [
    "coding",
    "Reading",
    "Traveling",
    "Cooking",
    "Baking",
    "Photography",
    "Hiking",
    "Outdoor Activities",
    "Gardening",
    "Yoga",
    "Meditation",
    "Painting",
    "Drawing",
    "Music",
    "Watching Movies",
    "TV Shows",
    "Playing Sports",
    "Basketball",
    "Soccer",
    "Tennis",
    "Cycling",
    "Writing",
    "DIY Projects",
    "Home Improvement",
    "Gaming",
    "Video Games",
    "Board Games",
    "Volunteer Work",
    "Community Service",
    "Fashion",
    "Shopping",
    "Pets",
    "Astronomy",
    "Stargazing",
    "Fitness",
    "Exercise Classes",
    "Singing",
    "Dancing",
    "Skiing",
    "Snowboarding",
    "Surfing",
    "Scuba Diving",
    "Snorkeling",
    "Bird Watching",
    "Collecting",
    "Cooking Classes",
    "Wine Tasting",
    "Learning Language",
    "Historical Tours",
    "Creative Writing",
    "Fishing",
    "Kayaking",
    "Canoeing",
    "Rock Climbing",
    "Archery",
    "Pottery",
    "Ceramics",
    "Theater",
    "Performing Arts",
    "Horseback Riding",
    "Martial Arts",
    "Sculpting",
    "Antiquing",
    "Book Club",
    "Technology",
    "Computer Programming",
    "Motorcycling",
    "Skydiving",
    "Camping",
    "Stand-up Comedy"
]



  const handleCredentials = e => {
    setErrorStatus(false);
    setError('');
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  };

  const handleTraitSelect = (selectedOption) => {
    // If number of selected options exceeds 5, prevent further selection
    if (selectedOption.length > 5) return;
    setUserCredentials({ ...userCredentials, ['lookingFor']: selectedOption });
  };

  const handleInterestSelect = (selectedOption) => {
    // If number of selected options exceeds 5, prevent further selection
    if (selectedOption.length > 5) return;
    setUserCredentials({ ...userCredentials, ['interests']: selectedOption });
  };


  const callApiSignUp = async (userToken, NewUser) => {
    const url = '/api/signUp';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userToken
      },
      body: JSON.stringify({ user: NewUser }),
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setIsSignedUp(false)
      await signUp(userCredentials.email, userCredentials.password);
      const currentUser = auth.currentUser;

      if (currentUser) {
        const idToken = await currentUser.getIdToken(true);
        callApiSignUp(idToken, userCredentials)
          .then(res => {
            //I think change to context state
            sessionStorage.setItem('userRole', userCredentials.role);
            sessionStorage.setItem('firstName', userCredentials.firstName);
            sessionStorage.setItem('userToken', idToken);
            setIsSignedUp(true)
          })
          .then(navigate('/'));
      }

    } catch (err) {
      setErrorStatus(true);
      setError(err.message);
    }
  }

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconButton
          sx={{ alignSelf: 'flex-start' }}
          onClick={() => navigate('/')} // Navigate to the main page
          aria-label="Back to main page"
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={e => handleCredentials(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                onChange={e => handleCredentials(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={e => handleCredentials(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                onChange={e => handleCredentials(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="role"
                onChange={e => handleCredentials(e)}
              >
                <FormControlLabel
                  value="Student"
                  control={<Radio />}
                  label="Student"
                />
                <FormControlLabel
                  value="Landlord"
                  control={<Radio />}
                  label="Landlord"
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="age"
                label="Age"
                type="number"
                id="age"
                onChange={e => handleCredentials(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <MuiSelect
                  labelId="gender-label"
                  id="gender"
                  name="gender"
                  value={userCredentials.gender}
                  onChange={e => handleCredentials(e)}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </MuiSelect>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="program"
                label="Program"
                id="program"
                onChange={e => handleCredentials(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="year-label">Year</InputLabel>
                <MuiSelect
                  labelId="year-label"
                  id="year"
                  name="year"
                  value={userCredentials.year}
                  onChange={e => handleCredentials(e)}
                >
                  <MenuItem value="1st Year">1st Year</MenuItem>
                  <MenuItem value="2nd Year">2nd Year</MenuItem>
                  <MenuItem value="3rd Year">3rd Year</MenuItem>
                  <MenuItem value="4th Year">4th Year</MenuItem>
                  <MenuItem value="5th Year">5th Year</MenuItem>
                </MuiSelect>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <div>Now tell us three things you want in a sublet/landlord!</div>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="tags-standard"
                options={criteria}
                freeSolo
                onChange={(event, value) => handleTraitSelect(value)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="filled"
                    label="Criteria"
                    placeholder="Clean, Quiet, etc."
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <div>Now tell us three interests you have!</div>
            </Grid>
            <Grid item xs={12}>
            <Autocomplete
                multiple
                id="tags-standard"
                options={interests}
                freeSolo
                onChange={(event, value) => handleInterestSelect(value)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="filled"
                    label="Interests"
                    placeholder="Sports, Music, etc."
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <div>Now please complete this 10 question survey so we can find you the best match possible!</div>
            </Grid>
            <PersonalityTest userCredentials={userCredentials} setUserCredentials={setUserCredentials} />
          </Grid>


          <FormLabel error={true} disabled={errorStatus}>
            {error}
          </FormLabel>
          <Button
            disabled={loading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={e => handleSubmit}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/SignIn" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
