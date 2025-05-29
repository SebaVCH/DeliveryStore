import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

interface DataProducto{
    name: string;
    description: string;
    is_vegan: boolean;
    is_vegetarian: boolean;
    is_gluten_free: boolean;
    price: number;
    calories: number;
    review_score: number;
    seller_id:number;
    delivery:string;
}

export function useProductosVendedor(identificador: number) {     //pa listar solo los productos en venta del usuario.
    return useQuery({
        queryKey: ['productos', identificador],
        queryFn: async () => {
            const respuesta = await api.get('user/productos/',{params:{PublicID: identificador}});
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
        mutationFn: async ({name, description, is_vegan, is_vegetarian, is_gluten_free, price, calories, review_score, seller_id, delivery}: DataProducto) => {
            const respuesta = await api.post('user/productos/',{name, description, is_vegan, is_vegetarian, is_gluten_free, price, calories, review_score,seller_id,delivery});
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



