import React, { useState, useEffect, Fragment } from 'react';
import Footers from './components/Footer';
import Sky from './components/Sky';
import HeaderDog from './components/HeaderDog';
import {
  Box,
  Button,
  TextField,
  Typography,
  Input,
  InputAdornment,
  InputLabelProps,
  IconButton,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useNavigate } from 'react-router';
import {
  formStyle,
  DoggoTypographyStyle,
  DoggoTextFieldStyle,
  DoggoBoxAgeAndWeightStyle,
  DoggoBoxDataStyle,
  DoggoBoxAddingStyle,
} from './stylesheets/DoggoStyle';
import { useAuth } from './components/Authorization';
import { DateField } from '@mui/x-date-pickers';

const DogInputPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Doggo page User:', user);
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
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='80vh' // Full screen height
        // sx={{ backgroundColor: 'pink' }}
      >
        <DogForm userId={user.user_id} />
      </Box>
      <Footers />
    </div>
  );
};

function DogForm({ userId }) {
  const [meals, setMeals] = useState([]);
  const [medications, setMedications] = useState([]);
  const [groomers, setGroomers] = useState([]);
  const [misc, setMisc] = useState([]);
  const { addDog } = useAuth();
  const navigate = useNavigate();

  const [photoUrl, setPhotoUrl] = useState(null);

  return (
    <Box
      component='form'
      noValidate
      sx={formStyle}
      onSubmit={async (e) => {
        e.preventDefault();

        const dogData = {
          name: e.target.name.value,
          owner_id: userId,
          birthday: e.target.birthday.value,
          age: e.target.age.value,
          weight: e.target.weight.value,
          breed: e.target.breed.value,
          meals: JSON.stringify(meals),
          medication: JSON.stringify(medications),
          groomer: JSON.stringify(groomers),
          miscellaneous: JSON.stringify(misc),
          photo: photoUrl,
        };

        try {
          const response = await addDog(dogData);
          console.log('added dog is ', response);
          navigate('/homepage');
        } catch (error) {
          console.log('Error adding dog:', error.message);
        }
      }}
    >
      <Typography {...DoggoTypographyStyle}>
        Add Your Dog's Information
      </Typography>

      <TextField
        label="Dog's Name"
        name='name'
        type='text'
        required
        fullWidth
        autoFocus
        margin='normal'
        sx={DoggoTextFieldStyle}
      />

      <Box sx={DoggoBoxAgeAndWeightStyle}>
        <TextField
          label='Age'
          name='age'
          type='text'
          required
          sx={DoggoTextFieldStyle}
        />
        <DateField
          label='Birthday'
          name='birthday'
          required
          sx={DoggoTextFieldStyle}
        />
        <TextField
          label='Weight'
          name='weight'
          type='text'
          required
          sx={DoggoTextFieldStyle}
          InputProps={{
            endAdornment: <InputAdornment position='end'>lbs</InputAdornment>,
          }}
        />
      </Box>

      <TextField
        label='Breed'
        name='breed'
        type='text'
        fullWidth
        margin='normal'
        sx={DoggoTextFieldStyle}
      />

      <AddingMeal meals={meals} setMeals={setMeals} />

      <AddingOthers
        dataName='Medication'
        data={medications}
        setData={setMedications}
      />

      <AddingOthers dataName='Groomer' data={groomers} setData={setGroomers} />

      <AddingOthers dataName='Miscellaneous' data={misc} setData={setMisc} />

      <Input
        type='file'
        name='photo'
        content='Upload File'
        cursor='pointer'
        size='90'
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
              const dataUrl = reader.result;
              setPhotoUrl(dataUrl);
            };
            reader.readAsDataURL(file);
          }
        }}
      />

      <Button
        type='submit'
        fullWidth
        variant='contained'
        sx={{ mt: 3, mb: 2, zIndex: 10 }}
      >
        Submit
      </Button>
    </Box>
  );
}

