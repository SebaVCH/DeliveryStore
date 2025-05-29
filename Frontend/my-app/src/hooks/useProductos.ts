import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

interface DataProducto{
    nombre: string;
    descripcion: string;
    precio: number;
    vegano: boolean;
    vegetariano: boolean;
    posee_gluten: boolean;
    calorias: number;
    entrega: string;
    id_vendedor: number;
}

export function useProductosVendedor(identificador: number) {     //pa listar solo los productos en venta del usuario.
    return useQuery({
        queryKey: ['productos', identificador],
        queryFn: async () => {
            const respuesta = await api.get('user/productos/',{params:{id_vendedor: identificador}});
            return respuesta.data;
        }
    });
}

export function useProductos() {     //pa listar los productos
    return useQuery({
        queryKey: ['productos'],
        queryFn: async () => {
            const respuesta = await api.get('user/productos/');
            return respuesta.data;
        },
    });
}


export function useCrearProducto (){ //pa crear un producto
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async ({nombre, descripcion, precio, vegano, vegetariano, posee_gluten, calorias, entrega, id_vendedor}: DataProducto) => {
            const respuesta = await api.post('user/productos/',{nombre, descripcion, precio, vegano, vegetariano, posee_gluten, calorias, entrega, id_vendedor});
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
        mutationFn: async (id: number) => {
            await api.patch(`user/productos/${id}`);
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['productos']});
        },
    });

}



