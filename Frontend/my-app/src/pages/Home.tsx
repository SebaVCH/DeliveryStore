import React, { useEffect, useState } from 'react';

export const Home = () => {
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchdata = async () => {
            const api_url = 'http://localhost:8080/users';
            try {
                const respuesta = await fetch(api_url, {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                const contenido = await respuesta.json();
                setName(contenido.name);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchdata();
    }, []);

    return (
        <div>
            {name ? 'Hola' + name : 'no estas logeado'}
        </div>
    );
};

export default Home;