import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

export const PrivateRoute = () => {
    const isAuthenticated = localStorage.getItem('token');
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export const AdminPrivateRoute = () => {
    const localhost = localStorage.getItem('localhost');
    const [isAdmin, setIsAdmin] = useState(null); // State to track if the user is an admin
    const token = localStorage.getItem('token');

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/adminCheck`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setIsAdmin(response.data.message === 'yes');
            } catch (error) {
                setIsAdmin(false); // Set to false in case of an error
            }
        };

        if (token) {
            checkAdminStatus();
        } else {
            setIsAdmin(false);
        }
    }, [token]);

    // Return null while the admin status is being checked
    if (isAdmin === null) {
        return <div>Loading...</div>;
    }

    return isAdmin ? <Outlet /> : <Navigate to="/adminLogin" />;
};
