import {useMutation} from '@tanstack/react-query';
import api from '../api/axios';
import { AxiosError } from 'axios';

interface Registerdata
{
    name: string;
    email: string;
    password: string;
    tipo: number;
    direccion: string;
    telefono: string;
}

interface Registerresponse
{
    message: string;
}

export function useRegister(onSuccess: () => void, onFail:(error:string)=>void) {
    return useMutation<Registerresponse,AxiosError,Registerdata>({
        mutationFn: async ({name, email, password, tipo, direccion, telefono}) => {
            const respuesta = await api.post('/register',{name, email, password, tipo, direccion, telefono});
            return respuesta.data;
        },
        onSuccess: () => {
            onSuccess();
        },
        onError:(error) => {
            const mensaje = (error.response?.data as {message?: string})?.message || 'error al registrar';
            onFail(mensaje);
        }
    })
}
