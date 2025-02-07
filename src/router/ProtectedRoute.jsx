import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { isTokenExpired } from '../lib/tokenUtils';

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, logout } = useAuth();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!isAuthenticated || !token || isTokenExpired(token)) {
            logout();
        }
    }, [isAuthenticated, token, logout]);

    if (!isAuthenticated || !token || isTokenExpired(token)) {
        return <Navigate to="/auth/login" replace />;
    }

    return children;
};