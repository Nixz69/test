import React, { useState } from 'react';
import './AuthStyles.css';

interface RegisterPageProps {
  goBack: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ goBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.username?.[0] ||
                         data.password?.[0] ||
                         data.detail ||
                         'Ошибка при регистрации';
        throw new Error(errorMsg);
      }

      setSuccessMessage('Регистрация прошла успешно! Теперь вы можете войти.');
      setErrorMessage('');
      setRegistrationComplete(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Неизвестная ошибка');
      }
      setSuccessMessage('');
      setRegistrationComplete(false);
    }
  };

  return (
    <div className="auth-container">
      <button className="auth-back-btn" onClick={goBack}>Назад</button>
      <div className="auth-form">
        <h2 className="auth-title">Регистрация</h2>

        {errorMessage && <p className="auth-error">{errorMessage}</p>}
        {successMessage && <p className="auth-success">{successMessage}</p>}

        {!registrationComplete ? (
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

            <button className="auth-submit-btn" type="submit">Зарегистрироваться</button>
          </form>
        ) : (
          <button className="auth-submit-btn" onClick={() => goBack()}>
            Перейти ко входу
          </button>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
