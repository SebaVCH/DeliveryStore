import {useQuery,useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';
import { useUserProfile } from './useUserProfile';

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
    const {data: user} = useUserProfile();
    return useQuery({
        queryKey: ['proveedores', identificador],
        queryFn: async () => {
            console.log(identificador);
            if(identificador === 0){
                identificador = user.PublicID
                console.log(identificador);
            }
            const respuesta = await api.get(`/proveedores/${identificador}`);
            console.log(respuesta.data)
            return respuesta.data;
        }
    });
}

export function useCrearProveedor() {   //pa añadir un nuevo proveedor
    const clienteQuery = useQueryClient();
    const {data: user} = useUserProfile();
    return useMutation({
        mutationFn: async(nuevoProveedor:{Name: string, Description: string, SellerID: Number}) => {
            console.log(nuevoProveedor.SellerID);
            if(nuevoProveedor.SellerID === 0){
                nuevoProveedor.SellerID = user.PublicID
                console.log(nuevoProveedor.SellerID);
            }
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
            const respuesta = await api.post('/proveedores/productos', nuevaRelacion);
            return respuesta.data;
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['proveedores/productos']});
        }
    });
}

export function useProductoProveedor(identificador: number) {   //pa listar solo los productos de ese proveedor.
    
    return useQuery({
        queryKey: ['proveedores', identificador],
        queryFn: async () => {
            console.log(identificador);
            const respuesta = await api.get(`/proveedores/productos${identificador}`);
            console.log(identificador);
            return respuesta.data;
        }
    });
}