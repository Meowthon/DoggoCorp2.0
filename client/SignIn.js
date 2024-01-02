import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SnackbarAlert from "./components/SnackbarAlert";
import LinearProgress from "@mui/material/LinearProgress";
import Sky from "./components/Sky";
import Footers from "./components/Footer";
import { useNavigate } from "react-router";
import { useAuth } from './components/Authorization';
import { ThemeProvider, createTheme } from "@mui/material/styles";


export default function SignIn() {
  const [rememberMe, setRememberMe] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const { getUser } = useAuth();
  const { updateUser } = useAuth();

  const headerFont = createTheme({  //this shit is not working
    typography: {
      fontFamily: [
        'Pixelify Sans',
        'sans-serif',
      ].join(','),
    },
  });

  // close snakbar alert if clicked off screen
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // if users click dign up redirect to sign up screen
  const handleSignInClick = () => {
    navigate("/signup");
  };

  // sends user token to server for verification
  const sendTokenToServer = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const data = await response.json();

      if (response.ok) {
        console.log("Token verified successfully");
        console.log("User ID:", data.googleUserId);
        const user = await verifyUserId(data.googleUserId);
        await verifyUserId(data.googleUserId);

        const userInfo = {
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          phoneNumber: user.phoneNumber,
          googleId: data.googleUserId,
          email: data.email,
          watcher: user.isWatcher,
        }

        updateUser(userInfo);

        navigate(`/homepage`);
      } else {
        // turn off loading bar
        setLoading(false);
        console.error("Token verification failed:", data.error);
      }
    } catch (error) {
      // show snackbar message that log in failed
      setSnackbarMessage("Login failed!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error during token verification:", error);
    }
  };

  const verifyUserId = async (googleId) => {
    try {
      const user = await getUser(googleId); 
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // if users enter log in info without oauth
  const handleSignIn = async () => {
    try {
      // initiate loading bar
      setLoading(true);

      // fake loading time
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const googleIdToken = response.credential;

      // Send the token to the server for verification
      await sendTokenToServer(googleIdToken);

      // if successful
      setSnackbarMessage("Login successful!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      navigate("/homepage");
    } catch (error) {
      // if error
      setSnackbarMessage("Login failed!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      // turn off loading bar
      setLoading(false);
    }
  };

  const handleCallbackResponse = (response) => {
    console.log("Encoded JWT ID token:" + response.credential);
    const googleIdToken = response.credential;

    sendTokenToServer(googleIdToken);
  };

  const google = window.google;
  useEffect(() => {
    google.accounts.id.initialize({
      client_id:
        "654380610871-b70h1a8224333s0jgls1fvhsrmq3r0p4.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("sign-in-div"), {
      theme: "outline",
      size: "large",
    });
  }, []);

  return (
    <div className="login">
      <ThemeProvider theme={headerFont}>
      <Sky />
      <Footers />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Card sx={{ maxWidth: 400, width: "100%", p: 3 }}>
          <Box textAlign="center" mb={2}>
            <Typography
              variant="h3"
              fontWeight="medium"
              fontFamily="Pixelify Sans"
              sx={{
                color: "pink",
                textShadow:
                  "-1px -1px white, 1px 1px hotpink, 2px 2px hotpink, 3px 3px 3px #9e9e9e",
              }}
            >
              Sign in
            </Typography>
          </Box>

          <Box component="form">
            <TextField
              label="Username"
              type="username"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
            />
            <Box display="flex" alignItems="center" mt={2}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <Typography variant="body2" color="textSecondary">
                &nbsp;&nbsp;Remember me
              </Typography>
            </Box>
            <Button
              variant="text"
              color="primary"
              fullWidth
              mt={2}
              onClick={handleSignIn}
              disabled={loading}
            >
              Sign In
            </Button>
            {loading && (
              <LinearProgress color="primary" sx={{ marginTop: 2 }} />
            )}
            <SnackbarAlert
              open={snackbarOpen}
              onClose={handleSnackbarClose}
              message={snackbarMessage}
              severity={snackbarSeverity}
            />
          </Box>
          <Box mt={2} textAlign="center">
            <Typography variant="body2" color="textSecondary">
              Don't have an account?{" "}
              <Link
                style={{ cursor: "pointer" }}
                onClick={handleSignInClick}
                variant="body2"
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Card>
        <div id="sign-in-div"></div>
      </Box>
      </ThemeProvider>
    </div>
  );
}
