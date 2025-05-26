import React from 'react';
import {useEnviosRepartidor,useActualizarEnvio} from '../hooks/useEnvios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';

export const Envios = () => {
    const {token, setToken} = useAuth();
    const {data: user, isLoading: cargauser, isError} = useUserProfile();
    const {data: envios, isLoading} = useEnviosRepartidor(user.identificador);
    const actualizarEnvio = useActualizarEnvio();
    const navigate = useNavigate();

    if(!token)
    {
        navigate('/Login');
        return null;
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
            <h1>Envios disponibles: </h1>
            <button onClick={() => navigate('/Home')}>Volver al perfil de ventas</button>
            {isLoading? (
                <p>Cargando los envios...</p>
            ): (
            <>
                {envios?.length > 0 ? ( 
                    <ul>
                        {envios.map((envio: any) => (
                        <li key = {envio.id}>
                            <p>Repartidor: </p> {user.nombre} - <p>Estado del envio: </p> {envio.estado} - <p>Dirección de entrega: </p> {envio.comprador.direccion} - <p>Teléfono del cliente: </p> {envio.comprador.telefono}
                            {envio.estado !== 'entregado' && (
                                <button onClick={()=> actualizarEnvio.mutate(envio.id)}>producto entregado</button>
                            )}
                        </li>
                    ))}
                    </ul>
                ) : (<p>No hay envios aun...</p>)
                }
            </>
            )}
        </div>
    )
}
