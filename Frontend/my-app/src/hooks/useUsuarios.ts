import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';


export function useUsuarios(){ //pa listar los usuarios registrados en el sistema
    return useQuery({
        queryKey:['usuarios'],
        queryFn: async () => {
            const respuesta = await api.get('/admin');
            return respuesta.data;
        },
    });
}

export function useCrearUsuario() { //pa añadir una nueva cuenta en el sistema
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (nuevoUsuario: {nombre: string; correo: string; password: string; tipo: number; direccion: string; telefono: string}) => {
            const respuesta = await api.post('/admin/usuarios', nuevoUsuario);
            return respuesta.data;
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['usuarios']});
        }
    });
}


export function useEliminarUsuario() { //pa eliminar la cuenta del sistema
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.patch(`/admin/usuarios/${id}`); //REEMPLAZAR POR PATCH PARA CAMBIAR EL BOOLEANO BANEADO
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['usuarios']});
        },
    });
}