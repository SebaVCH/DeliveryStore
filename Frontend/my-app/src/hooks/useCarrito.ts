import {useQuery,useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';


export function useCarritos() {     //pa listar los carritos
    return useQuery({
        queryKey: ['carritos'],
        queryFn: async () => {
            const respuesta = await api.get('sistema/carrito/');
            return respuesta.data;
        },
    });
}

export function useProductosMasComprados(cantidad: string) {     //pa listar los 3 productos mas comprados
    return useQuery({
        queryKey: ['topProductos', cantidad],
        queryFn: async () => {
            const respuesta = await api.get('sistema/carrito/topProductos', {params: { quantity: cantidad }});
            return respuesta.data;
        },
    });
}