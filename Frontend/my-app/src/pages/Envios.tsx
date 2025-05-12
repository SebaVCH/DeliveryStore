import React from 'react';
import {useEnvios,useActualizarEnvio} from '../hooks/useEnvios';
import { useNavigate } from 'react-router-dom';

export const Envios = () => {
    const {data:envios, isLoading} = useEnvios();
    const actualizarEnvio = useActualizarEnvio();
    const repartidor_id = 1;
    const navigate = useNavigate();

    const entregar = (envioId: number) => {
        actualizarEnvio.mutate({envio_id: envioId, nuevo_estado:'entregado'});
    };

    return (
        <div>
            <h1>Envios disponibles: </h1>
            <button onClick={() => navigate('/Home')}> volver al perfil</button>
            {isLoading? (
                <p>Cargando los envios...</p>
            ): (
            <>
                {envios?.length > 0 ? ( 
                    <ul>
                        {envios
                        .filter((envio: any) => envio.repartidor_id === repartidor_id)
                        .map((envio: any) => (
                        <li key = {envio.id}>
                            <p>orden: </p> {envio.orden_id} - <p>estado del envio: </p> {envio.estado_envio} - <p>fecha de entrega: </p> <strong>{new Date(envio.fecha_entrega).toLocaleString()}</strong>
                            {envio.estado_envio !== 'entregado' && (
                                <button onClick={()=> entregar(envio.id)}>producto entregado</button>
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
