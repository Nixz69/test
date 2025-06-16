// src/components/pages/auth/LoginPage.tsx
import React, { useState } from 'react';
import './AuthStyles.css';
import { useAppDispatch } from '../../../hooks';
import { loginSuccess } from '../../../slices/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Ошибка входа');

      const data = await response.json();

      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      localStorage.setItem('username', username);

      dispatch(loginSuccess({ token: data.access, username }));
      setErrorMessage('');
      setSuccessMessage('Вы успешно вошли!');
      setTimeout(() => navigate('/'), 10); // Подождать перед переходом
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Неизвестная ошибка');
      setSuccessMessage('');
    }
  };

  const goBack = () => navigate(-1);

  return (
    <div className="auth-container">
      <button className="auth-back-btn" onClick={goBack}>Назад</button>
      <div className="auth-form">
        <h2 className="auth-title">Вход</h2>
        {errorMessage && <p className="auth-error">{errorMessage}</p>}
        {successMessage && <p className="auth-success">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">Username:</label>
            <input
              className="auth-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Password:</label>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="auth-submit-btn" type="submit">Войти</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
