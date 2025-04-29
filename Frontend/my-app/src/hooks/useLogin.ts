import {useMutation} from '@tanstack/react-query';
import api from '../api/axios';

interface Logindata {
    email: string;
    password: string;
}

export function useLogin(onSuccess: (token: string)=> void) {
    return useMutation({
        mutationFn: async ({email,password}: Logindata) => {
            const respuesta = await api.post('/login', {email,password});
            return respuesta.data;
        },
        onSuccess: (data) => {
            onSuccess(data.token);
        },
    });
}