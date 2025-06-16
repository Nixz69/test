// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { OneSlide } from './components/pages/OneSlide/OneSlide';
import { TwoSlide } from './components/pages/TwoSlide/TwoSlide';
import { ThreeSlide } from './components/pages/ThreeSlide/ThreeSlide';
import { ThreatDetails } from './components/pages/ThreatDetails/ThreatDetails';
import { Applications } from './components/pages/Applications/Applications';
import { Navbar } from './components/pages/Navbar/Navbar';
import LoginPage from './components/pages/auth/LoginPage';
import RegisterPage from './components/pages/auth/RegisterPage';

import { useAppSelector, useAppDispatch } from './hooks';
import { logout } from './slices/authSlice';

import type { Threat, CartItem } from './types';

function AppWrapper() {
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const { isAuthenticated, username } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate('/');
  };

  const addToCart = (item: Threat) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        
        currentUsername={username || ''}
        onLogout={handleLogout}
        onLoginClick={() => navigate('/login')}
        onRegisterClick={() => navigate('/register')}
        goBack={() => navigate('/')}
        goToTwoSlide={() => navigate('/two')}
        goToApplications={() => navigate('/app')}
        
      />

      <Routes>
        <Route
          path="/"
          element={
            <OneSlide
              goToTwoSlide={() => navigate('/two')}
              goToApplications={() => navigate('/app')}
              isAuthenticated={isAuthenticated}
              onLoginRequired={() => navigate('/login')}
              currentUsername={username || ''}
            />
          }
        />
        <Route
          path="/app"
          element={isAuthenticated ? <Applications /> : <Navigate to="/login" />}
        />
        <Route
          path="/two"
          element={
            isAuthenticated ? (
              <TwoSlide
                showDetails={(threat: Threat) => {
                  setSelectedThreat(threat);
                  navigate('/details');
                }}
                goToThreeSlide={() => navigate('/three')}
                cartItems={cartItems}
                addToCart={addToCart}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/details"
          element={
            isAuthenticated && selectedThreat ? (
              <ThreatDetails threat={selectedThreat} goToBack={() => navigate('/two')} />
            ) : (
              <Navigate to="/two" />
            )
          }
        />
        <Route
          path="/three"
          element={
            isAuthenticated ? (
              <ThreeSlide
                goBack={() => navigate('/')}
                cartItems={cartItems}
                setCartItems={setCartItems}
                showDetails={(threat: Threat) => {
                  setSelectedThreat(threat);
                  navigate('/details');
                }}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage goBack={() => navigate('/login')} />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
