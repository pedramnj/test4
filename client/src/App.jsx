import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/NAvigation'; 
import EstablishmentsList from './components/EstablishmentsList';
import CartPage from './Pages/CartPage';
import ReservedBagsPage from './Pages/ReservedBags'; 
import { UserProvider } from './API/UserContext';
import { CartProvider } from './API/cartContext';
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
              <Route path="/cart" element={<CartPage />} />
              <Route path="/reserved-bags" element={<ReservedBagsPage />} /> 
              
            </Routes>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </UserProvider>
  );
};

export default App;
