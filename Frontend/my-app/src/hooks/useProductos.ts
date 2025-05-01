import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

export function useProductos() {     //pa listar los productos
    return useQuery({
        queryKey: ['productos'],
        queryFn: async () => {
            const respuesta = await api.get('user/productos');
            return respuesta.data;
        },
    });
}


export function useCrearProducto (){ //pa crear un producto
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (nuevoProducto: {name: string, price: number, description: string}) => {
            const respuesta = await api.post('user/productos',nuevoProducto);
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['productos']});
        },
    });
}


export function useEliminarProducto(){   //pa eliminar un producto
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`user/productos/${id}`);
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['productos']});
        },
    });

}



