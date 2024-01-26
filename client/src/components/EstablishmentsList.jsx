import React, { useState, useEffect } from 'react';
import { fetchEstablishments } from '../API/establishmentService';
import { useUser } from '../API/UserContext';
import CartButton from './CartButton';
import { Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';

const EstablishmentsList = () => {
  const [establishments, setEstablishments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useUser();

  useEffect(() => {
    const loadEstablishments = async () => {
      setLoading(true);
      try {
        const response = await fetchEstablishments();
        setEstablishments(response.establishments || []);
      } catch (err) {
        setError('Failed to fetch establishments.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEstablishments();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div className="container mt-4">
      <Typography variant="h2" gutterBottom>Establishments</Typography>
      <div className="row">
        {establishments.map((establishment) => (
          <div key={establishment.id} className="col-md-4 mb-3">
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">{establishment.name}</Typography>
                <Typography color="textSecondary">Address: {establishment.address}</Typography>
                <Typography color="textSecondary">Phone: {establishment.phone}</Typography>
                <Typography color="textSecondary">Cuisine Type: {establishment.cuisine_type}</Typography>
                <div>
                  <Typography variant="h6">Bags:</Typography>
                  {establishment.bags && establishment.bags.length > 0 ? (
                    establishment.bags.map(bag => (
                      <div key={bag.id}>
                        <Typography variant="body2">
                          {`${bag.type} Bag - ${bag.size}`}
                          <br />
                          Price: ${bag.price.toFixed(2)}
                          <br />
                          Pick-up Time: {bag.available_time}
                        </Typography>
                        {user && !bag.reserved && (
                          <CartButton userId={user.id} bagId={bag.id} disabled={bag.addedToCart} />
                        )}
                        {bag.type === 'regular' && bag.foodItems && (
                          <ul>
                            {bag.foodItems.map(item => (
                              <li key={item.id}>{`${item.name} - Quantity: ${item.quantity}`}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))
                  ) : <Typography color="textSecondary">No bags available</Typography>}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EstablishmentsList;
