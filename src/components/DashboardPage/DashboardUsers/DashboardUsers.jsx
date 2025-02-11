import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TemplatesList } from "@/components/DashboardPage/DashboardUsers/components/TemplatesList";
import { getAllTemplates, sendTemplates } from "@/services/templateService";
import { UserMessagePanel } from "./components/UserMessagePanel";
import {
  getAllusers,
  getUsersByStateBogota,
  getUsersByStateBucaramanga,
} from "@/services/userService";
import { StateSelection } from "./components/StateSelection";
import ExcelUpload from "./components/ExcelUpload";
import { DashboardHeader } from "./components/DashboardHeader";
import MessageStatusModal from "./components/MessageStatusModal";

// Componente principal del dashboard de usuarios
export const DashboardUsers = () => {
  // Estados para manejar las plantillas y la ciudad seleccionada
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  // Estados para manejar los usuarios y filtros
  const [currentState, setCurrentState] = useState(null);
  const [originalUsers, setOriginalUsers] = useState([]); // Lista de usuarios sin filtrar
  const [addressee, setAddressee] = useState([]); // Lista de destinatarios final
  const [filteredUsers, setFilteredUsers] = useState([]); // Lista de usuarios filtrados

  // Estados para manejar el modo de carga de Excel
  const [isExcelMode, setIsExcelMode] = useState(false); // Indicador si está en modo Excel
  const [excelData, setExcelData] = useState(null); // Datos cargados desde el archivo Excel

  // Estados para el manejo del modal de estado de mensajes
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageStatus, setMessageStatus] = useState({
    success: [],
    failed: [],
    successDetails: [],
    failedDetails: [],
  });

  // Configuración de estilos para los mensajes de notificación (toast)
  const toastStyles = {
    style: {
      background: "#1e293b",
      color: "#f1f5f9",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
    position: "top-right",
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  // Utilidad para limpiar el número de teléfono (remueve prefijo 57 y valida longitud)
  const cleanPhoneNumber = (phone) => {
    if (!phone) return null;
    const phoneStr = phone.toString().replace(/^57/, "");
    return phoneStr.length === 10 ? phoneStr : "0"; // Devuelve "0" si no cumple la longitud
  };

  // Utilidad para añadir el prefijo 57 al número de teléfono si no lo tiene
  const add57ToPhone = (phone) => (phone.startsWith("57") ? phone : `57${phone}`);

  // Carga inicial de los usuarios cuando no está en modo Excel
  useEffect(() => {
    const loadUsersIza = async () => {
      try {
        const usersData = await getAllusers(); // Llama al servicio para obtener usuarios
        setOriginalUsers(usersData.data);
        setAddressee(usersData.data);
      } catch (error) {
        toast.error("Error al cargar usuarios", toastStyles);
      }
    };

    if (!isExcelMode) {
      loadUsersIza();
    }
  }, [isExcelMode]); // Se ejecuta cuando cambia el estado de `isExcelMode`

  // Carga inicial de las plantillas al montar el componente
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templatesData = await getAllTemplates(); // Llama al servicio para obtener plantillas
        setTemplates(templatesData.data);
      } catch (error) {
        toast.error("Error al cargar plantillas", toastStyles);
      }
    };

    loadTemplates();
  }, []); // Solo se ejecuta una vez al montar el componente

  // Limpia los datos de Excel cuando se desactiva el modo Excel
  useEffect(() => {
    if (!isExcelMode) {
      setExcelData(null);
    }
  }, [isExcelMode]);

  // Maneja el filtrado de usuarios por estado y ciudad seleccionada
  const handleGetUsersByState = async (state) => {
    if (!selectedCity) return;

    const usersToFilter = isExcelMode ? excelData : originalUsers;

    if (!usersToFilter?.length) {
      toast.warn("No hay usuarios disponibles", toastStyles);
      return;
    }

    // Filtra usuarios válidos por número de teléfono
    const dataUsers = {
      status: state,
      list: usersToFilter
        .map((user) => cleanPhoneNumber(user.phone))
        .filter(Boolean),
    };

    if (!dataUsers.list.length) {
      toast.warn("No se encontraron números válidos", toastStyles);
      return;
    }

    try {
      // Llama al servicio según la ciudad seleccionada
      const response =
        selectedCity === "Bogota"
          ? await getUsersByStateBogota(dataUsers)
          : await getUsersByStateBucaramanga(dataUsers);

      const filteredResponseUsers = response?.data?.users || [];

      if (state === "NO_REGISTRADO") {
        // Para usuarios no registrados, filtra la lista original
        const matchingUsers = usersToFilter.filter((user) =>
          filteredResponseUsers.includes(cleanPhoneNumber(user.phone))
        );

        setAddressee(
          matchingUsers.map((user, index) => ({
            id: index + 1,
            username: user.name || user.username,
            phone: cleanPhoneNumber(user.phone),
          }))
        );
      } else {
        // Para otros estados, se utilizan los datos filtrados directamente
        setAddressee(
          filteredResponseUsers.map((user, index) => ({
            id: index + 1,
            username: user.name,
            phone: cleanPhoneNumber(user.phone),
          }))
        );
      }

      setFilteredUsers(response.data);
    } catch (error) {
      // Manejo de errores
      toast.error("Error al filtrar usuarios", toastStyles);
      setFilteredUsers([]);
      setAddressee([]);
    }
  };

  // Maneja el cambio de ciudad seleccionada
  const handleCityChange = (city) => {
    setSelectedCity(city);
    setCurrentState(null); // Resetea el estado actual
  };

  // Maneja los datos cargados desde un archivo Excel
  const handleExcelData = (data) => {
    setOriginalUsers([]); // Resetea usuarios originales
    setSelectedCity(null);
    setCurrentState(null);
    setExcelData(data);
    setAddressee(data); // Configura los destinatarios con los datos de Excel
  };

  // Maneja el envío masivo de mensajes
  const handleSendMessages = async () => {
    const phoneNumbers = addressee
      .map((user) => add57ToPhone(user.phone || user.telefono))
      .filter(Boolean);

    const dataMasiveMessage = {
      toList: phoneNumbers,
      template: selectedTemplate,
    };

    // Resetea selecciones
    setSelectedCity(null);
    setCurrentState(null);

    // Muestra un mensaje de carga mientras se envían los mensajes
    const sendingToastId = toast.loading(
      <div className="flex items-center space-x-2">
        <span className="text-cyan-400">📨</span>
        <span>Enviando mensajes...</span>
      </div>,
      toastStyles
    );

    try {
      const response = await sendTemplates(dataMasiveMessage);
      const { success = [], failed = [] } = response.data;

      // Detalles de usuarios con éxito y fallo
      const getDetailsWithNames = (numbersList) =>
        numbersList.map((number) => {
          const cleanNumber = number.startsWith("57") ? number.slice(2) : number;
          const userDetails = addressee.find((user) => {
            const userPhone = cleanPhoneNumber(user.phone || user.telefono);
            return userPhone === cleanNumber;
          });

          return {
            number,
            name: userDetails
              ? userDetails.username || userDetails.name || "Sin nombre"
              : "Desconocido",
          };
        });

      setMessageStatus({
        success,
        failed,
        successDetails: getDetailsWithNames(success),
        failedDetails: getDetailsWithNames(failed),
      });

      toast.dismiss(sendingToastId);

      // Mensajes de resultado
      if (success.length > 0 && failed.length === 0) {
        toast.success(
          <div className="flex items-center space-x-2 cursor-pointer">
            <span className="text-emerald-400">✅</span>
            <span>{success.length} mensajes enviados exitosamente!</span>
            <span className="text-xs text-cyan-300">(Click para ver detalles)</span>
          </div>,
          {
            ...toastStyles,
            onClick: () => setIsModalOpen(true), // Abre el modal al hacer clic
          }
        );
      } else if (failed.length > 0) {
        toast.warn(
          <div className="flex items-center space-x-2 cursor-pointer">
            <span className="text-amber-400">⚠️</span>
            <span>
              {success.length} enviados, {failed.length} fallidos
            </span>
            <span className="text-xs text-cyan-300">(Click para ver detalles)</span>
          </div>,
          {
            ...toastStyles,
            onClick: () => setIsModalOpen(true), // Abre el modal al hacer clic
          }
        );
      }
    } catch (error) {
      toast.dismiss(sendingToastId);
      toast.error(
        <div className="flex items-center space-x-2">
          <span className="text-red-400">❌</span>
          <span>Error al enviar los mensajes</span>
        </div>,
        toastStyles
      );
    }
  };

  // Renderización del componente
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto p-6 flex flex-col justify-center">
        {/* Contenedor de notificaciones */}
        <ToastContainer />

        {/* Modal de estado de mensajes */}
        <MessageStatusModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          successList={messageStatus.success}
          failedList={messageStatus.failed}
          messageStatus={messageStatus}
        />

        {/* Encabezado del dashboard */}
        <DashboardHeader
          selectedTemplate={selectedTemplate}
          selectedCity={selectedCity}
          selectState={currentState}
          isExcelMode={isExcelMode}
          setIsExcelMode={setIsExcelMode}
        />

        {/* Contenido del dashboard */}
        <div className="grid grid-cols-12 gap-6">
          {/* Lista de plantillas */}
          <div className="col-span-12 lg:col-span-4">
            <TemplatesList
              templates={templates}
              sendTemplate={setSelectedTemplate}
            />
          </div>

          {/* Panel principal */}
          <div className="col-span-12 lg:col-span-8">
            {/* Selección de estado */}
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
              <StateSelection
                currentState={currentState}
                setCurrentState={setCurrentState}
                onStateSelect={handleGetUsersByState}
                selectedCity={selectedCity}
                setSelectedCity={handleCityChange}
                disabled={!selectedTemplate}
              />
            </div>

            {/* Panel de carga de Excel o usuarios */}
            <div className="bg-slate-800/50 rounded-lg">
              {isExcelMode && !excelData ? (
                <ExcelUpload onDataProcessed={handleExcelData} />
              ) : (
                <UserMessagePanel
                  selectedUsers={addressee}
                  selectedTemplate={selectedTemplate}
                  citySelected={selectedCity}
                  stateSelected={currentState}
                  onSendMessages={handleSendMessages}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUsers;
