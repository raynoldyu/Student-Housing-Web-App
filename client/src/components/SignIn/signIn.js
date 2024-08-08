import * as React from 'react';
import {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {Select} from '@mui/material';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {FormLabel} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import {useNavigate} from 'react-router-dom';
import {useUserAuth} from '../../contexts/AuthContext';
import {auth} from '../Firebase/config';


export default function SignIn() {

  const navigate = useNavigate();
  const [userCredentials, setUserCredentials] = useState({});
  const [errorStatus, setErrorStatus] = useState(false);
  const [error, setError] = useState('');
  const {signIn, user} = useUserAuth();

  //const { user, login } = React.useContext(AuthProvider);

  const handleCredentials = e => {
    setErrorStatus(false);
    setError('');
    setUserCredentials({...userCredentials, [e.target.name]: e.target.value});
  };

  const callApiSignIn = async userToken => {
    const url = '/api/signIn';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({userToken: userToken}),
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };


  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await signIn(userCredentials.email, userCredentials.password);
      auth.currentUser
        .getIdToken(/* forceRefresh */ true)
        .then(function (idToken) {
          // Send token to your backend via HTTPS
          callApiSignIn(idToken).then(navigate('/'));
        })
        .catch(function (error) {
          // Handle error
        });
    } catch (err) {
      setErrorStatus(true);
      setError(err.message);
    }
  }

  return (
    <div style={{height: '100vh', width: '100vw', backgroundColor: '#DAE5EB', marginTop: '0px', display: 'flex', justifyContent: 'center'}}>
      <Container component="main" maxWidth="xs" >
        <CssBaseline />
        <Box
          style={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <IconButton
            sx={{alignSelf: 'flex-start', color: 'black'}}
            onClick={() => navigate('/')} // Navigate to the main page
            aria-label="Back to main page"
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <Avatar sx={{m: 1, bgcolor: 'black'}}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" style={{fontWeight: 'bold'}}>
            Sign In
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  sx={{backgroundColor: 'white', borderRadius: '5px'}}
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
                sx={{backgroundColor: 'white', borderRadius: '5px'}}
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
            </Grid>
            <FormLabel error={true} disabled={errorStatus}>
              {error}
            </FormLabel>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{mt: 3, mb: 2, backgroundColor: 'black', color: 'white', height: '50px'}}
              onClick={e => handleSubmit}
            >
              Log In
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/SignUp" variant="h6" style={{color: 'black'}}>
                  Don't have an Account? Sign Up!
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      </div>
  );
}
