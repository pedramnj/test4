const BASE_URL = 'http://localhost:3001'; 

const login = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      
      throw new Error('Login failed');
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    
    throw error;
  }
};

const register = async (username, password, email) => {
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email }),
    });

    if (!response.ok) {
      
      throw new Error('Registration failed');
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    
    throw error;
  }
};

export { login, register };
