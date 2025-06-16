import "./OneSlide.css";
import { useState } from "react";
import { fetchUsers, deleteUser } from "../OneSlide/userApi"; // путь подправь

interface OneSlideProps {
  goToTwoSlide: () => void;
  goToApplications: () => void;
  isAuthenticated: boolean;
  onLoginRequired: () => void;
  currentUsername?: string; // Имя пользователя, передаваемое как пропс
}

type User = {
  id: number;
  username: string;
  is_staff: boolean;
};

export function OneSlide({ 
  goToTwoSlide, 
  goToApplications,
  isAuthenticated,
  onLoginRequired,
  currentUsername
}: OneSlideProps) {
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  
  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error("Ошибка загрузки пользователей", err);
    }
  };

  const handleApplicationsClick = () => {
    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }
    goToApplications();
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm("Удалить пользователя?")) {
      await deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
    }
  };

  const toggleUserPopup = () => {
    if (!showUserPopup) loadUsers();
    setShowUserPopup(!showUserPopup);
  };

  return (
    <>
      <div className="container">
        <div className="content">
          <h1>Мониторинг угроз</h1>
          <p>Цель проекта – предоставить возможность получить наиболее полную информацию об IT-угрозах.</p>
        </div>

        <div className="content-2"> 
          <button onClick={goToTwoSlide}>Архивные услуги</button>
          <button onClick={handleApplicationsClick}>
            {isAuthenticated ? 'Сформированные заявки' : 'Войдите для просмотра заявок'}
          </button>
        </div>

        {/* Кнопка в левом нижнем углу с текущим юзером */}
        <div style={{ position: "fixed", bottom: 20, left: 20 }}>
          <button style={{
            backgroundColor: "transparent",
            border: "1px solid white",
            color: "white",
            padding: "10px",
            borderRadius: "8px",
            cursor: "pointer"
          }} onClick={toggleUserPopup}>
            👥 Пользователи{isAuthenticated && currentUsername ? ` (${currentUsername})` : ""}
          </button>
        </div>

        {showUserPopup && (
          <div className="user-popup">
            <h3>Пользователи</h3>
            <ul>
              {users.map(user => (
                <li key={user.id}>
                  {user.username}
                  <button onClick={() => handleDeleteUser(user.id)}>Удалить</button>
                </li>
              ))}
            </ul>
            <button className="user-popup-close" onClick={toggleUserPopup}>Закрыть</button>
          </div>
        )}
      </div>
    </>
  );
}
