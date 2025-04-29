import React from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export const Home = () => {
    const {token, setToken} = useAuth();
    const navigate = useNavigate();
    const { data: user, isLoading, isError} = useUserProfile();

    if(!token)
    {
        navigate('/Login');
        return null;
    }
    
    if(isLoading)
    {
        return <div> Cargando... </div>;
    }
    
    if(isError)
    {
        setToken(null);
        navigate('/login');
        return null;
    }

    return <div> Bienvenido {user?.name}, tu correo es {user?.email}</div>
    
};

export default Home;