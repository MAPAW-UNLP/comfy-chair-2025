import api from './api';

type VISTA_CHOICES= "single blind" | "double blind" | "completo"

export interface Conferencia {
  id: string;
  titulo: string;
  descripcion: string;
  fecha_ini: string;
  fecha_fin: string;
  vista: VISTA_CHOICES;
}

export const getAllConferencias = async (): Promise<Conferencia[]> => {
  const response = await api.get('/conferencias/');
    console.log(response.data)
  return response.data;
};

export const getConferenciasActivas = async (): Promise<Conferencia[]> => {
  const response = await api.get('/conferencias/activas/');
    console.log(response.data)
  return response.data;
};

export const getConferenciasTerminadas = async (): Promise<Conferencia[]> => {
  const response = await api.get('/conferencias/terminadas/');
    console.log(response.data)
  return response.data;
};


export const getConferencia = async (id: string): Promise<Conferencia> => {
  const response = await api.get(`/conferencias/${id}/`);
  return response.data;
};

export const createConferencia = async (
  conferencia: Omit<Conferencia, "id">
): Promise<Conferencia> => {
  
  console.log("POST →", api.defaults.baseURL + '/conferencias/', conferencia)

  const response = await api.post('/conferencias/', conferencia)

  return response.data
}

