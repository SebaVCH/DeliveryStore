import React,{SyntheticEvent} from 'react';
import { useOrdenes, useAceptarOrden} from '../hooks/useOrdenes';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuth } from '../context/AuthContext';
import PersistentDrawerLeft from "../components/Pestañas";
import {useActualizarEnvio, useEnviosRepartidor, useEnviosRepartidorEntregados} from "../hooks/useEnvios";
import TablaPaginacionGenerica from "../components/TablaPaginacion";
import {BotonVerde} from "../components/BotonVerde";

export const Repartidores = () => {
    const {token, setToken} = useAuth();
    const {data: ordenes, isLoading: isLoadingOrdenes} = useOrdenes();
    const {data: user, isLoading: cargauser, isError} = useUserProfile();
    const actualizarEnvio = useActualizarEnvio();
    const {data: envios, isLoading: isLoadingEnvios} = useEnviosRepartidor(user.PublicID);
    const {data: enviosEntregados, isLoading: isLoadingEntregados} = useEnviosRepartidorEntregados(user.PublicID);
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
            <PersistentDrawerLeft
                userType="repartidor"
                sections={{
                    ordenesDisponibles: (
                        <div>
                            <h1>Ordenes disponibles:</h1>
                            {isLoadingOrdenes ? (<p>Cargando ordenes disponibles...</p>)
                                : (
                                    <>
                                        <TablaPaginacionGenerica
                                            filas={ordenes || []}
                                            columnas={[
                                                { field: 'Date', headerName: 'Fecha', width: 200 },
                                                { field: 'Status', headerName: 'Estado', width: 200 },
                                                { field: 'Buyer_Address', headerName: 'Direccion del comprador', width: 200 },
                                                { field: 'Buyer_Phone', headerName: 'Telefono del comprador', width: 200 },
                                                { field: 'Seller_Name', headerName: 'Nombre del vendedor', width: 200 },
                                                { field: 'Seller_Address', headerName: 'Direccion del vendedor', width: 200 },
                                                {
                                                    field: 'accion',
                                                    headerName: 'Acción',
                                                    width: 150,
                                                    renderCell: (params) => (
                                                        <BotonVerde
                                                            onClick={() => aceptar(params.row)}
                                                            disabled={aceptarOrden.isPending}
                                                        >
                                                            {aceptarOrden.isPending ? "Procesando..." : "Aceptar orden"}
                                                        </BotonVerde>
                                                    ),
                                                },
                                            ]}
                                            cantidad={"all"}
                                        />
                                    </>
                                )}
                            </div>
                    ),misEnvios:(
                        <div>
                            <h1>Envios actuales: </h1>
                            {isLoadingEnvios? (
                                <p>Cargando los envios...</p>
                            ): (
                                <>
                                    <TablaPaginacionGenerica
                                        filas={envios || []}
                                        columnas={[
                                            { field: 'Delivery_Name', headerName: 'Repartidor', width: 200 },
                                            { field: 'Status', headerName: 'Estado', width: 200 },
                                            { field: 'Buyer_Address', headerName: 'Direccion del comprador', width: 200 },
                                            { field: 'Buyer_Phone', headerName: 'Telefono del comprador', width: 200 },
                                            {
                                                field: 'accion',
                                                headerName: 'Acción',
                                                width: 200,
                                                renderCell: (params) => (
                                                    <BotonVerde onClick={()=> actualizarEnvio.mutate(params.row.ID)}>Marcar como entregado</BotonVerde>
                                                ),
                                            },
                                        ]}
                                        cantidad={"all"}
                                    />
                                </>
                            )}

                            <h2>Envios entregados: </h2>
                            {isLoadingEntregados? (
                                <p>Cargando los envios...</p>
                            ): (
                                <>
                                    <TablaPaginacionGenerica
                                        filas={enviosEntregados || []}
                                        columnas={[
                                            { field: 'Delivery_Name', headerName: 'Repartidor', width: 200 },
                                            { field: 'Status', headerName: 'Estado', width: 200 },
                                            { field: 'Buyer_Address', headerName: 'Direccion del comprador', width: 200 },
                                            { field: 'Buyer_Phone', headerName: 'Telefono del comprador', width: 200 },
                                        ]}
                                        cantidad={"all"}
                                    />
                                </>
                            )}
                        </div>
                    )
                }}
            />

        </div>
    );
};