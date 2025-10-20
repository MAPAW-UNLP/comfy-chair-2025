import { axiosInstance as api } from './api';
import type { User } from './userServices';

type VISTA_CHOICES = 'single blind' | 'double blind' | 'completo';

export interface Conference {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  blind_kind: VISTA_CHOICES;
}

export const getAllConferences = async (): Promise<Conference[]> => {
  const response = await api.get('/api/conference/');
  console.log(response.data);
  return response.data;
};

export const getActiveConferences = async (): Promise<Conference[]> => {
  try {
    const response = await api.get('/api/conference/active/');
    return response.data;
  } catch (err) {
    console.warn('Backend no disponible, devolviendo lista vacía.');
    return [];
  }
};

export const getFinishedConferences = async (): Promise<Conference[]> => {
  const response = await api.get('/api/conference/finished/');
  console.log(response.data);
  return response.data;
};

export const getConference = async (id: string): Promise<Conference> => {
  const response = await api.get(`/api/conference/${id}/`);
  return response.data;
};

const errorMessages: Record<string, string> = {
  'conferencia with this title already exists.':
    'Ya existe una conferencia con ese título',
  'Ensure this field has no more than 300 characters.':
    'La descripción no debe tener más de 300 caracteres',
  'Ensure this field has no more than 50 characters.':
    'El título no debe tener más de 50 caracteres',
};

const handleConferenceError = (err: any) => {
  const message = err.response?.data;
  const posibleError = message?.title?.[0] || message?.description?.[0];
  if (posibleError && errorMessages[posibleError]) {
    throw new Error(errorMessages[posibleError]);
  }
  console.error(err);
  throw err;
};

export const createConference = async (
  conferencia: Omit<Conference, 'id'>,
  chairs: User[]
): Promise<Conference> => {
  try {
    const response = await api.post('/api/conference/', {
      ...conferencia,
      chairs: chairs.map(user => user.id),
    });

    return response.data;
  } catch (err) {
    handleConferenceError(err);
    throw err;
  }
};

export const updateConference = async (
  id: string,
  conferencia: Omit<Conference, 'id'>,
  chairs: User[]
): Promise<Conference> => {
  try {
    const response = await api.put(`/api/conference/${id}/`, {
      ...conferencia,
      chairs: chairs.map(user => user.id),
    });
    return response.data;
  } catch (err) {
    handleConferenceError(err);
    throw err;
  }
};

export const deleteConference = async (id: string): Promise<void> => {
  await api.delete(`/api/conference/${id}/`);
};
