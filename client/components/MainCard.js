import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import '../stylesheets/App.css';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import '../stylesheets/LandingPage.css';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useAuth } from './Authorization';
import { cardStyle, containerStyle } from '../stylesheets/MainCardStyle';

const headerFont = createTheme({
  //this shit is not working
  typography: {
    fontFamily: ['Pixelify Sans', 'sans-serif'].join(','),
  },
  palette: {
    primary: {
      main: '#6a994e',
    },
    secondary: {
      main: '#9c6644',
    },
  },
});

export default function MainCard() {
  const [dogsArr, setDogsArr] = useState([]);
  const { user, fetchDogs, deleteDog } = useAuth();
  const userId = user.user_id;
  const getDogs = async () => {
    try {
      const dogs = await fetchDogs(userId);
      console.log(dogs);
      setDogsArr(dogs);
      // console.log('all dogs', dogsArr);
    } catch (error) {
      console.log(error, 'error accessing database');
    }
  };

  useEffect(() => {
    console.log('useEffect is working');
    getDogs();
  }, []);

  const handleDelete = async (dogId) => {
    try {
      const deletedDog = await deleteDog(dogId);
      console.log('dog deleted: ', deletedDog);
      setDogsArr(dogsArr.filter((dog) => dog.dog_id !== dogId));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={containerStyle}>
      <ThemeProvider theme={headerFont}>
        {dogsArr.map((dog) => (
          <DogCard dog={dog} handleDelete={handleDelete} key={dog.dog_id} />
        ))}
      </ThemeProvider>
    </div>
  );
}

function DogCard({ dog, handleDelete }) {
  for (const key of ['meals', 'medication', 'groomer', 'miscellaneous']) {
    if (
      dog[key] === '{}' ||
      dog[key] === null ||
      dog[key] === '"[]"' ||
      dog[key] === '[]'
    ) {
      dog[key] = [];
    }
  }

  if (typeof dog.meals === 'string') {
    dog.meals = JSON.parse(dog.meals).map((meal) => {
      const mealTime = meal.times.split('T')[1].split('.')[0];
      return { ...meal, times: mealTime };
    });
  }

  for (const key of ['medication', 'groomer', 'miscellaneous']) {
    if (typeof dog[key] === 'string') {
      dog[key] = JSON.parse(dog[key]).map((item) => {
        const time = item.times.split('T')[1].split('.')[0];
        const date = item.dates.split('T')[0];
        return { ...item, times: time, dates: date };
      });
    }
  }

  return (
    <Card sx={cardStyle}>
      <CardHeader
        fontFamily='Pixelify Sans'
        title={dog.dog_name}
        action={
          <div>
            <IconButton edge='end' aria-label='edit'>
              <EditRoundedIcon />
            </IconButton>
            <IconButton
              edge='end'
              aria-label='delete'
              onClick={() => handleDelete(dog.dog_id)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        }
        titleTypographyProps={{ variant: 'h3' }}
        sx={{
          mb: 1,
          color: 'pink',
          textShadow:
            '-1px -1px white, 1px 1px hotpink, 2px 2px hotpink, 3px 3px 3px #9e9e9e',
        }}
      />
      <CardMedia
        component='img'
        height='250'
        src={dog.photo}
        alt='Pixelized picture of dog -?'
        sx={{ objectFit: 'contain', mb: 1 }}
      />

      <List>
        <BasicInfo info='breed' data={dog.breed} />
        <BasicInfo info='age' data={dog.age} />
        <BasicInfo info='weight' data={dog.weight + ' lb'} />

        <BasicInfo
          info='birthday'
          data={dog.birthdate ? dog.birthdate.split('T')[0] : "haven't set"}
        />

        <ListInfo info='meals' list={dog.meals} />
        <ListInfo info='medications' list={dog.medication} />
        <ListInfo info='groomer' list={dog.groomer} />
        <ListInfo info='miscellaneous' list={dog.miscellaneous} />
      </List>
      <CardActions
        sx={{
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
          Add / Remove Watcher
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <IconButton aria-label='add'>
            <AddCircleIcon color='primary' />
          </IconButton>
          <IconButton aria-label='remove'>
            <RemoveCircleIcon color='primary' />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
}

function BasicInfo({ info, data }) {
  return (
    <ListItem>
      <Box textAlign='right' style={{ paddingRight: 5 }}>
        {info}:{' '}
      </Box>
      <ListItemText
        secondaryTypographyProps={{ align: 'left' }}
        secondary={data}
      />
    </ListItem>
  );
}

function ListInfo({ info, list }) {
  const [open, setOpen] = useState(false);
  if (list.length === 0) return null;
  return (
    <div>
      <ListItemButton onClick={() => setOpen(!open)}>
        <ListItemText primary={info} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout='auto' unmountOnExit>
        <List component='div' disablePadding>
          {list.map((item) => (
            <ListItem key={item.times}>
              <ListItemText primary={item.type} style={{ paddingRight: 10 }} />
              <ListItemText
                primary='instruction'
                secondary={item.instructions}
                style={{ paddingRight: 5 }}
              />
              <ListItemText
                primary='time'
                secondary={item.times}
                style={{ paddingRight: 5 }}
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </div>
  );
}
