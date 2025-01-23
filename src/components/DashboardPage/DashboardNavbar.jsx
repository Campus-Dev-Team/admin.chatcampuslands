import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LazyImage } from "../common/LazyImage";

export const DashboardNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // Controlar el estado de carga para la animación

  useEffect(() => {
    // Agregar un pequeño retraso para activar la animación al cargar
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);

    return () => clearTimeout(timer); // Limpiar el temporizador
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <div
      className={`fixed lg:relative lg:translate-x-0 inset-y-0 left-0 z-40
      bg-slate-800/50 backdrop-blur-xl border-cyan-400/10
      flex flex-col transform transition-all duration-300
      ${isMenuOpen ? "translate-x-0" : "-translate-x-[calc(100%-6px)]"}
      ${isLoaded ? "opacity-100 transition-opacity duration-700" : "opacity-0"}`}
      style={{
        width: isCollapsed ? "64px" : "320px", // Ancho dinámico para animar
        transition: "width 300ms ease-in-out", // Transición para el cambio de ancho
      }}
    >
      {/* Botón hamburguesa (móvil) */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden fixed top-1/2 -translate-y-1/2 left-0 z-50 
        w-6 h-12 bg-slate-800 text-white rounded-r-lg border-cyan-400/10 
        hover:bg-slate-700 transition-all duration-200"
      >
        {isMenuOpen ? <ChevronLeft /> : <ChevronRight />}
      </button>

      {/* Botón colapso (desktop) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`hidden lg:flex items-center justify-center fixed top-1/2 -translate-y-1/2 z-50 w-8 h-8 
        bg-slate-800 text-white rounded-full shadow-sm border-cyan-400/10 
        hover:bg-slate-700/90 transition-all duration-200 ${isCollapsed ? "translate-x-0 " : "translate-x-4"
          }`}
        style={{
          left: isCollapsed ? "44px" : "284px",
          transition: "left 300ms ease-in-out", // Transición para la posición del botón
        }}
      >
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>

      {/* Contenido del navbar */}
      <div className={`p-8 flex flex-col items-center space-y-6 ${isCollapsed ? "lg:p-4" : ""}`}>
        <div className="relative">
          <div
            className={`ring-2 ring-cyan-400/20 rounded-full bg-slate-800 
              flex items-center justify-center overflow-hidden
              ${isCollapsed ? "h-12 w-12" : "h-28 w-28"}
              ${isLoaded ? "opacity-100 transition-opacity duration-700" : "opacity-0"}`}
          >
            <LazyImage
              src="https://camper-stories.s3.us-east-2.amazonaws.com/assets/iza-campus.webp "
              alt="Iza Campus"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className={`text-center ${isCollapsed ? "hidden" : ""}`}>
          <h2 className="text-2xl font-bold text-cyan-400">IZA</h2>
          <p className="text-indigo-400 text-sm">Admin Dashboard</p>
        </div>
      </div>

      {/* Filtros, Estadísticas y Reporte */}
      {!isCollapsed && (
        <div
          className={`px-6 flex-1 space-y-3 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"
            }`}
          
        >
          <div className="flex flex-col justify-items-start ml-3">
            {/* Selector de Fecha de Inicio */}
            <div>
              <label className="text-white/70 text-sm block mb-1">Fecha Inicio</label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-[#2A303C] text-white rounded-lg border border-[#00D8D6]
             focus:ring-2 focus:ring-[#00D8D6] focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Selector de Fecha de Fin */}
            <div>
              <label className="text-white/70 text-sm block mb-1">Fecha Fin</label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-[#2A303C] text-white rounded-lg border border-[#00D8D6]
             focus:ring-2 focus:ring-[#00D8D6] focus:outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Botón Aplicar Filtro */}
          <button
            className="w-full mt-4 px-4 py-2 bg-cyan-400 text-white rounded-lg font-semibold hover:bg-cyan-500/90
         transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            Aplicar Filtro
          </button>

          {/* Botón Descargar Reporte */}
          <button
            className="w-full mt-4 px-4 py-2 bg-[#2A303C] text-white rounded-lg font-semibold hover:bg-[#1B2430]/90
         border border-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            onClick={() => {
              console.log("Descargando reporte...");
            }}
          >
            Descargar Reporte
          </button>
        </div>
      )}


      {/* Botón Logout */}
      <div
        className={`p-6 border-t border-cyan-400/10 flex flex-col transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"
          }`}
      >
        <button
          onClick={handleLogout}
          className={`w-full flex items-center justify-center px-4 py-2 text-white/70 hover:text-red-400 hover:bg-red-400/5 rounded-lg 
            group transition-all duration-300 ${isCollapsed ? "justify-center" : ""}`}
        >
          <LogOut className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
};