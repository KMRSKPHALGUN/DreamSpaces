import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoute = () => {
    const isAuthenticated = localStorage.getItem('token');
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export const AdminPrivateRoute = () => {
    const isAuthenticated = localStorage.getItem('token');
    return isAuthenticated ? <Outlet /> : <Navigate to="/adminLogin" />;
};