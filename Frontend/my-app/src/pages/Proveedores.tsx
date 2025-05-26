import React, {SyntheticEvent, useState} from 'react';
import { useProveedores, useCrearProveedor, useEliminarProveedor } from '../hooks/useProveedores';

export const Proveedores = () => {
    const {data: proveedores, isLoading} = useProveedores();
    const crearProv = useCrearProveedor();
    const eliminarProv = useEliminarProveedor();

    const [name, setNombre] = useState('');
    const [description, setDescripcion] = useState('');

    const crear = (e: SyntheticEvent) => {
        e.preventDefault();
        crearProv.mutate({nombre: name, descripcion: description});
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
                        <li key = {p.id}>
                            {p.nombre} - <strong>{p.descripcion}</strong>
                            <button onClick={() => eliminarProv.mutate(p.id)}> Eliminar</button> 
                        </li>
                    ))}
                </ul>
            ) : (<p> No hay proveedores</p>)
            }
        </>
        )}
            
        <h3>Agregar proveedor</h3>
        <form onSubmit={crear}>
            <input type = "text" placeholder='Nombre del proveedor...' value={name} onChange={(e)=> setNombre(e.target.value)} required/>

            <input type = "text" placeholder='Descripcion del proveedor...' value={description} onChange={(e)=> setDescripcion(e.target.value)} required/>

            <button type = "submit"> Agregar</button>
        </form>

    </div>

    );
};