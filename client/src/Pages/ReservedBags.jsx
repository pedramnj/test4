import React, { useState, useEffect } from 'react';
import { fetchReservedBags, cancelReservation } from '../API/cartService';
import { useUser } from '../API/UserContext';
import { Container, List, ListItem, ListItemText, Button, Typography, Snackbar } from '@mui/material';

const ReservedBagsPage = () => {
  const [reservedBags, setReservedBags] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    loadReservedBags();
  }, [user.id]);

  const loadReservedBags = async () => {
    const response = await fetchReservedBags(user.id);
    setReservedBags(response.reservedBags || []);
  };

  const handleCancelReservation = async (bagId) => {
    await cancelReservation(user.id, bagId);
    loadReservedBags();
    setOpenSnackbar(true); 
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); 
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Reserved Bags
      </Typography>
      {reservedBags.length === 0 ? (
        <Typography>No bags reserved.</Typography>
      ) : (
        <List>
          {reservedBags.map(bag => (
            <ListItem key={bag.id} divider>
              <ListItemText
                primary={`${bag.type} Bag - ${bag.size}`}
                secondary={`Price: $${bag.price}`}
              />
              <Button 
                variant="contained" 
                color="error" 
                onClick={() => handleCancelReservation(bag.id)}
              >
                Cancel Reservation
              </Button>
            </ListItem>
          ))}
        </List>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Reservation cancelled successfully"
      />
    </Container>
  );
};

export default ReservedBagsPage;
