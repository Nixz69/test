// Navbar.tsx
import "./Navbar.css";

interface NavbarProps {
  goBack: () => void;
  goToTwoSlide: () => void;
  goToApplications: () => void;
  isAuthenticated: boolean;
  currentUsername?: string; // Добавьте это
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogout: () => void;
}

export function Navbar({
  goBack,
  goToTwoSlide,
  goToApplications,
  isAuthenticated,
  onLoginClick,
  onRegisterClick,
  onLogout,
}: NavbarProps) {
  return (
    <div className="header">
      <button className="monitoring" onClick={goBack}>
        Мониторинг услуг
      </button>
      <div className="nav">
        {isAuthenticated ? (
          <>
            <button onClick={goToTwoSlide}>Услуги</button>
            <button onClick={goToApplications}>Заявки</button>
            <button onClick={onLogout} className="logout-btn">
              Выйти
            </button>
          </>
        ) : (
          <>
            <button onClick={onLoginClick}>Вход</button>
            <button onClick={onRegisterClick}>Регистрация</button>
          </>
        )}
      </div>
    </div>
  );
}