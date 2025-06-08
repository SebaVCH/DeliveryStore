import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';
import { useUserProfile } from './useUserProfile';


interface nuevoEnvio {

    Status: string;
    Date: Date;
    DeliveryID: number;
    BuyerID: number;

};


export function useOrdenes() {  //listar Ordenes pendientes.
    return useQuery({
        queryKey: ['ordenesPendientes'],
        queryFn: async () => {
            const respuesta = await api.get('/sistema/ordenes/');
            return respuesta.data;
        },
    });
}

export function useOrdenesAdmin() {  //listar todas las ordenes entregadas.
    return useQuery({
        queryKey: ['ordenesEntregadas'],
        queryFn: async () => {
            const respuesta = await api.get('/sistema/ordenes/todo');
            return respuesta.data;
        },
    });
}

export function useAceptarOrden() {
    const clienteQuery = useQueryClient();
    const {data: user} = useUserProfile();
    return useMutation({
        mutationFn: async ({ID, Status, Date, DeliveryID, BuyerID}: 
        {ID: number} & nuevoEnvio) => {
            console.log(DeliveryID);
            if(DeliveryID === 0){
                DeliveryID = user.PublicID
                console.log(DeliveryID);
            }
            //pa crear el envio
            await api.post('/sistema/envios/', {
                Status, 
                Date, 
                DeliveryID, 
                BuyerID
                
            });
            console.log(DeliveryID);
            //pa setear la orden como eliminada
            await api.patch(`/sistema/ordenes/${ID}`);  
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey: ['envios']});
            clienteQuery.invalidateQueries({queryKey: ['ordenes']});
        },
    });
}

 
