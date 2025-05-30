import React from 'react';
import {useEnviosRepartidor,useActualizarEnvio} from '../hooks/useEnvios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';

export const Envios = () => {
    const {token, setToken} = useAuth();
    const {data: user, isLoading: cargauser, isError} = useUserProfile();
    const {data: envios, isLoading} = useEnviosRepartidor(user.PublicID);
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
            <button onClick={() => navigate('/Homegeneral')}>Volver al perfil</button>
            {isLoading? (
                <p>Cargando los envios...</p>
            ): (
            <>
                {envios?.length > 0 ? ( 
                    <ul>
                        {envios.map((envio: any) => (
                        <li key = {envio.ID}>
                            <p>Repartidor: </p> {user.Name} - <p>Estado del envio: </p> {envio.Status} - <p>Dirección de entrega: </p> {envio.Buyer.Address} - <p>Teléfono del cliente: </p> {envio.Buyer.Phone}
                            {console.log(envio.ID)}
                            {envio.Status !== 'entregado' && (
                                <button onClick={()=> actualizarEnvio.mutate(envio.ID)}>producto entregado</button>
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
