import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUserProfile } from "../hooks/useUserProfile";

interface PropRutaspriv {
    children: React.ReactNode;
    roles?: number[];
}

export const PrivateRoute = ({children, roles}: PropRutaspriv) => {
    const {token} = useAuth();
    const {data: user, isLoading} = useUserProfile();

    if(!token)
    {
        return <Navigate to = '/Login' replace/>;
    }
    
    if(user?.Banned)
    {
        sessionStorage.removeItem('token');
        return <Navigate to = '/Cuentaeliminada' replace />;
    }
    if(isLoading) {
        return <div>cargando datos del usuario...</div>
    }

    if(roles && (!user || !roles.includes(user.RoleType)))
    {
        return <Navigate to = '/Noautorizado' replace/>;      //redirecionar la page en caso de no autorizado 401 en front (hacer la page pa q el usuario tenga feedback)

    }

    

    return <>{children}</>;
}
