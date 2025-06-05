import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';
import { useUserProfile } from './useUserProfile';

interface DataProducto{
    Name: string;
    Description: string;
    IsVegan: boolean;
    IsVegetarian: boolean;
    IsGlutenFree: boolean;
    Price: number;
    Calories: number;
    SellerID: number;
    Delivery: string;
}

export function useProductosVendedor(identificador: number) {     //pa listar solo los productos en venta del usuario.
    return useQuery({
        queryKey: ['productos', identificador],
        queryFn: async () => {
            const respuesta = await api.get('/user/productos/',{params:{PublicID: identificador}});
            return respuesta.data;
        }
    });
}

export function useProductos() {     //pa listar los productos
    return useQuery({
        queryKey: ['productos'],
        queryFn: async () => {
            const respuesta = await api.get('/user/productos/');
            return respuesta.data;
        },
    });
}


export function useCrearProducto (){ //pa crear un producto
    const clienteQuery = useQueryClient();
    const {data: user} = useUserProfile(); 
    return useMutation({
        mutationFn: async ({Name, Description, IsVegan, IsVegetarian, IsGlutenFree, Price, Calories, SellerID, Delivery}: DataProducto) => {
            console.log(SellerID);
            if(SellerID === 0){
                SellerID = user.PublicID
                console.log(SellerID);
            }
            const respuesta = await api.post('/user/productos/',{Name, Description, IsVegan, IsVegetarian, IsGlutenFree, Price, Calories,SellerID,Delivery});
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
            await api.patch(`/user/productos/${id}`);
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['productos']});
        },
    });

}



