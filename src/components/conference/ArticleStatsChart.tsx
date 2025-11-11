import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';

type ArticleStatsChartProps = {
  accepted: number;
  rejected: number;
  capacity?: number;
};

export function ArticleStatsChart({ accepted, rejected, capacity }: ArticleStatsChartProps) {
  const total = accepted + rejected;
  const acceptedPercentage = total > 0 ? (accepted / total) * 100 : 0;
  const rejectedPercentage = total > 0 ? (rejected / total) * 100 : 0;

  return (
    <Card className="p-6 bg-white shadow-md">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Estado de los Artículos</h3>
          <span className="text-sm text-gray-500">Total: {total}</span>
        </div>

        {/* Artículos Aceptados */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-700">Aceptados</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-green-700">{accepted}</span>
              <span className="text-xs text-gray-500">
                ({acceptedPercentage.toFixed(1)}%)
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-full flex items-center justify-start px-3 transition-all duration-500 ease-out"
              style={{ width: `${acceptedPercentage}%` }}
            >
              {acceptedPercentage > 10 && (
                <span className="text-xs font-semibold text-white">
                  {accepted}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Artículos Rechazados */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="font-medium text-gray-700">Rechazados</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-red-700">{rejected}</span>
              <span className="text-xs text-gray-500">
                ({rejectedPercentage.toFixed(1)}%)
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
            <div
              className="bg-gradient-to-r from-red-500 to-red-600 h-full flex items-center justify-start px-3 transition-all duration-500 ease-out"
              style={{ width: `${rejectedPercentage}%` }}
            >
              {rejectedPercentage > 10 && (
                <span className="text-xs font-semibold text-white">
                  {rejected}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Información adicional sobre capacidad */}
        {capacity !== undefined && capacity > 0 && (
          <div className="mt-2 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Cupo máximo de artículos aceptados:</span>
              <span className="font-semibold text-gray-800">
                {accepted} / {capacity}
                {accepted > capacity && (
                  <span className="ml-2 text-xs text-orange-600 font-normal">
                    (Excedido)
                  </span>
                )}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ease-out ${
                  accepted > capacity
                    ? 'bg-gradient-to-r from-orange-500 to-red-500'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600'
                }`}
                style={{ width: `${Math.min((accepted / capacity) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
