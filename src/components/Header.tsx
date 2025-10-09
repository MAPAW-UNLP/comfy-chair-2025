import React, { useState } from "react";
import { Menu, Armchair } from "lucide-react";
import { useNavigate, useMatchRoute } from "@tanstack/react-router";
import Sidebar from "./Sidebar";

function Header() {
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isRevisoresPage = matchRoute({ to: "/articulos/$id/revisores" });

  const goHome = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="flex justify-between items-center bg-primary w-full h-20 text-white px-4">
      <div className="cursor-pointer" onClick={() => setSidebarOpen(true)}>
        <Menu className="w-6 h-6" />
      </div>

      <div
        className="flex-1 text-center flex flex-col items-center leading-tight cursor-pointer"
        onClick={!isRevisoresPage ? goHome : undefined}
      >
        {!isRevisoresPage ? (
          <p className="text-2xl italic">ComfyChair</p>
        ) : (
          <>
            <p className="text-2xl font-semibold">Revisores disponibles</p>
            <p className="text-sm text-gray-200">para el artículo:</p>
          </>
        )}
      </div>

      {isRevisoresPage ? (
        <div className="cursor-pointer" onClick={goHome}>
          <Armchair className="w-7 h-7 text-white hover:text-gray-300 transition-colors" />
        </div>
      ) : (
        <div className="w-7 h-7" />
      )}

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </div>
  );
}

export default Header;
