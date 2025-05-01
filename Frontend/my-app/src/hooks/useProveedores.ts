import {useQuery,useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

export function useProveedores() {      //pa listar los proveedores
    return useQuery({
        queryKey:['proveedores'],
        queryFn: async () => {
            const respuesta = await api.get('/proveedores');
            return respuesta.data;
        },
    });
}

export function useCrearProveedor() {   //pa añadir un nuevo proveedor
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async(nuevoProveedor:{name:string, description: string}) => {
            const respuesta = await api.post('/proveedores', nuevoProveedor);
            return respuesta.data;
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['proveedores']});
        },
    });
}

export function useEliminarProveedor() {
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/proveedores/${id}`);
        },
        onSuccess:() => {
            clienteQuery.invalidateQueries({queryKey:['proveedores']});
        },
    });
}

