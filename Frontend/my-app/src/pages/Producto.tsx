import React, {SyntheticEvent, useState} from 'react'
import { useProductosVendedor, useCrearProducto, useEliminarProducto } from '../hooks/useProductos';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuth } from '../context/AuthContext';

export const Producto = () => 
{
    const { data: user, isLoading: cargauser, isError} = useUserProfile();
    const {token, setToken} = useAuth();
    const {data: productos,isLoading: cargaproducto} = useProductosVendedor(user.identificador);
    const crearProd = useCrearProducto();
    const eliminarPrdo = useEliminarProducto();
    const navigate = useNavigate();
    const [name, setNombre] = useState('');
    const [description, setDescripcion] = useState('');
    const [price,setPrecio] = useState('');
    const [vegan,setVegano] = useState('');
    const [vegetaria,setVegetariano] = useState('');
    const [gluten,setGluten] = useState('');
    const [caloria,setCalorias] = useState('');
    const [deliver,setEntrega] = useState('');
    const [idVendedor,setVendedor] = useState('');

    const [isComestible, setIsComestible] = useState(false);

    if(!token)
    {
        navigate('/Login');
        return null;
    }

    if(cargauser)
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
        crearProd.mutate({nombre: name, descripcion: description, precio: Number(price), vegano: Boolean(vegan), vegetariano: Boolean(vegetaria), posee_gluten: Boolean(gluten), calorias: Number(caloria), entrega: deliver, id_vendedor: Number(idVendedor)});
        setNombre('');
        setDescripcion('');
        setPrecio('');
        setVegano('');
        setVegetariano('');
        setGluten('');
        setCalorias('');
        setEntrega('');
        setVendedor(user.identificador);
    };      

  return (
    <div>
        <h1>Mis productos en venta</h1>
        {cargaproducto ? (<p>Cargando productos...</p>)
        : (
        <>
            <h2>Productos en Venta</h2>
            {productos?.length > 0 ? (
                <ul>
                    {productos.map((p: any) => (
                        <li key = {p.id}>
                            {p.nombre} - {p.descripcion} - ${p.precio} - 
                            Vegano: {p.vegano ? 'Sí' : 'No'} - 
                            Vegetariano: {p.vegetariano ? 'Sí' : 'No'} - 
                            Gluten: {p.posee_gluten ? 'Sí' : 'No'} - 
                            Calorías: {p.calorias} - 
                            Método de entrega: {p.entrega} - Puntuación: {p.puntuacion_promedio}
                            <button onClick={() => eliminarPrdo.mutate(p.id)}> Eliminar</button>
                             <p>------------</p>
                        </li>
                    ))}
                </ul>
            ) : (<p> No hay productos</p>)
            }
        </>
        )}
            
        <h3>Vender nuevo producto: </h3>
        <form onSubmit={crear}>
            <input type = "text" placeholder='Nombre del producto...' value={name} onChange={(e)=> setNombre(e.target.value)} required/>

            <input type = "number" placeholder='Precio del producto...' value={price} onChange={(e)=> setPrecio(e.target.value)} required/>

            <input type = "text" placeholder='Descripcion del producto...' value={description} onChange={(e)=> setDescripcion(e.target.value)} required/>

            <select value={deliver} onChange={(e)=> setEntrega(e.target.value)} required>
                <option value="delivery">Delivery</option>
                <option value="retiro en tienda">Retiro en tienda</option>
            </select>

            <div>
                <label>
                    <input 
                        type="checkbox" 
                        checked={isComestible} 
                        onChange={(e) => setIsComestible(e.target.checked)} 
                    />
                    Su producto es comestible?
                </label>
            </div>

            <div style={{margin: '10px 0'}}>
                    <label>
                        <input 
                            type="checkbox" 
                            checked={isComestible} 
                            onChange={(e) => setIsComestible(e.target.checked)} 
                        />
                        ¿Su producto es comestible?
                    </label>
                </div>

                {isComestible && (
                    <div style={{marginLeft: '20px'}}>
                        <div>
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={vegan === 'true'} 
                                    onChange={(e) => setVegano(e.target.checked ? 'true' : 'false')} 
                                />
                                Vegano
                            </label>
                        </div>
                        <div>
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={vegetaria === 'true'} 
                                    onChange={(e) => setVegetariano(e.target.checked ? 'true' : 'false')} 
                                />
                                Vegetariano
                            </label>
                        </div>
                        <div>
                            <label>
                                <input 
                                    type="checkbox" 
                                    checked={gluten === 'true'} 
                                    onChange={(e) => setGluten(e.target.checked ? 'true' : 'false')} 
                                />
                                Contiene gluten
                            </label>
                        </div>
                        <div>
                            <input type="number" placeholder='Calorías del producto: ' value={caloria} onChange={(e) => setCalorias(e.target.value)} required min="0"/>
                        </div>
                    </div>
                )}

            <button type = "submit"> Agregar</button>
        </form>

        <button onClick={()=> navigate('/Proveedores')}>Mis Proveedores</button>
    </div>
  );
};

export default Producto;