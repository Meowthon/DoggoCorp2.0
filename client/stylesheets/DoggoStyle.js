import { blue } from '@mui/material/colors';

export const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 3,
  boxShadow: 3,
  borderRadius: 2,
  backgroundColor: 'rgba(255, 255, 255, 0.7)', //transparent
  border: 2,
  borderColor: blue[50],
};

export const DoggoTypographyStyle = {
  variant: 'h4',
  textAlign: 'center',
  fontFamily: 'Pixelify Sans',
  sx: {
    color: 'pink',
    //   textShadow:
    //     "-1px -1px white, 1px 1px hotpink, 3px 3px hotpink, 4px 4px 4px #9e9e9e",
    // }}
    textShadow:
      '-1px -1px white, 1px 1px hotpink, 2px 2px hotpink, 3px 3px 3px #9e9e9e',
  },
};

export const DoggoTextFieldStyle = {
  m: 1,
  flex: 1,
  backgroundColor: 'white',
  borderRadius: '5px',
};

export const DoggoBoxAgeAndWeightStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
};

export const DoggoBoxAddingStyle = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  mb: 2,
};

export const DoggoBoxDataStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 1,
};
