import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import { CartProvider } from './API/cartContext';
import EstablishmentsList from './components/EstablishmentsList';
import { UserProvider } from './API/UserContext';
import Login from './Pages/Login';

const App = () => {
  return (
    <UserProvider>
      <CartProvider>
    <Router>
      <div>
        <Header />
        <Navigation />
      <Routes>
        <Route path="/" element={<EstablishmentsList />} />
        <Route path="/login" element={<Login />} />
        {/* other routes */}
      </Routes>
        <Footer />
      </div>
    </Router>
    </CartProvider>
    </UserProvider>
  );
};

export default App;
