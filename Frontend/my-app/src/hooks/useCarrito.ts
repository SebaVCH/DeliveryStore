import {useQuery,useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

interface dataCarrito{
    BuyerID: number,
    IDProduct: number,
    Quantity: number
}

export function useCarritos() {     //pa listar los carritos
    return useQuery({
        queryKey: ['carritos'],
        queryFn: async () => {
            const respuesta = await api.get('sistema/carrito/');
            return respuesta.data;
        },
    });
}

export function useCrearCarrito() { //pa añadir una nueva cuenta en el sistema
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async ({BuyerID,IDProduct,Quantity}:dataCarrito) => {
            const respuesta = await api.post('sistema/carrito/',{BuyerID, IDProduct, Quantity});
            return respuesta.data;
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['carritos']});
        }
    });
}

export function useProductosMasComprados(cantidad: string) {     //pa listar los 3 productos mas comprados
    return useQuery({
        queryKey: ['topProductos', cantidad],
        queryFn: async () => {
            const respuesta = await api.get(`sistema/carrito/topProductos/${cantidad}`);
            return respuesta.data;
        },
    });
}