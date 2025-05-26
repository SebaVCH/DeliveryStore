import {useMutation} from '@tanstack/react-query';
import api from '../api/axios';
import { AxiosError } from 'axios';

interface Logindata {
    correo: string;
    password: string;
}

interface Loginresponse {
    token: string;
    user: {
        Correo: string;
        Nombre: string;
    };
}

export function useLogin(onSuccess: (token: string)=> void, onFail:(error:string)=> void) {
    return useMutation<Loginresponse,AxiosError,Logindata>({
        mutationFn: async ({correo,password}: Logindata): Promise<Loginresponse> => {
            const respuesta = await api.post('/login', {correo,password});
            console.log(respuesta.data);
            return respuesta.data;
        },
        onSuccess: (data) => {
            onSuccess(data.token);
        },
        onError:(error) => {
            const mensaje = (error.response?.data as {message?: string})?.message || 'no se pudo identificar el error xd';
            onFail(mensaje);
        }

    });
}