import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

interface User
{
    email: String;
    name: String;
}


export const Home = () => {
    const [user, setUser] = useState<User|null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchdata = async () => {
            const token = localStorage.getItem('token');
            if(!token) {
                navigate('/login');
                return;
            }

            try {
                const respuesta = await fetch('http://localhost:8080/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept':'application/json'
                    }
                });

                const contenido = await respuesta.json();
                if (!respuesta.ok) {
                    throw new Error('error al obtener los datos reqls');
                }

                if (contenido.user) {
                    setUser(contenido.user);
                } else {
                    throw new Error('error en el formato de los datos xd');
                }
            } catch (err) {
                setError('error al cargar datos del usuario');
                console.error('error en el fetch:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');

            } finally {
                setLoading(false);
            }
        };

        fetchdata();
    }, [error, navigate]);

    if(loading)
    {
        return (<div>Cargando la wea...</div>)
    }

    if(error)
    {
        return (<div>Error CTM</div>)
    }


    return (
        <div>
            {user ? 'Hola' + user.name + ':' + user.email : 'no estas logeado'}
        </div>
    );
};

export default Home;