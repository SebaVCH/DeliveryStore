import {useMutation} from '@tanstack/react-query';
import api from '../api/axios';
import { AxiosError } from 'axios';

interface Logindata {
    email: string;
    password: string;
}

interface Loginresponse {
    token: string;
    user: {
        Email: string;
        Name: string;
    };
}

export function useLogin(onSuccess: (token: string)=> void, onFail:(error:string)=> void) {
    return useMutation<Loginresponse,AxiosError,Logindata>({
        mutationFn: async ({email,password}: Logindata): Promise<Loginresponse> => {
            const respuesta = await api.post('/login', {email,password});
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