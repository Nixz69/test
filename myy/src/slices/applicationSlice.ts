import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Application } from '../types';
import {
  fetchOrCreateDraftApplication,
  updateApplicationStatus,
  addServiceToApplication,
  removeServiceFromApplication,
} from '../api/services/applicationApi';

interface ApplicationState {
  applications: Application[];
  currentApplication: Application | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ApplicationState = {
  applications: [],
  currentApplication: null,
  status: 'idle',
  error: null,
};

// Получение всех заявок
export const fetchApplications = createAsyncThunk(
  'applications/fetchAll',
  async () => {
    return await fetchOrCreateDraftApplication("GET");
  }
);


// Создание новой заявки
export const createApplication = createAsyncThunk(
  'applications/create',
  async () => {
    const [newApp] = await fetchOrCreateDraftApplication("POST");
    return newApp;
  }
);

// Обновление статуса заявки
export const updateStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ id, status }: { id: number; status: string }) => {
    return await updateApplicationStatus(id, status);
  }
);

// Добавление услуги в заявку
export const addService = createAsyncThunk(
  'applications/addService',
  async (params: { serviceId: number; applicationId: number; quantity?: number }) => {
    return await addServiceToApplication(params.serviceId, params.applicationId, params.quantity);
  }
);

// Удаление услуги из заявки
export const removeService = createAsyncThunk(
  'applications/removeService',
  async (applicationServiceId: number) => {
    await removeServiceFromApplication(applicationServiceId);
    return applicationServiceId;
  }
);

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setCurrentApplication(state, action: PayloadAction<Application | null>) {
      state.currentApplication = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.applications = action.payload;
        const draft = action.payload.find((app) => app.status === 'draft');
        state.currentApplication = draft || null;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Не удалось загрузить заявки';
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.applications.push(action.payload);
        state.currentApplication = action.payload;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.applications.findIndex((a) => a.id === updated.id);
        if (index !== -1) {
          state.applications[index] = updated;
        }
        if (state.currentApplication?.id === updated.id) {
          state.currentApplication = updated;
        }
      });
    // Можно также добавить fulfilled для addService и removeService, если нужно
  },
});

export const { setCurrentApplication } = applicationSlice.actions;
export default applicationSlice.reducer;
