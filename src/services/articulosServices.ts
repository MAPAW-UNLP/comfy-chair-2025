// src/services/articulosService.ts

export interface Articulo {
  id: number;
  titulo: string;
  estado: 'Pendiente' | 'Completo';
}

// Simula una llamada a una API
export const fetchArticulos = (): Promise<Articulo[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data: Articulo[] = [
        {
          id: 1,
          titulo:
            'Análisis Comparativo de Algoritmos de Aprendizaje Profundo para la Detección de Anomalías en Redes de Telecomunicaciones',
          estado: 'Pendiente',
        },
        {
          id: 2,
          titulo:
            'Optimización de Protocolos de Comunicación en Redes de Sensores Inalámbricos con Consumo Energético Reducido',
          estado: 'Completo',
        },
        {
          id: 3,
          titulo:
            'Evaluación de Técnicas de Minería de Datos Aplicadas a Grandes Volúmenes de Información en Sistemas Financieros',
          estado: 'Completo',
        },
        {
          id: 4,
          titulo:
            'Diseño e Implementación de Sistemas de Seguridad Basados en Blockchain para la Protección de Datos Personales',
          estado: 'Pendiente',
        },
        {
          id: 5,
          titulo:
            'Impacto de la Computación Cuántica en la Criptografía Moderna: Retos y Perspectivas',
          estado: 'Pendiente',
        },
        {
          id: 6,
          titulo:
            'Métodos de Indexación y Recuperación de Información en Bases de Datos Distribuidas de Alta Escalabilidad',
          estado: 'Pendiente',
        },
      ];
      resolve(data);
    }, 1500);
  });
};
