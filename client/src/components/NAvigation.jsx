import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useUser } from '../API/UserContext';
import { useCart } from '../API/cartContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const Navigation = () => {
  const { user, logoutUser } = useUser();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <RouterLink to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Food Rescue
          </RouterLink>
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">
          Home
        </Button>
        {user && (
          <Button color="inherit" component={RouterLink} to="/reserved-bags">
            My Orders
          </Button>
        )}
        {user ? (
          <>
            <IconButton color="inherit" component={RouterLink} to="/cart" aria-label="View Cart">
              <ShoppingCartIcon />
            </IconButton>
            <Typography variant="subtitle1" color="inherit" sx={{ mx: 2 }}>
              Welcome, {user.username}!
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <Button color="inherit" component={RouterLink} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
