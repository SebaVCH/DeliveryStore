import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

export function useOrdenes() {  //listar Ordenes
    return useQuery({
        queryKey: ['ordenes'],
        queryFn: async () => {
            const respuesta = await api.get('sistema/ordenes');
            return respuesta.data;
        },
    });
}

export function useAceptarOrden(){
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (nuevoEnvio: {orden_id: number, repartidor_id: number, estado_envio: string, fecha_entrega: Date}) => {
            const respuesta = await api.post('sistema/envios',nuevoEnvio);
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['envios']});
        },
    });
}

export function useActualizarEnvio(){
    


}   
