import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

interface User
{
    Email: String;
    Name: String;
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
                        'Authorization': `${token}`, //falta el Bearer...
                        'Content-Type': 'application/json',
                        'Accept':'application/json'
                    }
                });

                const contenido = await respuesta.json();
                if (!respuesta.ok) {
                    throw new Error('error al obtener los datos');
                }

                if (contenido.user) {
                    setUser(contenido.user);
                    console.log(contenido.user);
                } else {

                    throw new Error('error en el formato de los datos xd');

                }
            } catch (error) {
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
        return (<div>Cargando...</div>)
    }

    if(error)
    {
        return (<div>Error</div>)
    }


    return (
        <div>
            {user ? 'Hola: ' + user.Name + ', Tu correo es: ' + user.Email : 'no estas logeado'}
        </div>
    );
};

export default Home;