const BASE_URL = 'http://localhost:3001'; 

const fetchEstablishments = async () => {
  try {
    const response = await fetch(`${BASE_URL}/establishments`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      
      throw new Error('Network response was not ok');
    }

    const establishments = await response.json();
    return establishments; // This should be an array of establishment objects
  } catch (error) {
    
    throw error;
  }
};
try {
  const data = await fetchEstablishments();
  setEstablishments(data);
} catch (err) {
  // no error handling :)
}

export { fetchEstablishments };
