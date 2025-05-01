import React, {SyntheticEvent, useState} from 'react'
import { useProductos, useCrearProducto, useEliminarProducto } from '../hooks/useProductos';
import { useNavigate } from 'react-router-dom';

export const Producto = () => 
{
    const {data: productos,isLoading: cargaproducto} = useProductos();
    const crearProd = useCrearProducto();
    const eliminarPrdo = useEliminarProducto();
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [precio,setPrecio] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [metodo,setMetodo] = useState('')
    
    const crear = (e: SyntheticEvent) => {
        e.preventDefault();
        crearProd.mutate({name: nombre, price: Number(precio), description: descripcion, method: metodo});
        setNombre('');
        setPrecio('');
        setDescripcion('');
        setMetodo('');
    };      

  return (
    <div>
        <h1>Mis Productos</h1>
        {cargaproducto ? (<p>Cargando productos...</p>)
        : (
        <>
            <h2>Productos en Venta</h2>
            {productos?.length > 0 ? (
                <ul>
                    {productos.map((p: any) => (
                        <li key = {p._id}>
                            {p.name} - ${p.price} - <strong>{p.method}</strong>
                            <button onClick={() => eliminarPrdo.mutate(p._id)}> Eliminar</button> 
                        </li>
                    ))}
                </ul>
            ) : (<p> No hay productos</p>)
            }
        </>
        )}
            
        <h3>Agregar producto</h3>
        <form onSubmit={crear}>
            <input type = "text" placeholder='Nombre del producto...' value={nombre} onChange={(e)=> setNombre(e.target.value)} required/>

            <input type = "number" placeholder='Precio del producto...' value={precio} onChange={(e)=> setPrecio(e.target.value)} required/>

            <input type = "text" placeholder='Descripcion del producto...' value={descripcion} onChange={(e)=> setDescripcion(e.target.value)} required/>

            <select value={metodo} onChange={(e)=> setMetodo(e.target.value)} required>
                <option value="delivery">Delivery</option>
                <option value="retiro en tienda">Retiro en tienda</option>
            </select>

            <button type = "submit"> Agregar</button>
        </form>

        <button onClick={()=> navigate('/Proveedores')}>Mis Proveedores</button>
    </div>
  );
};

export default Producto;