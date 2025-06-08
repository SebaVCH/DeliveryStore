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
    
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState<number | null>(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const crearRelacion = useCrearProductoProveedor();

    const crearProv = useCrearProveedor();
    const crearProductoProveedor = useCrearProductoProveedor();
    const eliminarProv = useEliminarProveedor();
    const navigate = useNavigate();
    const [name, setNombre] = useState('');
    const [description, setDescripcion] = useState('');
    const [idVendedor, setIdVendedor] = useState('');

    if(!token)
    {
        navigate('/Login');
        return null;
    }

    if(cargaUser || cargaProductos) {
        return <div>Cargando...</div>;
    }
    
    if(isError)
    {
        setToken(null);
        navigate('/Login');
        return null;
    }

    const crear = (e: SyntheticEvent) => {
        e.preventDefault();
        crearProv.mutate({Name: name, Description: description, SellerID: Number(idVendedor)});
        setNombre('');
        setDescripcion('');
        setIdVendedor(user.PublicID);
    };


    if (isLoading) return <div>Cargando productos...</div>;

    const abrirModalAsociacion = (proveedorId: number) => {
        setProveedorSeleccionado(proveedorId);
        setMostrarModal(true);
    };

    const asociarProducto = (e: SyntheticEvent) => {
        e.preventDefault();
        if (proveedorSeleccionado && productoSeleccionado) {
            crearRelacion.mutate({
                SupplierID: proveedorSeleccionado,
                ProductID: Number(productoSeleccionado)
            }, {
                onSuccess: () => {
                    setMostrarModal(false);
                    setProductoSeleccionado('');
                }
            });
        }
    };

    const ProductosDeProveedor = ({ proveedorId }: { proveedorId: number }) => {
        const { data: productos, isLoading } = useProductoProveedor(proveedorId);

        if (isLoading) return <div>Cargando productos...</div>;

        return (
            <div style={{ marginLeft: '20px', marginTop: '5px' }}>
                <strong>Productos asociados:</strong>
                {productos?.length > 0 ? (
                    <ul>
                        {productos.map((p: any) => (
                            <li key={p.ID}>
                                <p>{p.Product.Name} - {p.Product.Description}- ${p.Product.Price}- {p.Product.ReviewScore}</p>
                            </li>

                        ))}
                    </ul>
                ) : (
                    <p>No hay productos asociados</p>
                )}
            </div>
        );
    };

    return (
        <div>
        <h1>Tus Proveedores</h1>
            
            {isLoading ? (
                <p>Cargando proveedores...</p>
            ) : (
                <>
                    {proveedores?.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {proveedores.map((p: any) => (
                                <li key={p.ID} style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                    <div>
                                        <strong>{p.Name}</strong> - {p.Description}
                                        <div style={{ marginTop: '5px' }}>
                                            <button 
                                                onClick={() => eliminarProv.mutate(p.ID)}
                                                style={{ marginRight: '10px', padding: '3px 8px' }}
                                            >
                                                Eliminar
                                            </button>
                                            <button 
                                                onClick={() => abrirModalAsociacion(p.ID)}
                                                style={{ padding: '3px 8px' }}
                                            >
                                                Asociar Producto
                                            </button>
                                        </div>
                                        <ProductosDeProveedor proveedorId={p.ID} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay proveedores registrados</p>
                    )}
                </>
            )}
        
        {mostrarModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '5px',
                        width: '350px'
                    }}>
                        <h3>Asociar Producto</h3>
                        <p>Selecciona un producto para asociar:</p>
                        
                        <select
                            value={productoSeleccionado}
                            onChange={(e) => setProductoSeleccionado(e.target.value)}
                            style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
                        >
                            <option value="">-- Seleccione un producto --</option>
                            {productos?.map((producto: any) => (
                                <option key={producto.ID} value={producto.ID}>
                                    {producto.Name}
                                </option>
                            ))}
                        </select>
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button 
                                onClick={() => {
                                    setMostrarModal(false);
                                    setProductoSeleccionado('');
                                }}
                                style={{ padding: '5px 10px' }}
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={asociarProducto}
                                disabled={!productoSeleccionado}
                                style={{ padding: '5px 10px' }}
                            >
                                Asociar
                            </button>
                        </div>
                    </div>
                </div>
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