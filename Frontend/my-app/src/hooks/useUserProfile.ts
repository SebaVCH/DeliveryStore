import {useQuery} from '@tanstack/react-query';
import api from '../api/axios';


export function useUserProfile(){
    return useQuery({
        queryKey:['user'],
        queryFn: async () => {
            const respuesta = await api.get('/profile');
            return respuesta.data.user;
        },
    });
}