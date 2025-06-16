import axios from "axios";
import type { Application } from "../../types";

type ApplicationService = {
  id: number;
  service: number;
  application: number;
  quantity: number;
};

const getAccessToken = () => localStorage.getItem("accessToken");

export const isSuperuser = (): boolean => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.is_staff || false;
  } catch {
    return false;
  }
};

const getAuthHeaders = () => {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Пользователь не авторизован: отсутствует токен");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export async function updateApplication(
  id: number,
  updateData: Partial<Application>
): Promise<Application> {
  try {
    const response = await axios.put(
      `http://127.0.0.1:8000/api/applications/${id}/`,
      updateData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Ошибка при обновлении заявки");
  }
}

export async function updateApplicationStatus(
  id: number,
  status: string
): Promise<Application> {
  return updateApplication(id, { status });
}

export async function fetchOrCreateDraftApplication(
  method: "GET" | "POST" = "GET"
): Promise<Application[]> {
  try {
    const headers = getAuthHeaders();

    if (method === "GET") {
      const response = await axios.get("http://127.0.0.1:8000/api/applications/", { headers });
      return Array.isArray(response.data) ? response.data : [response.data];
    }

    if (method === "POST") {
      const response = await axios.post("http://127.0.0.1:8000/api/applications/", {}, { headers });
      return [response.data];
    }

    throw new Error("Метод должен быть 'GET' или 'POST'");
  } catch (error: any) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function addServiceToApplication(
  serviceId: number,
  applicationId: number,
  quantity: number = 1
): Promise<ApplicationService> {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/application-services/",
      { service: serviceId, application: applicationId, quantity },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error);
    throw new Error(error.response?.data?.detail || `Не удалось добавить услугу: ${error.response?.status}`);
  }
}

export async function getCurrentUserInfo(): Promise<{
  id: number;
  username: string;
  is_staff: boolean;
}> {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/users/me/", { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Не удалось получить информацию о пользователе");
  }
}

export async function removeServiceFromApplication(
  applicationServiceId: number
): Promise<void> {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/application-services/${applicationServiceId}/`, {
      headers: getAuthHeaders(),
    });
  } catch (error: any) {
    console.error("API Error:", error);
    throw new Error(error.response?.data?.detail || `Ошибка ${error.response?.status} при удалении услуги`);
  }
}