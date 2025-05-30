import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';


export function useEnvios() { //pa listar TODOS los envios 
    return useQuery({
        queryKey: ['envios'],
        queryFn: async () => {
            const respuesta = await api.get('/sistema/envios/');
            return respuesta.data;
        },
    });
}

export function useEnviosRepartidor(identificador: number) {  //pa listar los envios del repartidor
    return useQuery({
        queryKey: ['reserva', identificador],
        queryFn: async () => {
            const respuesta = await api.get('/sistema/envios/',{params:{PublicID: identificador}});
            return respuesta.data;
        }
    });
}

export function useActualizarEnvio() {
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (ID: number) =>
        {   //En backend actualizar estado a "entregado" y fecha a la fecha actual
            return await api.patch(`/sistema/envios/actualizarEnvio/${ID}`);
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['envios']});
        },
    });
    
}