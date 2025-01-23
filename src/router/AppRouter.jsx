import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import { ChatPage } from '../pages/ChatPage'
import { ProtectedRoute } from '../router/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const AppRouter = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* Ruta por defecto */}
            <Route path="/" element={
                isAuthenticated ? <Navigate to="/chat" /> : <Navigate to="/auth/login" />
            } />

            {/* Ruta de login */}
            <Route
                path="/auth/login"
                element={
                    isAuthenticated ? <Navigate to="/chat" /> : <LoginPage />
                }
            />

            {/* Ruta protegida del chat */}
            <Route
                path="/chat"
                element={
                    <ProtectedRoute>
                        <ChatPage />
                    </ProtectedRoute>
                }
            />

            {/* Ruta para cualquier otra dirección */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRouter;