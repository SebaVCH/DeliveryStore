import {useMutation} from '@tanstack/react-query';
import api from '../api/axios';
import { AxiosError } from 'axios';

interface Registerdata
{
    Name: string;
    Email: string;
    Password: string;
    RoleType: number;
    Address: string;
    Phone: string;
}

interface Registerresponse
{
    message: string;
}

export function useRegister(onSuccess: () => void, onFail:(error:string)=>void) {
    return useMutation<Registerresponse,AxiosError,Registerdata>({
        mutationFn: async ({Name, Email, Password, RoleType, Address, Phone}) => {
            const respuesta = await api.post('/register',{Name, Email, Password, RoleType, Address, Phone});
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
