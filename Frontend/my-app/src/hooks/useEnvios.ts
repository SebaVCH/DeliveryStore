import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';
import { useUserProfile } from './useUserProfile';


export function useEnvios() { //pa listar TODOS los envios PENDIENTES.
    return useQuery({
        queryKey: ['envios'],
        queryFn: async () => {
            const respuesta = await api.get('/sistema/envios/');
            return respuesta.data;
        },
    });
}

export function useEnviosEntregados() { //pa listar TODOS los envios ENTREGADOS
    return useQuery({
        queryKey: ['envios'],
        queryFn: async () => {
            const respuesta = await api.get('/sistema/envios/entregados');
            return respuesta.data;
        },
    });
}

export function useEnviosRepartidor(identificador: number) {  //pa listar los envios vigentes del repartidor
    const {data: user} = useUserProfile();
    return useQuery({
        queryKey: ['reserva', identificador],
        queryFn: async () => {
            console.log(identificador);
            if(identificador === 0){
                identificador = user.PublicID
                console.log(identificador);
            }
            const respuesta = await api.get(`/sistema/envios/${identificador}`);
            return respuesta.data;
        }
    });
}

export function useEnviosRepartidorEntregados(identificador: number) {  //pa listar los envios entregados del repartidor.
    const {data: user} = useUserProfile();
    return useQuery({
        queryKey: ['reserva', identificador],
        queryFn: async () => {
            console.log(identificador);
            if(identificador === 0){
                identificador = user.PublicID
                console.log(identificador);
            }
            const respuesta = await api.get(`/sistema/envios/entregados/${identificador}`);
            return respuesta.data;
        }
    });
}

export function useActualizarEnvio() {
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (ID: number) =>
        {   //En backend actualizar estado a "entregado" y fecha a la fecha actual
            return await api.patch(`/sistema/envios/actualizarEnvio/${ID}`);
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['envios']});
        },
    });
    
}