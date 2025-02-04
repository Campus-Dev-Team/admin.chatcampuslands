import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DashboardPage } from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import { ProtectedRoute } from "../router/ProtectedRoute";
import { MessageAdminPage } from "../components/DashboardPage/Messages/MessageAdminPage";
import { DashboardReports } from "@/components/DashboardPage/DashboardReports/DashboardReports";

const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Ruta por defecto */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" />
          ) : (
            <Navigate to="/auth/login" />
          )
        }
      />

      {/* Ruta de login */}
      <Route
        path="/auth/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
      />

      {/* Rutas protegidas del dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      >
        {/* Ruta por defecto del dashboard */}
        <Route index element={<DashboardReports />} />

        {/* Rutas específicas dentro del dashboard */}

        <Route
          path="settings"
          element={
            <div className="flex w-full h-full justify-center items-center text-white">
              Pronto habra algo aquí ⚙️{" "}
            </div>
          }
        />
        <Route
          path="users"
          element={
            <div className="flex w-full h-full justify-center items-center text-white">
              Pronto habra algo aquí 😊{" "}
            </div>
          }
        />
        <Route path="messages" element={<MessageAdminPage />} />
      </Route>

      {/* Ruta para cualquier otra dirección */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;
