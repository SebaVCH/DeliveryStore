import React, {SyntheticEvent, useState} from 'react';
import { useProveedores, useCrearProveedor, useEliminarProveedor } from '../hooks/useProveedores';

export const Proveedores = () => {
    const {data: proveedores, isLoading} = useProveedores();
    const crearProv = useCrearProveedor();
    const eliminarProv = useEliminarProveedor();

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const crear = (e: SyntheticEvent) => {
        e.preventDefault();
        crearProv.mutate({name: nombre,description: descripcion});
        setNombre('');
        setDescripcion('');
    };

    return (
        <div>
        <h1>Tus Proveedores</h1>
        {isLoading ? (<p>Cargando proveedores...</p>)
        : (
        <>
            {proveedores?.length > 0 ? (
                <ul>
                    {proveedores?.map((p: any) => (
                        <li key = {p._id}>
                            {p.name} - <strong>{p.description}</strong>
                            <button onClick={() => eliminarProv.mutate(p._id)}> Eliminar</button> 
                        </li>
                    ))}
                </ul>
            ) : (<p> No hay proveedores</p>)
            }
        </>
        )}
            
        <h3>Agregar proveedor</h3>
        <form onSubmit={crear}>
            <input type = "text" placeholder='Nombre del proveedor...' value={nombre} onChange={(e)=> setNombre(e.target.value)} required/>

            <input type = "text" placeholder='Descripcion del proveedor...' value={descripcion} onChange={(e)=> setDescripcion(e.target.value)} required/>

            <button type = "submit"> Agregar</button>
        </form>

    </div>

    );
};