const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');

const apiRouter = require('./routes/router');

const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(cookieParser());

// Google OAuth
const client = new OAuth2Client(
  '654380610871-b70h1a8224333s0jgls1fvhsrmq3r0p4.apps.googleusercontent.com'
);
app.post('/verify-token', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ error: 'Token is missing in the request body' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        '654380610871-b70h1a8224333s0jgls1fvhsrmq3r0p4.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    const userid = payload['sub'];
    const userEmail = payload['email'];

    res.status(200).json({
      success: true,
      message: 'Token verified successfully',
      email: userEmail,
      googleUserId: userid,
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(401).json({ error: 'Token verification failed' });
  }
});

app.use((req, res, next) => {
  // Set the Referrer-Policy header to no-referrer-when-downgrade
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  next();
});

app.use(
  '/downloadedImages',
  express.static(path.resolve(__dirname, 'downloadedImages'))
);

// set up routing to routes here
app.use('/', apiRouter);

// app.get((req, res) => {
//   console.log('going to add dog page');
//   return res.redirect('/homepage');
// });

//handle static files from our bundler
app.use(express.static(path.resolve(__dirname, 'build')));

//direct to bundled HTML file
app.get('*', (req, res) => {
  console.log('Received request for:', req.url);
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

// catch 404 errors
app.use('*', (req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);

// catch global errors
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  console.log(errorObj.message);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
