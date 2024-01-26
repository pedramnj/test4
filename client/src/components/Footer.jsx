import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { orange } from '@mui/material/colors';

const Footer = () => {
  return (
    <AppBar position="static" color="primary" style={{ backgroundColor: orange[500], top: 'auto', bottom: 0, marginTop: 'auto' }}>
      <Toolbar>
        <Typography variant="body1" color="inherit" style={{ flexGrow: 1, textAlign: 'center' }}>
          © 2024 Food Rescue App
          
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
