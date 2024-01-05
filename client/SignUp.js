import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Switch from '@mui/material/Switch';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SnackbarAlert from './components/SnackbarAlert';
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from 'react-router';
import { useAuth } from './components/Authorization';
import PhoneNumberField from './components/PhoneNumField';
import Sky from './components/Sky';
import HeaderDog from './components/HeaderDog';
import Footers from './components/Footer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { signinTypographyStyle } from './stylesheets/SignInStyle';
import { HeaderStyle } from './stylesheets/HeaderStyle';

export default function SignUp() {
  const [rememberMe, setRememberMe] = useState(false);
  const [watcher, setWatcher] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(false);

  // stores watcher state as a global variable
  let watcherState = false;

  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const handleSetWatcher = () => {
    const newWatcherValue = !watcher;
    watcherState = !watcher;
    setWatcher(newWatcherValue);
    console.log('Watcher state:', newWatcherValue);
  };

  const navigate = useNavigate();
  const { createUser, updateUser, user } = useAuth();

  const handleSignInClick = () => {
    navigate('/signin');
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // sends user token to server for verification
  const sendTokenToServer = async (token) => {
    try {
      const response = await fetch('http://localhost:3000/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const data = await response.json();

      if (response.ok) {
        console.log('Token verified successfully');
        console.log('User Email:', data.email);
        // sends googleId, google email, and the watcher state to createUser
        CreateUser(data.googleUserId, data.email, watcherState);
        navigate(`/homepage`);
      } else {
        // turn off loading bar
        setLoading(false);
        console.error('Token verification failed:', data.error);
      }
    } catch (error) {
      // show snackbar message that log in failed
      setSnackbarMessage('Login failed!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Error during token verification:', error);
    }
  };

  const CreateUser = async (googleId, email, isWatcher) => {
    const form = document.getElementById('form');
    const formData = new FormData(form);

    const newUser = {
      firstname: formData.get('firstName'),
      lastname: formData.get('lastName'),
      username: formData.get('userName'),
      password: formData.get('password'),
      phoneNumber: formData.get('phoneNumber'),
      googleId: googleId,
      email: email,
      watcher: isWatcher,
    };
    console.log('newUser: ', newUser);
    try {
      console.log('trying to fetch add user');
      const signedUpUser = await createUser(newUser);
      console.log('in SignUp.js line 109', signedUpUser);
      updateUser(signedUpUser);
      return signedUpUser;
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleCallbackResponse = (response) => {
    console.log('Encoded JWT ID token:' + response.credential);
    const googleIdToken = response.credential;

    sendTokenToServer(googleIdToken);
  };

  const google = window.google;
  useEffect(() => {
    google.accounts.id.initialize({
      client_id:
        '654380610871-b70h1a8224333s0jgls1fvhsrmq3r0p4.apps.googleusercontent.com',
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById('sign-in-div'), {
      theme: 'outline',
      size: 'large',
    });
  }, []);

  //styling

  return (
    <>
      <Sky />
      <Footers />
      <ThemeProvider theme={HeaderStyle.theme}>
        <Box
          sx={{
            ...HeaderStyle.style,
            minHeight: '100vh',
          }}
        >
          <Card sx={{ maxWidth: 400, width: '100%', p: 3 }}>
            <Box textAlign='center' mb={2}>
              <Typography {...signinTypographyStyle} variant='h4'>
                Sign Up
              </Typography>
            </Box>

            <Box component='form' id='form'>
              {/* Add fields for first name and last name */}
              <Box display='flex' gap={2}>
                <TextField
                  label='First Name'
                  name='firstName'
                  type='text'
                  fullWidth
                  margin='normal'
                />
                <TextField
                  label='Last Name'
                  name='lastName'
                  type='text'
                  fullWidth
                  margin='normal'
                />
              </Box>
              <PhoneNumberField />
              <TextField
                label='Username'
                name='userName'
                type='username'
                fullWidth
                margin='normal'
              />
              <TextField
                label='Password'
                name='password'
                type='password'
                fullWidth
                margin='normal'
              />
              <Box display='flex' alignItems='center' mt={2}>
                <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                <Typography variant='body2' color='textSecondary'>
                  &nbsp;&nbsp;Remember me
                </Typography>
                <Switch
                  checked={watcher}
                  onChange={handleSetWatcher}
                  sx={{ marginLeft: '25px' }}
                />
                <Typography variant='body2' color='textSecondary'>
                  &nbsp;&nbsp;Sign In as Watcher
                </Typography>
              </Box>
              <Button
                variant='text'
                color='primary'
                fullWidth
                mt={2} /*
              onClick={handleSignIn}*/
                onClick={async () => {
                  await CreateUser(undefined, undefined, watcher);
                  setSnackbarMessage('Signup successful!');
                  setSnackbarSeverity('success');
                  setSnackbarOpen(true);
                  navigate('/homepage');
                }}
                disabled={loading}
              >
                Sign Up
              </Button>
              {loading && (
                <LinearProgress color='primary' sx={{ marginTop: 2 }} />
              )}
              <SnackbarAlert
                open={snackbarOpen}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                severity={snackbarSeverity}
              />
            </Box>

            <Box mt={2} textAlign='center'>
              <Typography variant='body2' color='textSecondary'>
                Have an account?{' '}
                <Link
                  variant='body2'
                  style={{ cursor: 'pointer' }}
                  onClick={handleSignInClick}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Card>
          <div id='sign-in-div'></div>
        </Box>
      </ThemeProvider>
    </>
  );
}

// const handleSignIn = async () => {
//   try {
//   // initiate loading bar
//   setLoading(true);

//   // fake loading time
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   if (!response.ok){
//     throw new Error('Login failed!');
//   }
//   // if successful
//   setSnackbarMessage("Login successful!");
//   setSnackbarSeverity("success");
//   setSnackbarOpen(true);
//   // navigate('/homepage');

//   }catch(error){
//   //if error
//   setSnackbarMessage("Login failed!");
//   setSnackbarSeverity("error");
//   setSnackbarOpen(true);
//   }
//   finally {
//     // turn off loading bar
//     setLoading(false);
//   }
// };
