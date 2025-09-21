export interface Revisor {
  id: number;
  nombre_completo: string;
  email: string;
}

export interface RevisoresPorInteres {
  interesados: Revisor[];
  quizas: Revisor[];
  no_interesados: Revisor[];
}

export const getRevisoresByArticulo = async (
  articuloId: number
): Promise<RevisoresPorInteres> => {
  switch (articuloId) {
    case 1:
      return {
        interesados: [
          { id: 1, nombre_completo: 'Juan Pérez', email: 'juan@example.com' },
        ],
        quizas: [
          { id: 2, nombre_completo: 'Ana Gómez', email: 'ana@example.com' },
        ],
        no_interesados: [
          { id: 3, nombre_completo: 'Carlos López', email: 'carlos@example.com' },
        ],
      };
    case 2:
      return {
        interesados: [
          { id: 4, nombre_completo: 'Lucía Díaz', email: 'lucia@example.com' },
        ],
        quizas: [],
        no_interesados: [
          { id: 5, nombre_completo: 'Mateo Fernández', email: 'mateo@example.com' },
          { id: 3, nombre_completo: 'Carlos López', email: 'carlos@example.com' },
        ],
      };
    default:
      return {
        interesados: [],
        quizas: [],
        no_interesados: [],
      };
  }
};
