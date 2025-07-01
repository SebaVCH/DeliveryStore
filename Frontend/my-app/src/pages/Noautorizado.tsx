import React from 'react';
//import { useNavigate } from 'react-router-dom';
import '../styles/Noauth.css'



export const Noautorizado = () => {
    return (
    <div className="unauthorized-container">
        <h1>🚫 Acceso Denegado</h1>
        <p>No tienes permiso para ver esta página</p>
    </div>
    );
};