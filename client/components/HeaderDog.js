import * as React from 'react';
import {
  Badge,
  Box,
  Button,
  IconButton,
  InputLabel,
  FormControl,
  Menu,
  Select,
  SelectChangeEvent,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import { useNavigate } from 'react-router';
import { HeaderDogStyle } from '../stylesheets/HeaderStyle';
import { useAuth } from './Authorization';

export default function HeaderDog() {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    left: false,
  });

  const renderMenu = (
    <div>
      <ThemeProvider theme={HeaderDogStyle.theme}>
        <Button
          aria-haspopup='true'
          aria-controls={open ? 'basic-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          {...HeaderDogStyle.buttonStyle}
        >
          Menu
        </Button>
        <Menu
          id='basic-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          // keep for chat bar?
          keepMounted
          color='pink'
          style={{ backgroundColor: 'transparent' }}
        >
          <MenuItem onClick={() => navigate('/homepage')}>My account</MenuItem>
          <MenuItem onClick={() => navigate('/addDog')}>Add Dog</MenuItem>
          <MenuItem
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </ThemeProvider>
    </div>
  );

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Toolbar>
          {renderMenu}
          <Box sx={{ flexGrow: 1 }} />

          <IconButton style={{ backgroundColor: 'transparent' }}></IconButton>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {/* // mail icon */}
            <IconButton
              size='large'
              aria-label='show 4 new mails'
              color='inherit'
              style={{ color: 'white' }}
              sx={{ shadow: '3px 3px 3px black' }}
            >
              <Badge badgeContent={1} color='error'>
                <MailIcon />
              </Badge>
            </IconButton>

            {/* // notification icon */}
            <IconButton
              size='large'
              aria-label='show 17 new notifications'
              color='inherit'
              style={{ color: 'white' }}
            >
              <Badge badgeContent={6} color='error'>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </Box>
    </div>
  );
}
