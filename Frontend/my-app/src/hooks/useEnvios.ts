import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

interface ActualizacionData{
    id: number
}

export function useEnvios() { //pa listar TODOS los envios 
    return useQuery({
        queryKey: ['envios'],
        queryFn: async () => {
            const respuesta = await api.get('/sistemas/envios/');
            return respuesta.data;
        },
    });
}

export function useEnviosRepartidor(id: number) {  //pa listar los envios del repartidor
    return useQuery({
        queryKey: ['reserva', id],
        queryFn: async () => {
            const respuesta = await api.get('/sistemas/envios/',{params:{PublicID: id}});
            return respuesta.data;
        }
    });
}

export function useActualizarEnvio() {
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async ({id}:ActualizacionData) =>
        {   //En backend actualizar estado a "entregado" y fecha a la fecha actual
            return await api.patch(`/sistemas/envios/actualizarEnvio/${id}`);
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['envios']});
        },
    });
    
}