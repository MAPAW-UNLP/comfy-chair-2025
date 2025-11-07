import React from 'react';

type StatisticsProps = {
  fromConference: boolean;
};

function Statistics({ fromConference }: StatisticsProps) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-bold">Estadísticas</h2>

      <div className="flex flex-col gap-3">
        {fromConference && (
          <div>
            <h3 className="text-lg font-semibold">Sesiones</h3>
            <span>
              No entiendo que grafico iria, es solo un numero, ni si quiera es
              sobre algo
            </span>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold">Artículos enviados</h3>
          <span>
            No entiendo que grafico iria, es solo un numero, ni si quiera es
            sobre algo
          </span>
        </div>

        {!fromConference && <div>
          <h3 className="text-lg font-semibold">Artículos aceptados</h3>
          <span>
            En este si tiene sentido un grafico porque se puede hacer sobre el tope total de articulos aceptados
          </span>
        </div>}
      </div>
    </div>
  );
}

export default Statistics;
