import api from './api';

type VISTA_CHOICES = 'single blind' | 'double blind' | 'completo';

export interface Conference {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  blind_kind: VISTA_CHOICES;
}

export const getAllConferencesGrupo1 = async (): Promise<Conference[]> => {
  const response = await api.get('/api/conference');
  return response.data;
}

export const getAllConferences = async (): Promise<Conference[]> => {
  const response = await api.get('/conferencias/');
  console.log(response.data);
  return response.data;
};

export const getActiveConferences = async (): Promise<Conference[]> => {
  try {
    const response = await api.get('/conferencias/activas/');
    return response.data;
  } catch (err) {
    console.warn('Backend no disponible, devolviendo lista vacía.');
    return []; 
  }
};

export const getFinishedConferences = async (): Promise<Conference[]> => {
  const response = await api.get('/conferencias/terminadas/');
  console.log(response.data);
  return response.data;
};

export const getConference = async (id: string): Promise<Conference> => {
  const response = await api.get(`/conferencias/${id}/`);
  return response.data;
};

export const createConference = async (
  conferencia: Omit<Conference, 'id'>
): Promise<Conference> => {
  try {
    const response = await api.post('/conferencias/', conferencia);

    return response.data;
  } catch (err: any) {
    console.log(err);
    if (
      err.response?.data?.title?.[0] ==
      'conferencia with this title already exists.'
    ) {
      throw new Error('Ya existe una conferencia con ese título');
    } else if (
      err.response?.data?.description?.[0] ==
      'Ensure this field has no more than 300 characters.'
    ) {
      throw new Error('La descripción no debe tener más de 300 caracteres');
    } else if (
      err.response?.data?.title?.[0] ==
      'Ensure this field has no more than 50 characters.'
    ) {
      throw new Error('El título no debe tener más de 50 caracteres');
    } else throw err;
  }
};

export const deleteConference = async (id: string): Promise<void> => {
  await api.delete(`/conferencias/${id}/`);
};

export const updateConference = async (
  id: string,
  conferencia: Omit<Conference, 'id'>
): Promise<Conference> => {
  try {
    const response = await api.put(`/conferencias/${id}/`, conferencia);
    return response.data;
  } catch (err: any) {
    if (
      err.response?.data?.title?.[0] ==
      'conferencia with this title already exists.'
    ) {
      throw new Error('Ya existe una conferencia con ese título');
    } else if (
      err.response?.data?.description?.[0] ==
      'Ensure this field has no more than 300 characters.'
    ) {
      throw new Error('La descripción no debe tener más de 300 caracteres');
    } else if (
      err.response?.data?.title?.[0] ==
      'Ensure this field has no more than 50 characters.'
    ) {
      throw new Error('El título no debe tener más de 50 caracteres');
    } else throw err;
  }
};
