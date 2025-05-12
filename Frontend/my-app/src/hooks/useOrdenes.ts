import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';


interface nuevoEnvio {
    orden_id: number;
    repartidor_id: number;
    estado_envio: string;
    fecha_entrega: Date
};


export function useOrdenes() {  //listar Ordenes
    return useQuery({
        queryKey: ['ordenes'],
        queryFn: async () => {
            const respuesta = await api.get('/sistema/ordenes');
            return respuesta.data;
        },
    });
}

export function useAceptarOrden(){
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async ({orden_id, repartidor_id, estado_envio, fecha_entrega}:nuevoEnvio) => {
            const respuesta = await api.post('/sistema/envios',{orden_id,repartidor_id,estado_envio,fecha_entrega});
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['envios']});
        },
    });
}

 
