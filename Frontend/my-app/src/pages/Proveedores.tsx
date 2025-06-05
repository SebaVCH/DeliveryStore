import React, {SyntheticEvent, useState} from 'react';
import { useCrearProveedor, useEliminarProveedor, useProveedoresVendedor, useCrearProductoProveedor, useProductoProveedor } from '../hooks/useProveedores';
import { useNavigate } from 'react-router-dom';
import { useProductos } from '../hooks/useProductos';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuth } from '../context/AuthContext';

export const Proveedores = () => {
    const {token, setToken} = useAuth();
    const {data: user, isLoading: cargaUser, isError} = useUserProfile();
    const {data: proveedores, isLoading} = useProveedoresVendedor(user.id);
    const {data: productos, isLoading: cargaProductos} = useProductos();
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState<number | null>(null);
    const [mostrarSelectProducto, setMostrarSelectProducto] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState('');

    const [filterCount, setFilterCount] = useState<number | null>(null);
    const [filterError, setFilterError] = useState('');

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

    const abrirSelectProducto = (proveedorId: number) => {
        setProveedorSeleccionado(proveedorId);
        setMostrarSelectProducto(true);
    };

    const asociarProducto = (e: SyntheticEvent) => {
        e.preventDefault();
        if (proveedorSeleccionado && productoSeleccionado) {
            crearProductoProveedor.mutate({
                ID: proveedorSeleccionado,
                ProductID: Number(productoSeleccionado)
            });
            setMostrarSelectProducto(false);
            setProductoSeleccionado('');
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setFilterCount(null);
            setFilterError('');
            return;
        }

        const num = parseInt(value);
        if (isNaN(num)) {
            setFilterError('Por favor ingrese un número válido');
            return;
        }

        if (num <= 0) {
            setFilterError('El número debe ser mayor a 0');
            return;
        }

        if (proveedores && num > proveedores.length) {
            setFilterError(`No tienes suficientes proveedores (máximo ${proveedores.length})`);
            return;
        }

        setFilterCount(num);
        setFilterError('');
    };

    const resetFilter = () => {
        setFilterCount(null);
        setFilterError('');
    };

    const filteredProveedores = filterCount ? proveedores?.slice(0, filterCount) : proveedores;

    const ProductosProveedor = ({ proveedorId }: { proveedorId: number }) => {
    const { data: productos, isLoading } = useProductoProveedor(proveedorId);

    if (isLoading) return <div>Cargando productos...</div>;

    return (
        <div style={{marginLeft: '20px', marginTop: '10px'}}>
            <h4>Productos asociados:</h4>
            {productos?.length > 0 ? (
                <ul>
                    {productos.map((producto: any) => (
                        <li key={producto.ID}>{producto.Name}</li>
                    ))}
                </ul>
            ) : (
                <p>No hay productos asociados</p>
            )}
        </div>
    );};

    return (
        <div>
        <h1>Tus Proveedores</h1>
        <div style={{margin: '20px 0'}}>
                <h3>Filtrar proveedores</h3>
                <div>
                    <input 
                        type="number" 
                        placeholder='Cantidad de proveedores a mostrar...'
                        value={filterCount || ''}
                        onChange={handleFilterChange}
                        min="1"
                    />
                    <button onClick={resetFilter} style={{marginLeft: '10px'}}>
                        Reiniciar filtro
                    </button>
                </div>
                {filterError && <p style={{color: 'red'}}>{filterError}</p>}
        </div>
        {isLoading ? (<p>Cargando proveedores...</p>)
                : (
                <>
                    {filteredProveedores?.length > 0 ? (
                        <ul>
                            {filteredProveedores?.map((p: any) => (
                                <li key={p.ID}>
                                    <div style={{marginBottom: '10px'}}>
                                        {p.Name} - <strong>{p.Description}</strong>
                                        <button 
                                            onClick={() => eliminarProv.mutate(p.ID)}
                                            style={{marginLeft: '10px'}}
                                        >
                                            Eliminar
                                        </button>
                                        <button 
                                            onClick={() => abrirSelectProducto(p.ID)}
                                            style={{marginLeft: '10px'}}
                                        >
                                            Agregar Producto
                                        </button>
                                        
                                        {/* Lista de productos del proveedor */}
                                        <ProductosProveedor proveedorId={p.ID} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (<p> No hay proveedores</p>)
                    }
                </>
            )}

        {mostrarSelectProducto && (
                <div style={{
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
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
                        width: '300px'
                    }}>
                        <h3>Seleccionar Producto</h3>
                        <select 
                            value={productoSeleccionado}
                            onChange={(e) => setProductoSeleccionado(e.target.value)}
                            style={{width: '100%', padding: '8px', marginBottom: '10px'}}
                        >
                            <option value="">Seleccione un producto</option>
                            {productos?.map((producto: any) => (
                                <option key={producto.ID} value={producto.ID}>
                                    {producto.Name}
                                </option>
                            ))}
                        </select>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <button 
                                onClick={() => setMostrarSelectProducto(false)}
                                style={{padding: '8px 15px'}}
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={asociarProducto}
                                disabled={!productoSeleccionado}
                                style={{padding: '8px 15px'}}
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