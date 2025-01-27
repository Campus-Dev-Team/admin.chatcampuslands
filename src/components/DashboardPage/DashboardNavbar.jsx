import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  MessageCircle,
  Settings,
  Users,
  BarChart2,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { LazyImage } from "../common/LazyImage";

export const DashboardNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Hook para obtener la ruta actual
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const menuItems = [
    {
      icon: <BarChart2 className="h-5 w-5" />,
      label: "Reportes",
      path: "/dashboard",
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: "Consulta General",
      path: "/dashboard/general",
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: "Mensajes",
      path: "/dashboard/messages",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Configuración",
      path: "/dashboard/settings",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Usuarios",
      path: "/dashboard/users",
    },
  ];

  return (
    <>
      {/* Botón hamburguesa (móvil) */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden fixed top-1/2 -translate-y-1/2 left-0 z-50 
          w-6 h-12 bg-slate-800 text-white rounded-r-lg border-cyan-400/10 
          hover:bg-slate-700 transition-all duration-200"
      >
        {isMenuOpen ? <ChevronLeft /> : <ChevronRight />}
      </button>

      {/* Navbar */}
      <div
        className={`fixed lg:relative lg:translate-x-0 inset-y-0 left-0 z-40
                  bg-slate-800/50 backdrop-blur-xl border-cyan-400/10
                  flex flex-col transform transition-all duration-300
                  ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
                  ${isCollapsed ? "lg:w-[64px]" : "lg:w-80"}`}
      >
        {/* Contenido del navbar */}
        <div className={`p-8 flex flex-col items-center space-y-6 ${isCollapsed ? "lg:p-4" : ""}`}>
          <div className="relative">
            <div
              className={`ring-2 ring-cyan-400/20 rounded-full bg-slate-800 
              flex items-center justify-center overflow-hidden
              ${isCollapsed ? "h-12 w-12" : "h-28 w-28"}`}
            >
              <LazyImage
                src="https://camper-stories.s3.us-east-2.amazonaws.com/assets/iza-campus.webp"
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

        {/* Menú de opciones */}
        <div className="flex-1 flex flex-col space-y-2 p-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center px-4 py-2 rounded-lg 
                group transition-all duration-300 ${location.pathname === item.path
                  ? "bg-cyan-400/10 text-cyan-400"
                  : "text-white/70 hover:text-cyan-400 hover:bg-cyan-400/5"
                } ${isCollapsed ? "justify-center" : ""}`}
            >
              {item.icon}
              {!isCollapsed && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </div>

        {/* Cerrar sesión */}
        <div className="p-6 border-t border-cyan-400/10 flex flex-col">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center px-4 py-2 text-white/70 hover:text-red-400 hover:bg-red-400/5 rounded-lg 
                     group transition-all duration-300
                     ${isCollapsed ? "justify-center" : ""}`}
          >
            <LogOut className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
            {!isCollapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </div>

      {/* Overlay (cierre menú móvil) */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};
