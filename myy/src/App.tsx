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
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
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
        goToTwoSlide={() => navigate('/services')}
        goToApplications={() => navigate('/app')}
      />

      <Routes>
        <Route path="/" element={
          <OneSlide
            goToTwoSlide={() => navigate('/services')}
            goToApplications={() => navigate('/app')}
            isAuthenticated={isAuthenticated}
            onLoginRequired={() => navigate('/login')}
            currentUsername={username || ''}
          />
        } />
        
        <Route path="/services" element={
          <TwoSlide
            showDetails={(threat: Threat) => {
              setSelectedThreat(threat);
              navigate('/service-details');
            }}
            goToThreeSlide={() => {
              if (cartItems.length === 0) return;
              isAuthenticated ? navigate('/checkout') : navigate('/login');
            }}
            cartItems={cartItems}
            addToCart={addToCart}
          />
        } />

        <Route path="/service-details" element={
          selectedThreat ? (
            <ThreatDetails 
              threat={selectedThreat} 
              goToBack={() => navigate('/services')} 
            />
          ) : (
            <Navigate to="/services" />
          )
        } />

        <Route path="/checkout" element={
          isAuthenticated ? (
            <ThreeSlide
              goBack={() => navigate('/services')}
              cartItems={cartItems}
              setCartItems={setCartItems}
              showDetails={(threat: Threat) => {
                setSelectedThreat(threat);
                navigate('/service-details');
              }}
            />
          ) : (
            <Navigate to="/login" />
          )
        } />

        <Route path="/app" element={
          isAuthenticated ? <Applications /> : <Navigate to="/login" />
        } />

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