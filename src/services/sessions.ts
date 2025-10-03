import api from './api';

export interface Conference {
  id: number
  name: string
}

export interface Session {
  id: number
  title: string
  deadline: string
  conference?: Conference | null
}

// Trae todas las sesiones
export const getAllSessions = async (): Promise<Session[]> => {
  const response = await api.get('/api/sessions');
  return response.data;
}

// Trae sesiones filtradas por conference_id
export const getSessionsByConference = async (conferenceId: number): Promise<Session[]> => {
  const response = await api.get('/api/sessions', {
    params: { conference_id: conferenceId } // esto genera ?conference_id=1
  });
  return response.data;
}