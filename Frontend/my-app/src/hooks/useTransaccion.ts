import {useQuery,useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

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
        queryKey: ['calcularMontoTotal'],
        queryFn: async () => {
            const respuesta = await api.get('sistema/transacciones/calcularMontoTotal');
            return respuesta.data;
        },
    });
}

export function useTopVendedores() {     //listar los 3 vendedores que más venden
    return useQuery({
        queryKey: ['topVendedores'],
        queryFn: async () => {
            const respuesta = await api.get('sistema/transacciones/topVendedores');
            return respuesta.data;
        },
    });
}