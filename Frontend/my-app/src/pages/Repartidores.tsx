import React,{SyntheticEvent} from 'react';
import { useOrdenes, useAceptarOrden} from '../hooks/useOrdenes';
import { useNavigate } from 'react-router-dom';

export const Repartidores = () => {
    const {data: ordenes, isLoading} = useOrdenes();
    const aceptarOrden = useAceptarOrden();
    const repartidor_id = 1; //cambiar esto pal caso de que venga incluido en el back como parte de usuario o parte del json que devuelve el endpoint de ordenes (sapear eso) 
    const navigate = useNavigate();
    

    const crear = (e:SyntheticEvent) => {
            e.preventDefault();
            aceptarOrden.mutate(
                {
                    orden_id: ordenes.id, 
                    repartidor_id: repartidor_id , 
                    estado_envio: 'En camino...', 
                    fecha_entrega: new Date(Date.parse(ordenes.fecha_entrega))
                },
                {
                    onSuccess:() => {
                        navigate('/Envios');
                    },
                }
            );
        };

    return (
        <div>
        <h1>Ordenes disponibles:</h1>
        <button onClick={() => navigate('/Envios')}>Mis envios</button>
        {isLoading ? (<p>Cargando ordenes disponibles...</p>)
        : (
            <>
            {ordenes?.length > 0 ? (
                <ul>
                    {ordenes?.map((p: any) => (
                        <li key = {p.id}>
                            
                            <p>Fecha de entrega: </p> {p.fecha} - <p>Estado de la orden: </p> {p.estado} - <p>Dirección de entrega: </p> <strong>{p.direccion}</strong> - <p>Número del cliente: </p> {p.telefono}
                            <p>Tienda: </p> {p.nombreTienda} - <p>Dirección tienda: </p> {p.direccionTienda}

                            <button onClick={() => crear(p)}> Aceptar orden</button> 
                        </li>
                    ))}
                </ul>
            ) : (<p> No hay Ordenes disponibles...</p>)
            }
            </>
            )}
        </div>
    );
};