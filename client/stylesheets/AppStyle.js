import { createTheme } from '@mui/material';

export const appTheme = createTheme({
  MuiCssBaseline: {
    styleOverrides: `
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400;600;700&family=Pixelify+Sans:wght@700&display=swap');

    @font-face {
        font-family: 'Pixelify Sans';
        font-style: normal;
        font-display: swap;
        font-weight: 400;
        src: local('Pixelify Sans'), url('https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400;600;700&family=Pixelify+Sans:wght@700&display=swap')
        format('woff2');

        @font-face {
        font-family: 'Oswald';
        font-style: normal;
        font-display: swap;
        font-weight: 400;
        src: local('Oswald'), url('https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400;600;700&display=swap') format('woff2');
      }
      `,
  },
  typography: {
    fontFamily: 'Roboto',
  },
  palette: {
    primary: {
      main: '#6a994e',
    },
    secondary: {
      main: '#9c6644',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: 15,
        },
      },
    },
  },
});
