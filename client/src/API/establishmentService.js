const BASE_URL = 'http://localhost:3001'; // Replace with your actual backend URL

const fetchEstablishments = async () => {
  try {
    const response = await fetch(`${BASE_URL}/establishments`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      // Handle different response statuses here if needed
      throw new Error('Network response was not ok');
    }

    const establishments = await response.json();
    return establishments; // This should be an array of establishment objects
  } catch (error) {
    // Handle or throw the error depending on your error handling strategy
    throw error;
  }
};
try {
  const data = await fetchEstablishments();
  console.log("API Response:", data); // log the API response
  setEstablishments(data);
} catch (err) {
  // error handling
}

export { fetchEstablishments };
