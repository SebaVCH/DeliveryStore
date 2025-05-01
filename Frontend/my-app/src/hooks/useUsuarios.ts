import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

export function useUsuarios(){ //pa listar los usuarios registrados en el sistema
    return useQuery({
        queryKey:['usuarios'],
        queryFn: async () => {
            const respuesta = await api.get('/admin/users');
            return respuesta.data;
        },
    });
}

export function useCrearUsuario() { //pa añadir una nueva cuenta en el sistema
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (nuevoUsuario: {name: string; email: string; password: string}) => {
            const respuesta = await api.post('/admin/users', nuevoUsuario);
            return respuesta.data;
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['usuarios']});
        },
    });
}


export function useEliminarUsuario() { //pa eliminar la cuenta del sistema
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/admin/users/${id}`);
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['usuarios']});
        },
    });
}