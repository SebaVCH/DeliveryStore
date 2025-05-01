import React, {SyntheticEvent,useState} from 'react';
import { useUsuarios, useCrearUsuario, useEliminarUsuario} from '../hooks/useUsuarios';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard = () => {
    const {data: usuarios, isLoading} = useUsuarios();
    const crearUsuario = useCrearUsuario();
    const eliminarUsuario = useEliminarUsuario();
    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');

    const crear = (e:SyntheticEvent) => {
        e.preventDefault();
        crearUsuario.mutate({name: nombre, email: correo, password: password});
        setNombre('');
        setCorreo('');
        setPassword('');
    };

    return (
        <div>
            <h1>Administracion de Usuarios</h1>
            <button onClick={() => navigate('/Home')}> volver al perfil</button>
            {isLoading? (
                <p>Cargando los usuarios...</p>
            ): (
            <>
                <h2> Usuarios Registrados </h2>
                {usuarios?.length > 0 ? ( 
                    <ul>
                        {usuarios?.map((u:any) => (
                            <li key={u._id}>
                                {u.name} - {u.email}
                                <button onClick={()=> eliminarUsuario.mutate(u._id)}>Eliminar</button>
                            </li>
                        ))}
                    </ul>
                ) : (<p>No hay usuarios registrados...</p>)
                }
            </>
            )}

            <h3>Crear nuevo usuario</h3>
            <form onSubmit={crear}>
                <input type = "text" placeholder="Nombre de la cuenta..." value={nombre} onChange={(e)=> setNombre(e.target.value)} required />

                <input type = "email" placeholder="Correo de la cuenta..." value={correo} onChange={(e)=> setCorreo(e.target.value)} required />

                <input type = "password" placeholder="ContraseÃ±a de la cuenta..." value={password} onChange={(e)=> setPassword(e.target.value)} required />

                <button type="submit">Agregar</button>
            </form>
        </div>
    );
};