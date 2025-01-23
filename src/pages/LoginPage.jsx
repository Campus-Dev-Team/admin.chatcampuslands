import React, { useRef, useState, useEffect } from "react";
import { Mail, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import campushm from "../assets/Campushm.png";
import { useNavigate } from "react-router-dom";
import { login } from "../services/loginService";
import { register } from "@/services/registerService";
import { useAuth } from "@/context/AuthContext";

const phoneInputStyles = {
  container: `flex-1 min-w-0 block w-full`,
  input: `w-full px-3 py-2 rounded-r-lg bg-[#2A303C] text-white
          border border-[#00D8D6] focus:ring-2 focus:ring-[#00D8D6] focus:ring-offset-0
          transition-all duration-200 hover:bg-[#2A303C]/80`,
};

const customPhoneStyles = `
  .iti__selected-dial-code {
    color: white !important;
  }
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const phoneInputRef = useRef(null);
  const itiRef = useRef(null);
  const [formData, setFormData] = useState({
    telefono: "",
    username: "",
    city: "",
  });
  const [updatedFormData, setUpdatedFormData] = useState({
    telefono: "",
    username: "",
    city: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const cities = ["Bucaramanga", "Bogotá"];
  const { loginStorage } = useAuth();

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = customPhoneStyles;
    document.head.appendChild(styleSheet);

    if (phoneInputRef.current && window.intlTelInput) {
      itiRef.current = window.intlTelInput(phoneInputRef.current, {
        separateDialCode: true,
        initialCountry: "co",
        preferredCountries: ["co"],
        onlyCountries: ["co"], // Solo permitir Colombia
        allowDropdown: false, // Deshabilitar el dropdown de países
      });
    }

    return () => {
      if (itiRef.current) {
        itiRef.current.destroy();
      }
      // Limpiar los estilos al desmontar
      document.head.removeChild(styleSheet);
    };
  }, []);

  const validarTelefono = (numero) => {
    if (!numero) return null;

    // Convertir a string y eliminar todo lo que no sea número
    let numeroLimpio = numero.toString().replace(/\D/g, "");

    // Si ya tiene el prefijo 57, dejarlo como está
    if (numeroLimpio.startsWith("57")) {
      return numeroLimpio;
    }

    // Si es un número válido de Colombia (10 dígitos comenzando con 3)
    if (numeroLimpio.length === 10 && numeroLimpio.startsWith("3")) {
      // Agregar el prefijo 57
      return `57${numeroLimpio}`;
    }

    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Obtener el número completo con el código de país
    const phoneNumber = itiRef.current
      ? itiRef.current.getNumber()
      : formData.phone;
    const validatedPhone = validarTelefono(phoneNumber);

    if (!validatedPhone) {
      setError("Por favor, ingresa un número de teléfono colombiano válido");
      setIsLoading(false);
      return;
    }

    setUpdatedFormData({
      ...formData,
      telefono: validatedPhone,
    });

    try {
      console.log("ciudad de usuario", formData.city);

      console.log(
        "telefono a enviar",
        validatedPhone,
        "//",
        updatedFormData.telefono
      );

      console.log("formdata updated", updatedFormData);

      await login({
        ...formData,
        telefono: validatedPhone
      });

      console.log('telefono a enviar', validatedPhone, "//", updatedFormData.phone)
      loginStorage(formData.username, formData.city);
      localStorage.setItem('city', formData.city);
      navigate("/chat");
    } catch (error) {
      try {
        const response = await register({
          ...formData,
          telefono: validatedPhone
        });
        if (response) {
          
          loginStorage(formData.username, formData.city);
          navigate("/chat");
          return;
        }
      } catch (registerError) {
        console.error("Error en registro:", registerError);
        setError("Error en el registro. Verifica tus datos.");
      }

      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError("Credenciales inválidas");
            break;
          case 404:
            setError("Usuario no encontrado");
            break;
          default:
            setError("Error al iniciar sesión. Intente nuevamente");
        }
      } else if (error.request) {
        setError("Error de conexión. Verifique su internet");
      } else {
        setError("Error al procesar la solicitud");
      }
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
              ¡Bienvenido a Campuslands!
            </h1>

            {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white text-left block text-sm">
                  Teléfono
                </Label>
                <div className="flex">
                  <input
                    type="tel"
                    name="telefono"
                    ref={phoneInputRef}
                    required
                    className={phoneInputStyles.input}
                    placeholder="321 1234567"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white text-left block text-sm">
                  Nombre y Apellido
                </Label>
                <div className="relative group">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A1A1AA] 
                    group-hover:text-[#00D8D6] transition-colors duration-200"
                    size={18}
                  />
                  <input
                    type="text"
                    name="username"
                    required
                    className="w-full py-2.5 px-4 pl-9 bg-[#2A303C] rounded-lg text-white 
                      text-sm focus:outline-none focus:ring-2 focus:ring-[#00D8D6] 
                      focus:ring-offset-0 transition-all duration-200 hover:bg-[#2A303C]/80"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white text-left block text-sm">
                  Ciudad
                </Label>
                <div className="relative group">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A1A1AA] 
                      group-hover:text-[#00D8D6] transition-colors duration-200"
                    size={18}
                  />
                  <select
                    name="city"
                    required
                    className="w-full py-2.5 px-4 pl-9 bg-[#2A303C] rounded-lg text-white 
                           text-sm focus:outline-none focus:ring-2 focus:ring-[#00d8d4] 
                           focus:ring-offset-0 transition-all duration-200 hover:bg-[#2A303C]/80"
                    value={formData.city}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccione su ciudad</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 sm:py-3 px-4 rounded-lg text-sm 
                     cursor-pointer transition-all duration-300 
                     text-white font-semibold transform hover:scale-[1.02]
                     active:scale-[0.98] hover:shadow-lg
                       ${
                         isLoading
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
