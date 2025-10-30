import { axiosInstance as api } from './api';

export interface User {
  id: number;
  full_name: string;
  affiliation: string;
  email: string;
  role: string;
  deleted:boolean;
}

export interface Article {
  id: number;
  title: string;
  status?: string;
  type?: string;
  score?: number | null;
  opinion?: string | null;
}

export interface Role {
  role: string;
  articles: Article[];
}

export interface Session {
  session_id: number;
  session_name: string;
  roles: Role[];
}

export interface UserConference {
  conference_id: number;
  conference_name: string;
  sessions: Session[];
}

export interface ProcessedConference {
  conference_id: number;
  conference_name: string;
  roles: string[];
}

export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get('/user/getUsers');
  return response.data;
}

export const getUserFullData = async (): Promise<ProcessedConference[]> => {
  const response = await api.get('/user/user-full-data/');
  const conferences: UserConference[] = response.data.conferences;
  
  // Procesar la respuesta para extraer roles únicos por conferencia
  const processedConferences: ProcessedConference[] = conferences.map((conference) => {
    // Recopilar todos los roles únicos de todas las sesiones
    const rolesSet = new Set<string>();
    
    conference.sessions.forEach((session) => {
      session.roles.forEach((roleObj) => {
        rolesSet.add(roleObj.role);
      });
    });
    
    return {
      conference_id: conference.conference_id,
      conference_name: conference.conference_name,
      roles: Array.from(rolesSet),
    };
  });
  
  return processedConferences;
}

// Notification type enum
export type NotificationType = "info" | "critical";

// Main Notification interface
export interface Notification {
  id: number;
  user: number; // User ID (foreign key)
  article: number | null; // Article ID (foreign key, can be null)
  title: string; // max 100 characters
  message: string;
  type: NotificationType;
  read: boolean;
  created_at: string; // ISO datetime string
}

// API Response interfaces
export interface NotificationsResponse {
  data: Notification[];
}

export interface MarkAsReadResponse {
  message: string;
}

// Get all notifications for authenticated user
export const getAllNotifications = async (): Promise<Notification[]> => {
  const response = await api.get('/notifications/');
  return response.data;
}

// Mark notification as read
export const markNotificationAsRead = async (notificationId: number): Promise<MarkAsReadResponse> => {
  const response = await api.post(`/notifications/${notificationId}/read/`);
  return response.data;
}