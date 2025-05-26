import React,{SyntheticEvent} from 'react';
import { useOrdenes, useAceptarOrden} from '../hooks/useOrdenes';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuth } from '../context/AuthContext';

export const Repartidores = () => {
    const {data: ordenes, isLoading} = useOrdenes();
    const {data: user, isLoading: cargauser, isError} = useUserProfile();
    const {token, setToken} = useAuth();

    const aceptarOrden = useAceptarOrden();
    
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

    const aceptar = (orden: any) => {
        aceptarOrden.mutate({
            id_orden: orden.id, // ID de la orden a marcar como eliminada
            id_repartidor: user.identificador, // ID del repartidor actual
            estado: "en camino...",
            fecha: new Date(),
            id_comprador: orden.comprador.identificador
        });
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
                    {ordenes?.map((o: any) => (
                        <li key = {o.id}>
                            
                            <p>Fecha de entrega: </p> {o.fecha} - <p>Estado de la orden: </p> {o.estado} - <p>Dirección de entrega: </p> <strong>{o.comprador.direccion}</strong> - <p>Número del cliente: </p> {o.comprador.telefono}
                            <p>Tienda: </p> {o.vendedor.nombre} - <p>Dirección tienda: </p> {o.vendedor.direccion}

                            <button 
                                onClick={() => aceptar(o)}
                                disabled={aceptarOrden.isPending}
                            >
                                {aceptarOrden.isPending ? "Procesando..." : "Aceptar orden"} 
                            </button> 
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