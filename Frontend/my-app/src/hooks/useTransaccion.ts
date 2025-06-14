import {useQuery,useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';
import { useUserProfile } from './useUserProfile';

export function useTransacciones() {     //pa listar las transacciones
    return useQuery({
        queryKey: ['transacciones'],
        queryFn: async () => {
            const respuesta = await api.get('sistema/transacciones/');
            return respuesta.data;
        },
    });
}

export function useMontoTotal() {     //mostrar dinero total transferido en el sistema
    return useQuery({
        queryKey: ['montoTotal'],
        queryFn: async () => {
            const respuesta = await api.get('sistema/transacciones/calcularMontoTotal');
            return respuesta.data;
        },
    });
}

export function useTopVendedores(cantidad: string) {     //listar los 3 vendedores que más venden
    return useQuery({
        queryKey: ['topVendedores', cantidad],
        queryFn: async () => {
            if (!cantidad) {
                return [];
            }
            const respuesta = await api.get(`sistema/transacciones/topVendedores/${cantidad}`);
            return respuesta.data;
        },
    });
}

export function useCrearTransaccion() {
    const clienteQuery = useQueryClient();
    const {data: user} = useUserProfile();

    return useMutation({
        mutationFn: async (transaccion:{BuyerID: number, ProductID: number, Amount: number, SellerID: number}) => {
            if(transaccion.BuyerID === 0){
                transaccion.BuyerID = user.PublicID
            }
            const response = await api.post('/sistema/transacciones/',transaccion);
            return response.data;
        },
        onSuccess: () => {
            
        },
        onError: (error: any) => {
            throw new Error(error.response?.data?.message || 'Error al procesar el pago');
        }
    });
}