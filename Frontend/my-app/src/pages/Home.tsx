import React from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../context/AuthContext';

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
    <div> 
        <h2>Mis ventas</h2>
        <button onClick={()=> navigate('/Producto')}>Ir a los productos</button>
        <button onClick={()=> navigate('/AdminDashboard')}>Ir a Administracion</button>
        <button onClick={()=> navigate('/Repartidores')}>Ver repartidores</button>
        <button onClick={()=> navigate('/Homegeneral')}>Mis compras</button>
        <button onClick={logout}>Cerrar la sesion 🤑</button>
    </div>
    );
    
};

export default Home;