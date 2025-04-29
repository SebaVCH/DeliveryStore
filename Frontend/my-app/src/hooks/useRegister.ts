import {useMutation} from '@tanstack/react-query';
import api from '../api/axios';
import { AxiosError } from 'axios';

interface Registerdata
{
    name: string;
    email: string;
    password: string;
}

interface Registerresponse
{
    message: string;
}

export function useRegister(onSuccess: () => void, onFail:(error:string)=>void) {
    return useMutation<Registerresponse,AxiosError,Registerdata>({
        mutationFn: async ({name, email, password}) => {
            const respuesta = await api.post('/register',{name, email, password});
            return respuesta.data;
        },
        onSuccess: () => {
            onSuccess();
        },
        onError:(error) => {
            const mensaje = (error.response?.data as {message?: string})?.message || 'no se pudo identificar el error xd';
            onFail(mensaje);
        }
    })
}
