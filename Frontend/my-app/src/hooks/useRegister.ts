import {useMutation} from '@tanstack/react-query';
import api from '../api/axios';
import { AxiosError } from 'axios';

interface Registerdata
{
    nombre: string;
    correo: string;
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
        mutationFn: async ({nombre, correo, password, tipo, direccion, telefono}) => {
            const respuesta = await api.post('/register',{nombre, correo, password, tipo, direccion, telefono});
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
