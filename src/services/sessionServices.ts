import type { Conference } from '@/components/conference/ConferenceApp';

import { axiosInstance as api } from './api';

export interface Session {
  id: number
  title: string
  deadline: string
  capacity: number
  conference: Conference | null
}

// Trae todas las sesiones
export const getAllSessions = async (): Promise<Session[]> => {
  const response = await api.get('/api/session');
  return response.data;
}

// Trae sesiones filtradas por conference_id
export const getSessionsByConference = async (conferenceId: number): Promise<Session[]> => {
  const response = await api.get('/api/session', {
    params: { conference_id: conferenceId } // esto genera ?conference_id=1
  });

  return response.data;
}

//Trae una sesion por su ID
export const getSession= async (sessionId: string): Promise<Session> => {
  const response = await api.get(`/api/session/${sessionId}/`);
      console.log('Sessions fetched:', response.data);
  return response.data;
}

// Elimina una sesión por su ID
export const deleteSession = async (sessionId: string): Promise<void> => {
  await api.delete(`/api/session/${sessionId}/`);
}