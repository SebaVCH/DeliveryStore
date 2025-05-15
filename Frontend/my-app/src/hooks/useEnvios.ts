import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

export function useEnvios() {
    return useQuery({
        queryKey: ['envios'],
        queryFn: async () => {
            const respuesta = await api.get('/sistemas/envios/');
            return respuesta.data;
        },
    });
}

export function useActualizarEnvio() {
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async ({envio_id, nuevo_estado}:{envio_id:number; nuevo_estado:string}) =>
        {
            return await api.put(`/sistemas/envios/${envio_id}`, {estado_envio: nuevo_estado});
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['envios']});
        },
    });
    
}