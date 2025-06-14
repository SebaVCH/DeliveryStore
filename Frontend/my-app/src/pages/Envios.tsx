import React from 'react';
import {useEnviosRepartidor,useEnviosRepartidorEntregados,useActualizarEnvio} from '../hooks/useEnvios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';

export const Envios = () => {
    const {token, setToken} = useAuth();
    const {data: user, isLoading: cargauser, isError} = useUserProfile();
    const {data: envios, isLoading} = useEnviosRepartidor(user.PublicID);
    const {data: enviosEntregados, isLoading: CargaEntregados} = useEnviosRepartidorEntregados(user.PublicID);
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
            <h1>Envios actuales: </h1>
            <button onClick={() => navigate('/Homegeneral')}>Volver al perfil</button>
            {isLoading? (
                <p>Cargando los envios...</p>
            ): (
            <>
                {envios?.length > 0 ? ( 
                    <ul>
                        {envios.map((envio: any) => (
                        <li key = {envio.ID}>
                            <p>Repartidor: </p> {envio.Delivery.Name} - <p>Estado del envio: </p> {envio.Status} - <p>Dirección de entrega: </p> {envio.Buyer.Address} - <p>Teléfono del cliente: </p> {envio.Buyer.Phone}
                            {console.log(envio.ID)}
                            {envio.Status !== 'entregado' && (
                                <button onClick={()=> actualizarEnvio.mutate(envio.ID)}>producto entregado</button>
                            )}
                        </li>
                    ))}
                    </ul>
                ) : (<p>No hay envios disponibles.</p>)
                }
            </>
            )}
            
            <h2>Envios entregados: </h2>
            {CargaEntregados? (
                <p>Cargando los envios...</p>
            ): (
            <>
                {enviosEntregados?.length > 0 ? ( 
                    <ul>
                        {enviosEntregados.map((e: any) => (
                        <li key = {e.ID}>
                            <p>Repartidor: </p> {e.Delivery.Name} - <p>Estado del envio: </p> {e.Status} - <p>Dirección de entrega: </p> {e.Buyer.Address} - <p>Teléfono del cliente: </p> {e.Buyer.Phone}
                        </li>
                    ))}
                    </ul>
                ) : (<p>No hay envios entregados.</p>)
                }
            </>
            )}
        </div>
    )
}
