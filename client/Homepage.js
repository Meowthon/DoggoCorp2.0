import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import MainCard from './components/MainCard';
// import Menu from "./components/Menu";
import HeaderDog from './components/HeaderDog';
import Sky from './components/Sky';
import Footers from './components/Footer';
import { useAuth } from './components/Authorization';
import { useNavigate } from 'react-router';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // console.log('Homepage User:', user);

  useEffect(() => {
    console.log('Homepage User:', user);
    if (!user) {
      console.log('there is no user');
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div>
      <Sky />
      <HeaderDog />
      {/* <Box sx={{ minWidth: "100vw" }}> */}
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh' // Full screen height
        // sx={{ backgroundColor: 'pink' }}
      >
        {/* Centered Container */}
        <Grid
          container
          item
          xs={12}
          justifyContent='center'
          marginTop='3rem'
          sx={{ minHeight: 'calc(100vh - 3.5rem)' }}
        >
          {/* calc 100vh - the header */}
          <Grid item xs={10} md={8} lg={7}>
            <Grid
              container
              alignItems='flex-start'
              justifyContent='space-between'
            ></Grid>
            {/* MainCard */}
            <MainCard sx={{ mt: 1.75 }}>
              <Stack spacing={1.5} sx={{ mb: -12 }}></Stack>
            </MainCard>
          </Grid>
        </Grid>
      </Box>
      <Footers />
    </div>
  );
};

export default HomePage;
