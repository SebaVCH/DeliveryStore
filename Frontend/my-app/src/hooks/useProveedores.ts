import {useQuery,useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

export function useProveedores() {      //pa listar los proveedores
    return useQuery({
        queryKey:['proveedores'],
        queryFn: async () => {
            const respuesta = await api.get('/proveedores/');
            return respuesta.data;
        },
    });
}

export function useProveedoresVendedor(identificador: number) {     //pa listar solo los proveedores del usuario.
    return useQuery({
        queryKey: ['proveedores', identificador],
        queryFn: async () => {
            const respuesta = await api.get('user/proveedores/',{params:{id_vendedor: identificador}});
            return respuesta.data;
        }
    });
}

export function useCrearProveedor() {   //pa añadir un nuevo proveedor
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async(nuevoProveedor:{nombre: string, descripcion: string}) => {
            const respuesta = await api.post('/proveedores/', nuevoProveedor);
            return respuesta.data;
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['proveedores']});
        }
    });
}

export function useEliminarProveedor() {
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/proveedores/${id}`);
        },
        onSuccess:() => {
            clienteQuery.invalidateQueries({queryKey:['proveedores']});
        }
    });
}

