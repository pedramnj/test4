import React, { useState, useEffect } from 'react';
import { fetchEstablishments } from '../API/establishmentService';

const EstablishmentsList = () => {
  const [establishments, setEstablishments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h2>Establishments</h2>
      <div className="list-group">
        {establishments.map((establishment) => (
          <div key={establishment.id} className="list-group-item">
            <h3>{establishment.name}</h3>
            <p>Address: {establishment.address}</p>
            <div>
              <h4>Bags:</h4>
              {establishment.bags && establishment.bags.length > 0 ? (
                establishment.bags.map(bag => (
                  <div key={bag.id}>
                    <p>{`${bag.type} Bag - ${bag.size}`}</p>
                    {bag.type === 'regular' && bag.foodItems && (
                      <div>
                        <h5>Food Items:</h5>
                        <ul>
                          {bag.foodItems.map(item => (
                            <li key={item.id}>{`${item.name} - Quantity: ${item.quantity}`}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              ) : <p>No bags available</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default EstablishmentsList;