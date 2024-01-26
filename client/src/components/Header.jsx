import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { orange } from '@mui/material/colors';

const Header = () => {
  return (
    <AppBar position="static" style={{ backgroundColor: orange[500] }}> 
      <Toolbar>
        <Typography variant="h6" color="inherit">
          My Food Rescue App
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
