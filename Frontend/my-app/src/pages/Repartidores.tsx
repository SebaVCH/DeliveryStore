import React,{SyntheticEvent, useState} from 'react';
import { useOrdenes, useAceptarOrden, useActualizarEnvio} from '../hooks/useOrdenes';

export const Ordenes = () => {
    const {data: ordenes, isLoading} = useOrdenes();
    const aceptarOrden = useAceptarOrden();

    const [idEnvio, setIdEnvio] = useState('');
    const [idRepartidor, setIdRepartidor] = useState('');
    const [estadoEnvio, setEstado] = useState('');
    const [fechaEntrega, setFechaEntrega] = useState('');

    const crear = (e:SyntheticEvent) => {
            e.preventDefault();
            aceptarOrden.mutate({orden_id: Number(idEnvio), repartidor_id: Number(idRepartidor), estado_envio: estadoEnvio, fecha_entrega: new Date(Date.parse(fechaEntrega))});
            setIdEnvio('');
            setIdRepartidor('');
            setEstado('');
            setFechaEntrega('');
        };

    return (
        <div>
        <h1>Ordenes disponibles:</h1>
        {isLoading ? (<p>Cargando ordenes disponibles...</p>)
        : (
            <>
            {ordenes?.length > 0 ? (
                <ul>
                    {ordenes?.map((p: any) => (
                        <li key = {p.id}>
                            {setIdEnvio(p.orden_id)}
                            {setIdRepartidor(p.repartidor_id)}
                            {setEstado('En camino...')}
                            {setFechaEntrega(p.fecha_entrega)}
                            <p>Fecha de entrega: </p> {p.fecha} - <p>Estado de la orden: </p> {p.estado} - <p>Dirección de entrega: </p> <strong>{p.direccion}</strong> - <p>Número del cliente: </p> {p.telefono}
                            <p>Tienda: </p> {p.nombreTienda} - <p>Dirección tienda: </p> {p.direccionTienda}

                            <button onClick={() => crear}> Aceptar</button> 
                        </li>
                    ))}
                </ul>
            ) : (<p> No hay Ordenes disponibles...</p>)
            }
            </>
            )
        }

        </div>
    );
};