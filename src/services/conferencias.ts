import api from './api';

type VISTA_CHOICES = 'single blind' | 'double blind' | 'completo';

export interface Conferencia {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  blind_kind: VISTA_CHOICES;
}

export const getAllConferencias = async (): Promise<Conferencia[]> => {
  const response = await api.get('/conferencias/');
  console.log(response.data);
  return response.data;
};

export const getConferenciasActivas = async (): Promise<Conferencia[]> => {
  const response = await api.get('/conferencias/activas/');
  console.log(response.data);
  return response.data;
};

export const getConferenciasTerminadas = async (): Promise<Conferencia[]> => {
  const response = await api.get('/conferencias/terminadas/');
  console.log(response.data);
  return response.data;
};

export const getConferencia = async (id: string): Promise<Conferencia> => {
  const response = await api.get(`/conferencias/${id}/`);
  return response.data;
};

export const createConferencia = async (
  conferencia: Omit<Conferencia, 'id'>
): Promise<Conferencia> => {
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

export const deleteConferencia = async (id: string): Promise<void> => {
  await api.delete(`/conferencias/${id}/`);
};

export const updateConferencia = async (
  id: string,
  conferencia: Omit<Conferencia, 'id'>
): Promise<Conferencia> => {
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
