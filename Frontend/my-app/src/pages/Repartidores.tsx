import React,{SyntheticEvent} from 'react';
import { useOrdenes, useAceptarOrden} from '../hooks/useOrdenes';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuth } from '../context/AuthContext';

export const Repartidores = () => {
    const {token, setToken} = useAuth();
    const {data: ordenes, isLoading} = useOrdenes();
    const {data: user, isLoading: cargauser, isError} = useUserProfile();

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
            ID: orden.ID, 
            DeliveryID: user.PublicID, 
            Status: "en camino...",
            Date: new Date(), //si se comparan fechas en backend, separar el día de la hora
            BuyerID: orden.BuyerID
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
                    {ordenes.map((o: any) => (
                        <li key = {o.ID}>
                            <p>Fecha de entrega: {o.Date} - Estado de la orden: {o.Status}</p>
                            <p>Dirección de entrega: <strong>{o.Buyer.Address}</strong> - Número del cliente: {o.Buyer.Phone}</p>
                            <p>Tienda: {o.Seller.Name} - Dirección tienda: {o.Seller.Address}</p>

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