import React, { useState } from "react";
import {
  Rocket,
  Code,
  Facebook,
  Instagram,
  Linkedin,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LazyImage } from "../common/LazyImage";

// Componente personalizado para TikTok
const TikTokIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

// Mapeo de redes sociales por ciudad
const socialMediaByCity = {
  // hola
  Bucaramanga: [
    { Icon: Facebook, url: "https://www.facebook.com/Campuslands" },
    { Icon: Instagram, url: "https://www.instagram.com/campuslands/" },
    { Icon: TikTokIcon, url: "https://www.tiktok.com/campuslands" },
    { Icon: Linkedin, url: "https://www.linkedin.com/company/campuslands/" },
  ],
  Bogotá: [
    { Icon: Facebook, url: "https://www.facebook.com/Campuslands" },
    { Icon: Linkedin, url: "https://www.linkedin.com/company/campuslands/" },
    { Icon: Instagram, url: "https://www.instagram.com/eancampuslands/" },
    { Icon: TikTokIcon, url: "https://www.tiktok.com/@campuslands" },
  ],
};

export const ChatNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Obtener ciudad desde localStorage
  const city = localStorage.getItem("userCity");
  const socialMedia = socialMediaByCity[city] || [];

  console.log(socialMedia);
  console.log(socialMediaByCity);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

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

      {/* Botón colapso (desktop) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:block fixed top-1/2 -translate-y-1/2 z-50 w-8 h-8 
          bg-slate-800 text-white rounded-full shadow-sm border-cyan-400/10 
          hover:bg-slate-700/90 transition-all duration-200"
        style={{
          left: isCollapsed ? "44px" : "284px",
          transition: "all 300ms ease-in-out",
        }}
      >
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>

      {/* Navbar */}
      <div
        className={`fixed lg:relative lg:translate-x-0 inset-y-0 left-0 z-40
                    bg-slate-800/50 backdrop-blur-xl border-cyan-400/10
                    flex flex-col transform transition-all duration-300
                    ${isMenuOpen ? "translate-x-0" : "-translate-x-[calc(100%-6px)]"}
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
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-cyan-400 rounded-full ring-2 ring-slate-900" />
          </div>

          <div className={`text-center ${isCollapsed ? "hidden" : ""}`}>
            <h2 className="text-2xl font-bold text-cyan-400">IZA</h2>
            <p className="text-indigo-400 text-sm">Campus Support Team</p>
          </div>
        </div>

        {/* Menú */}
        <div className="px-6 flex-1 space-y-3">
          {[
            { icon: Rocket, text: "Campers Storys" },
            { icon: Code, text: "Campuslands" },
          ].map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center px-4 py-2 text-white/70 hover:bg-cyan-400/5 rounded-lg 
                      hover:text-cyan-400 group transition-all duration-300
                      ${isCollapsed ? "justify-center" : ""}`}
            >
              <item.icon className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
              {!isCollapsed && <span>{item.text}</span>}
            </button>
          ))}
        </div>

        {/* Redes sociales */}
        <div className="p-6 border-t border-cyan-400/10 flex flex-col space-y-6">
          <div className={`flex ${isCollapsed ? "lg:flex-col space-y-4" : "space-x-6 justify-center"}`}>
            {socialMedia.map(({ Icon, url }, index) => (
              <a
                href={url}
                key={index}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-cyan-400 transition-colors duration-300"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>

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
