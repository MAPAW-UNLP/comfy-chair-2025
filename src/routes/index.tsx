import { createFileRoute } from "@tanstack/react-router";
import { Armchair } from "lucide-react";

function Index() {

  return (
    <div className="p-4 sm:p-8 md:p-12 min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="max-w-4xl mx-auto text-center p-8 sm:p-12 bg-white rounded-2xl shadow-xl border border-gray-100">

        <Armchair className="w-16 h-16 text-blue-800 mx-auto mb-6 opacity-80" />

        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
          ¡Bienvenido a Comfy Chair!
        </h1>

        <p className="mt-4 text-xl text-gray-800 max-w-xl mx-auto">
          <span className="font-semibold text-blue-900 block mt-1">
            MAPAW 2025
          </span>
        </p>

        {/* <div className="mt-12 pt-8 border-t border-gray-100">
          <Inicio />
        </div> */}

      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});
