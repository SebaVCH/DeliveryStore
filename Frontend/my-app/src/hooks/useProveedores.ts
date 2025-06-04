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
            const respuesta = await api.get('/proveedores/',{params:{PublicID: identificador}});
            return respuesta.data;
        }
    });
}

export function useCrearProveedor() {   //pa añadir un nuevo proveedor
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async(nuevoProveedor:{Name: string, Description: string, SellerID: Number}) => {
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
            await api.patch(`/proveedores/${id}`);
        },
        onSuccess:() => {
            clienteQuery.invalidateQueries({queryKey:['proveedores']});
        }
    });
}

export function useCrearProductoProveedor() {   //pa añadir una relación nueva entre producto y proveedor.
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async(nuevaRelacion:{ID: number, ProductID: number}) => {
            const respuesta = await api.post('/proveedores/', nuevaRelacion);
            return respuesta.data;
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['proveedores']});
        }
    });
}

export function useProductoProveedor(identificador: number) {   //pa listar solo los productos de ese proveedor.
    return useQuery({
        queryKey: ['proveedores', identificador],
        queryFn: async () => {
            const respuesta = await api.get('/proveedores/productos',{params:{ID: identificador}});
            return respuesta.data;
        }
    });
}