// client/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SearchPage from "./pages/SearchPage";
import UserPage    from './pages/UserPage'
import RoomPage from './pages/RoomPage'
import CartScreen from './pages/CartScreen'
import MyBookingPage from './pages/MyBookingPage';

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/user"    element={<UserPage />} /> 
      <Route path="/room" element={<RoomPage />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/my-bookings" element={<MyBookingPage />} />
    </Routes>
  </Router>
);

export default App;
