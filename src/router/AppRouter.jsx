import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardPage } from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import { ProtectedRoute } from '../router/ProtectedRoute';
import { GeneralConsult } from '../components/DashboardPage/GeneralConsult';

const AppRouter = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* Ruta por defecto */}
            <Route path="/" element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/auth/login" />
            } />

            {/* Ruta de login */}
            <Route
                path="/auth/login"
                element={
                    isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
                }
            />

            {/* Ruta protegida del chat */}
            <Route
                path="/dashboard"
                element={
                    // <ProtectedRoute>
                        <DashboardPage />
                    // </ProtectedRoute>
                }
            />  

            {/* Ruta para consulta general */}
            <Route 
                path="/dashboard/general"  
                element={<GeneralConsult />} 
            />

            {/* Ruta para cualquier otra dirección */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRouter;