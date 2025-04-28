import { useMutation, useQuery, UseMutationOptions, UseQueryOptions, MutationFunction } from "@tanstack/react-query";

interface User {
    email: string;
    name: string;
}

interface Logindata {
    email: string;
    password: string;
}


interface Registerdata {
    name: string;
    email: string;
    password: string;
}

const api_url = 'http://localhost:8080';

const clienteFetch = async <T> (endpoint: string, options?: RequestInit): Promise<T> => {
    const respuesta = await fetch(`${api_url}${endpoint}`,options);

    if(!respuesta.ok)
    {
        const error = await respuesta.json().catch(() => ({
            message: 'error en la solicitud de los datos'
        }));
        throw new Error(error.message || 'error en la solicitud de los datos' );

    }

    return respuesta.json() as Promise<T>;
};



export const useLogin = (options?: Omit<UseMutationOptions < { token: string; user: User }, Error, Logindata>, 'mutationFn'>) => 
{
    return useMutation({
        mutationFn: async (data: Logindata) => {
            return clienteFetch < { token: string; user: User }>('/login',{
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify(data),
            });
        },
        ...options
    });
};


export const useRegister = (options?: Omit<UseMutationOptions< {message: string}, Error, Registerdata>, 'mutationFn'>) =>
{
    return useMutation({
        mutationFn: async (data: Registerdata) => {
            return clienteFetch < { message: string}>('/register',{
                method:'POST',
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify(data),
            });
        },
        ...options
    });
};



export const useUserProfile = (token: string | null, options?: Omit<UseQueryOptions<User, Error>, 'queryKey' | 'queryFn'>) => 
{
    return useQuery({
        queryKey: ['userProfile',token],
        queryFn: async () => {
            if (!token)
            {
                throw new Error('usuario no autenticado');
            }
            return clienteFetch<User>('/profile',{
                headers: {
                    'Authorization':`$(token)`,
                    'Content-Type':'application/json',
                },
            });
        },
        enabled: !!token,
        staleTime: 1000*60*5,
        retry:false,
        ...options 
    });
};

