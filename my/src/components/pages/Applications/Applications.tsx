import { useEffect, useState } from "react";
import axiosInstance from "../../../api/services/axiosInstance";
import "./Applications.css";
import {
  fetchOrCreateDraftApplication,
  updateApplication,
} from "../../../api/services/applicationApi";
import type { Application, User } from "../../../types";

export function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [usersMap, setUsersMap] = useState<Record<number, User>>({});
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/api/users/");
        const users = response.data;
        const usersDict = users.reduce((acc: Record<number, User>, user: User) => {
          acc[user.id] = user;
          return acc;
        }, {});
        setUsersMap(usersDict);
      } catch (err) {
        console.error("Ошибка загрузки пользователей:", err);
      }
    };

    const checkAdminStatus = async () => {
      try {
        const response = await axiosInstance.get("/api/check-admin/");
        setIsSuperuser(response.data.is_admin);
      } catch (error) {
        console.error("Ошибка при проверке прав администратора:", error);
        setIsSuperuser(false);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const response = await axiosInstance.get("/api/me/");
        setCurrentUser(response.data);
      } catch (err) {
        console.error("Ошибка получения текущего пользователя:", err);
      }
    };

    const fetchData = async () => {
      try {
        const data = await fetchOrCreateDraftApplication("GET");
        setApplications(
          (Array.isArray(data) ? data : [data]).sort((a, b) => a.id - b.id)
        );
      } catch (err: any) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
    fetchCurrentUser();
    fetchUsers();
    fetchData();
  }, []);

  const getUserDisplay = (user: number | User) => {
    if (typeof user === "object") {
      return `${user.id} (${user.username})`;
    } else {
      const foundUser = usersMap[user];
      return foundUser ? `${user} (${foundUser.username})` : `${user}`;
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedApp || !newStatus) return;

    try {
      const updateData: Partial<Application> = { status: newStatus };

      // Устанавливаем дату завершения при переходе в статус "completed"
      if (newStatus === "completed") {
        updateData.completed_at = new Date().toISOString();
      }
      // Сбрасываем дату завершения при изменении статуса с "completed"
      else if (selectedApp.status === "completed") {
        updateData.completed_at = null;
      }

      const updatedApp = await updateApplication(selectedApp.id, updateData);

      setApplications((prev) =>
        prev.map((app) => (app.id === updatedApp.id ? updatedApp : app))
      );
      setSelectedApp(updatedApp);
      setNewStatus("");
      alert("Статус успешно обновлен!");
    } catch (err: any) {
      console.error("Ошибка обновления статуса:", err);
      alert(`Не удалось обновить статус: ${err.message}`);
    }
  };

  const handleDeleteApplication = async (id: number) => {
    if (!window.confirm(`Вы действительно хотите удалить заявку #${id}?`)) return;

    try {
      await axiosInstance.delete(`/api/applications/${id}/`);
      setApplications((prev) => prev.filter((app) => app.id !== id));
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp(null);
      }
      alert(`Заявка #${id} успешно удалена.`);
    } catch (err) {
      console.error("Ошибка при удалении заявки:", err);
      alert("Не удалось удалить заявку.");
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (applications.length === 0) return <div>Заявки отсутствуют.</div>;

  if (selectedApp) {
    return (
      <div className="app-details">
        <button onClick={() => setSelectedApp(null)}>← Назад</button>
        <h2>Заявка #{selectedApp.id}</h2>

        {selectedApp.image && (
          <div className="application-image">
            <img
              src={selectedApp.image}
              alt={`Заявка ${selectedApp.id}`}
              className="app-image"
            />
          </div>
        )}

        <div className="detail-row">
          <span className="detail-label">Статус:</span>
          <span className={`status-tag status-${selectedApp.status}`}>
            {selectedApp.status}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Создана:</span>
          <span>{new Date(selectedApp.created_at).toLocaleString()}</span>
        </div>

        {selectedApp.completed_at && (
          <div className="detail-row">
            <span className="detail-label">Завершена:</span>
            <span>{new Date(selectedApp.completed_at).toLocaleString()}</span>
          </div>
        )}

        <div className="detail-row">
          <span className="detail-label">Пользователь:</span>
          <span>{getUserDisplay(selectedApp.user)}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Модератор:</span>
          <span>
            {selectedApp.moderator ? (
              getUserDisplay(selectedApp.moderator)
            ) : isSuperuser && currentUser ? (
              `Вы (${currentUser.username})`
            ) : (
              "Не назначен"
            )}
          </span>
        </div>

        {isSuperuser && (
          <>
            <div className="status-update-form">
              <h3>Изменить статус заявки</h3>
              <div className="status-controls">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="">Выберите статус</option>
                  <option value="draft">Черновик</option>
                  <option value="formatted">Оформлена</option>
                  <option value="completed">Завершена</option>
                  <option value="rejected">Отклонена</option>
                </select>
                <button onClick={handleStatusUpdate} disabled={!newStatus}>
                  Применить
                </button>
              </div>
            </div>
            <button
              className="delete-button"
              style={{ marginTop: 20, backgroundColor: "red", color: "white" }}
              onClick={() => handleDeleteApplication(selectedApp.id)}
            >
              Удалить заявку
            </button>
          </>
        )}
      </div>
    );
  }

  // Фильтрация заявок по выбранному статусу
  const filteredApplications =
    statusFilter === "all"
      ? applications
      : applications.filter((app) => app.status === statusFilter);

  return (
    <div className="applications-container">
      <h2>Список заявок</h2>
      <div className="filter-controls" style={{ marginBottom: 20 }}>
        <label htmlFor="statusFilter">Фильтр по статусу: </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Все</option>
          <option value="draft">Черновик</option>
          <option value="formatted">Оформлена</option>
          <option value="completed">Завершена</option>
          <option value="rejected">Отклонена</option>
        </select>
      </div>

      {filteredApplications.length === 0 ? (
        <p>Заявки с выбранным статусом отсутствуют.</p>
      ) : (
        filteredApplications.map((app) => (
          <div
            key={app.id}
            className="app-card"
            onClick={() => setSelectedApp(app)}
            style={{ position: "relative" }}
          >
            {app.image && (
              <img
                src={app.image}
                alt={`Заявка ${app.id}`}
                className="app-card-image"
              />
            )}
            <h3>Заявка #{app.id}</h3>
            <p>
              <strong>Статус:</strong>{" "}
              <span className={`status-tag status-${app.status}`}>
                {app.status}
                {app.status === "completed" && app.completed_at && (
                  <span style={{ fontSize: "0.8em", marginLeft: "5px" }}>
                    ({new Date(app.completed_at).toLocaleDateString()})
                  </span>
                )}
              </span>
            </p>
            <p>
              <strong>Создана:</strong>{" "}
              {new Date(app.created_at).toLocaleDateString()}
            </p>
            <p>
              <strong>Пользователь:</strong> {getUserDisplay(app.user)}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
