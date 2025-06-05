import React, {SyntheticEvent, useState} from 'react';
import { useCrearProveedor, useEliminarProveedor, useProveedoresVendedor, useCrearProductoProveedor, useProductoProveedor } from '../hooks/useProveedores';
import { useNavigate } from 'react-router-dom';
import { useProductos } from '../hooks/useProductos';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuth } from '../context/AuthContext';

export const Proveedores = () => {
    const {token, setToken} = useAuth();
    const {data: user, isLoading: cargaUser, isError} = useUserProfile();
    const {data: proveedores, isLoading} = useProveedoresVendedor(user.PublicID);
    const {data: productos, isLoading: cargaProductos} = useProductos();
    
    const crearProv = useCrearProveedor();
    const crearProductoProveedor = useCrearProductoProveedor();
    const eliminarProv = useEliminarProveedor();
    const navigate = useNavigate();
    const [name, setNombre] = useState('');
    const [description, setDescripcion] = useState('');
    const [idComprador, setIdComprador] = useState('');

    if(!token)
    {
        navigate('/Login');
        return null;
    }

    if(cargaUser)
    {
        return <div> Cargando... </div>;
    }
    
    if(isError)
    {
        setToken(null);
        navigate('/Login');
        return null;
    }

    const crear = (e: SyntheticEvent) => {
        e.preventDefault();
        crearProv.mutate({Name: name, Description: description, SellerID: Number(idComprador)});
        setNombre('');
        setDescripcion('');
        setIdComprador(user.id);
    };


    if (isLoading) return <div>Cargando productos...</div>;

    return (
        <div>
        <h1>Tus Proveedores</h1>
        {isLoading ? (<p>Cargando proveedores...</p>)
                : (
                <>
                    {proveedores?.length > 0 ? (
                        <ul>
                            {proveedores?.map((p: any) => (
                                <li key={p.ID}>
                                    <div style={{marginBottom: '10px'}}>
                                        {p.Name} - <strong>{p.Description}</strong>
                                        <button 
                                            onClick={() => eliminarProv.mutate(p.ID)}
                                            style={{marginLeft: '10px'}}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
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