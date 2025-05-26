import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';


interface nuevoEnvio {
    
    id_repartidor: number;
    estado: string;
    fecha: Date;
    id_comprador: number;
};


export function useOrdenes() {  //listar Ordenes
    return useQuery({
        queryKey: ['ordenes'],
        queryFn: async () => {
            const respuesta = await api.get('/sistema/ordenes/');
            return respuesta.data;
        },
    });
}

export function useAceptarOrden() {
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async ({id_orden, id_repartidor, estado, fecha, id_comprador}: 
        {id_orden: number} & nuevoEnvio) => {
            //pa crear el envio
            await api.post('/sistema/envios/', {
                id_repartidor, 
                estado, 
                fecha, 
                id_comprador
            });
            //pa setear la orden como eliminada
            await api.patch(`/sistema/ordenes/${id_orden}`);
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey: ['envios']});
            clienteQuery.invalidateQueries({queryKey: ['ordenes']});
        },
    });
}

 
