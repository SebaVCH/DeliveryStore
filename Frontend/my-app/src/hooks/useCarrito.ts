import {useQuery,useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';
import { useUserProfile } from './useUserProfile';
import { AxiosError } from 'axios';


interface ApiError {
  message: string;
 
}

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

export function useCarritosComprador(identificador: number) {  //pa listar los carritos sin pagar.
    const {data: user} = useUserProfile();
    return useQuery({
        queryKey: ['carritosSinPagar',identificador],
        queryFn: async () => {
            if(identificador === 0){
                identificador = user.PublicID
            }
            const respuesta = await api.get(`/sistema/carrito/misCompras/${identificador}`);
            console.log(respuesta.data);
            return respuesta.data;
        }
    });
}

export function usePagarCarritos() {
    const clienteQuery = useQueryClient();
    const {data: user} = useUserProfile();

    return useMutation({
        mutationFn: async (userId: number) => {
            if(userId === 0){
                userId = user.PublicID
            }
            const respuesta = await api.post(`/sistema/carrito/pagar/${userId}`);
            return respuesta.data;
        },
        onSuccess: () => {
            
            clienteQuery.invalidateQueries({ queryKey: ['carritosSinPagar'] });
            clienteQuery.invalidateQueries({ queryKey: ['precioFinal'] });
        },
        onError: (error: AxiosError<ApiError>) => {
            throw new Error(error.response?.data?.message || 'Error al procesar el pago');
        }
    });
}

export function usePrecioFinal(identificador: number) {  //pa mostrar el monto total en los carritos sin pagar.
    const {data: user} = useUserProfile();
    return useQuery({
        queryKey: ['precioFinal',identificador],
        queryFn: async () => {
            if(identificador === 0){
                identificador = user.PublicID
                console.log(identificador);
            }
            const respuesta = await api.get(`/sistema/carrito/misCompras/id/calcularMontoFinal/${identificador}`);
            return respuesta.data;
        }
    });
}

export function useCrearCarrito() { //pa crear un carrito nuevo
    const clienteQuery = useQueryClient();
    const {data: user} = useUserProfile();
    return useMutation({
        mutationFn: async ({BuyerID,IDProduct,Quantity}:dataCarrito) => {
            if(BuyerID === 0){
                BuyerID = user.PublicID
                console.log(BuyerID);
            }
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