function AddingMeal({ meals, setMeals }) {
  console.log(meals);
  return (
    <Fragment>
      <Box sx={DoggoBoxAddingStyle}>
        <Typography variant='h6' sx={{ mr: 2 }}>
          Add Meals
        </Typography>
        <IconButton
          onClick={() =>
            setMeals([...meals, { type: '', instructions: '', times: '' }])
          }
        >
          <AddCircleIcon color='primary' />
        </IconButton>
      </Box>

      {meals.map((meal, index) => (
        <Box key={index} sx={{ width: '100%', mb: 2 }}>
          <Typography sx={{ mr: 2, marginBottom: 2 }}>{`Meal ${
            index + 1
          }:`}</Typography>

          <Box sx={DoggoBoxDataStyle}>
            <FormControl sx={{ mr: 1, flex: 1 }}>
              <InputLabel htmlFor={`meal-type-select-${index}`}>
                Meal Type
              </InputLabel>
              <Select
                focused
                labelId={'type'}
                name={`meal-${index}-type`}
                label='Meal Type'
                onChange={(e) =>
                  setMeals(
                    meals.map((m, i) =>
                      i === index ? { ...m, type: e.target.value } : m
                    )
                  )
                }
                id={`meal-type-select-${index}`}
                sx={DoggoTextFieldStyle}
              >
                <MenuItem value='Breakfast'>Breakfast</MenuItem>
                <MenuItem value='Lunch'>Lunch</MenuItem>
                <MenuItem value='Dinner'>Dinner</MenuItem>
                <MenuItem value='Snack'>Snack</MenuItem>
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label='Time'
                name={`meal-${index}-times`}
                value={meal.times}
                onChange={(newTime) =>
                  setMeals(
                    meals.map((m, i) =>
                      i === index ? { ...m, times: newTime } : m
                    )
                  )
                }
                sx={DoggoTextFieldStyle}
                renderInput={(params) => (
                  <TextField {...params} sx={{ flex: 2 }} />
                )}
              />
            </LocalizationProvider>
          </Box>
          <TextField
            label='Instructions:'
            fullWidth
            type='text'
            multiline
            onChange={(e) =>
              setMeals(
                meals.map((m, i) =>
                  i === index ? { ...m, instructions: e.target.value } : m
                )
              )
            }
            name={`meal-${index}-instruction`}
            margin='normal'
            sx={DoggoTextFieldStyle}
          />

          <IconButton
            onClick={() => {
              setMeals(meals.filter((m, i) => i !== index));
            }}
          >
            <RemoveCircleIcon color='primary' />
          </IconButton>
        </Box>
      ))}
    </Fragment>
  );
}

function AddingOthers({ data, setData, dataName }) {
  return (
    <Fragment>
      <Box sx={DoggoBoxAddingStyle}>
        <Typography variant='h6' sx={{ mr: 2 }}>
          Add {dataName}
        </Typography>
        <IconButton
          onClick={() =>
            setData([...data, { times: '', instructions: '', dates: '' }])
          }
        >
          <AddCircleIcon color='primary' />
        </IconButton>
      </Box>

      {data.map((item, index) => (
        <Box key={index} sx={{ width: '100%', mb: 2 }}>
          <Typography sx={{ mr: 2, mb: 2 }}>{`${dataName} ${
            index + 1
          }:`}</Typography>
          <Box sx={DoggoBoxDataStyle}>
            <FormControl sx={{ mr: 1, flex: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label='Time'
                  name={`${dataName.toLowerCase()}-${index}-time`}
                  value={item.times}
                  onChange={(newTime) =>
                    setData(
                      data.map((el, i) =>
                        i === index ? { ...el, times: newTime } : el
                      )
                    )
                  }
                  sx={DoggoTextFieldStyle}
                  renderInput={(params) => (
                    <TextField {...params} sx={{ flex: 2 }} />
                  )}
                />
              </LocalizationProvider>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='Date'
                name={`${dataName.toLowerCase()}-${index}-date`}
                value={data.dates}
                onChange={(newDate) =>
                  setData(
                    data.map((el, i) =>
                      i === index ? { ...el, dates: newDate } : el
                    )
                  )
                }
                sx={DoggoTextFieldStyle}
                renderInput={(params) => (
                  <TextField {...params} sx={{ flex: 2 }} />
                )}
              />
            </LocalizationProvider>
          </Box>
          <TextField
            label='Instructions:'
            fullWidth
            multiline
            name={`${dataName.toLowerCase()}-${index}-instructions`}
            value={item.instructions}
            onChange={(e) =>
              setData(
                data.map((el, i) =>
                  i === index ? { ...el, instructions: e.target.value } : el
                )
              )
            }
            margin='normal'
            sx={DoggoTextFieldStyle}
          />
          <IconButton
            onClick={() => {
              setData(data.filter((el, i) => i !== index));
            }}
          >
            <RemoveCircleIcon color='primary' />
          </IconButton>
        </Box>
      ))}
    </Fragment>
  );
}

export default DogInputPage;
