import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router';
import { useAuth } from './Authorization';

export default function Menu() {
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    left: false,
  });

  const { logout } = useAuth();

  const handleSignOut = () => {
    console.log('logging out');
    logout();
    navigate('/');
  };

  const handleMenuClick = (text) => {
    if (text === 'Add Dog') {
      console.log('clicked add dog');
      navigate('/addDog');
    }
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: 250, padding: '0' }}
      role='presentation'
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Profile', 'Add Dog'].map((text, index) => (
          <ListItem
            key={text}
            disablePadding
            onClick={() => handleMenuClick(text)}
          >
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Sign Out'].map((text, index) => (
          <ListItem
            key={text}
            disablePadding
            onClick={() => {
              console.log('logging out');
              logout();
              navigate('/');
            }}
          >
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {['Menu'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer('left', true)}>Menu</Button>
          <Drawer
            anchor='left'
            open={state['left']}
            onClose={toggleDrawer('left', false)}
          >
            {list('left')}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
