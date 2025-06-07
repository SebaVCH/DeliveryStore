import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';
import { useUserProfile } from '../hooks/useUserProfile';

export function useUsuarios(cantidad: string){ //pa listar los usuarios registrados en el sistema
    return useQuery({
        queryKey:['usuariosTodos', cantidad],
        queryFn: async () => {
            const respuesta = await api.get(`/admin/users/${cantidad}`);
            return respuesta.data;
        }
    });
}

export function useCrearUsuario() { //pa añadir una nueva cuenta en el sistema
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (nuevoUsuario: {Name: string; Email: string; Password: string; RoleType: number; Address: string; Phone: string}) => {
            const respuesta = await api.post('/admin/users', nuevoUsuario);
            return respuesta.data;
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['usuariosTodos']});
        }
    });
}


export function useEliminarUsuario() { //pa eliminar la cuenta del sistema
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.patch(`/admin/users/${id}`); 
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['usuariosTodos']});
        },
    });
}

export function useAgregarSaldo() { //pa sumar plata al saldo
    const clienteQuery = useQueryClient();
    const {data: user} = useUserProfile();
    return useMutation({
        mutationFn: async (sumar:{id: number, monto: number}) => {
            if(sumar.id === 0){
                sumar.id = user.PublicID
            }
            await api.patch(`/admin/users/${sumar.id}`, {Amount: sumar.monto}); 
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['usuariosTodos']});
        },
    });
}