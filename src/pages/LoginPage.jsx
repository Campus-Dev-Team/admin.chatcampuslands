import React, { useState } from "react";
import { Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import campushm from "../assets/Campushm.png";
import { useNavigate } from "react-router-dom";
import { login } from "../services/loginService";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated } = useAuth();

  const handleInputChange = (e) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

// In LoginPage.jsx

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  try {
    await login({"username": password, "phone": 123456719, "role": "ADMIN"});
    localStorage.setItem('userName', 'Campuslands');
    setIsAuthenticated(true);
    navigate("/dashboard");
  } catch (error) {
    console.error('Login error:', error);
    setError(error.message || "Error al procesar la solicitud");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md px-4 sm:px-6">
        <div
          className="w-full bg-[#23272F] p-6 md:p-8 border border-[#00d8d4] rounded-2xl 
                   shadow-[0_0_30px_-6px_#00D8D6] text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-700/50 to-slate-700/50 opacity-50"></div>

          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-24 sm:w-32 md:w-40 transition-transform duration-300 hover:scale-105">
                <img
                  src={campushm}
                  alt="Campus"
                  className="w-full h-auto mx-auto"
                />
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white mb-8">
              ¡Bienvenido al Panel Administrativo!
            </h1>

            {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white text-left block text-sm">
                  Contraseña
                </Label>
                <div className="relative group">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A1A1AA] 
                      group-hover:text-[#00D8D6] transition-colors duration-200"
                    size={18}
                  />
                  <input
                    type="password"
                    name="password"
                    required
                    className="w-full py-2.5 px-4 pl-9 bg-[#2A303C] rounded-lg text-white 
                      text-sm focus:outline-none focus:ring-2 focus:ring-[#00D8D6] 
                      focus:ring-offset-0 transition-all duration-200 hover:bg-[#2A303C]/80"
                    value={password}
                    onChange={handleInputChange}
                    placeholder="Ingrese su contraseña"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 sm:py-3 px-4 rounded-lg text-sm 
                     cursor-pointer transition-all duration-300 
                     text-white font-semibold transform hover:scale-[1.02]
                     active:scale-[0.98] hover:shadow-lg
                       ${isLoading
                    ? "bg-cyan-400 cursor-not-allowed"
                    : "bg-cyan-400 hover:bg-cyan-500/90"
                  }`}
              >
                {isLoading ? "Iniciando sesión..." : "Ingresar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
