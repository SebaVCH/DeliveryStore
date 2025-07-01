import React from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css'


export const Home = () => {
    const {token, setToken} = useAuth();
    const navigate = useNavigate();
    const {isLoading: cargauser, isError} = useUserProfile();
    

    if(!token)
    {
        navigate('/Login');
        return null;
    }
    
    const logout = () => {
        setToken(null);
        sessionStorage.removeItem('token');
        navigate('/Login');
    }


    if(cargauser)
    {
        return <div> Cargando... </div>;
    }
    
    if(isError)
    {
        setToken(null);
        navigate('/Login');
        return null;
    }

    return (
    <div className="home-container">
        <h2 className="home-title">Mis Ventas</h2>
        <div className="home-buttons">
            <button onClick={() => navigate('/Producto')}>Productos</button>
            <button onClick={() => navigate('/Proveedores')}>Proveedores</button>
            <button onClick={() => navigate('/Homegeneral')}>Comprar</button>
            <button onClick={logout} className="logout">Cerrar sesión 🤑</button>
        </div>
    </div>
    );
    
};

export default Home;