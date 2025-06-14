import React, {SyntheticEvent, useState} from 'react'
import { useProductosVendedor, useCrearProducto, useEliminarProducto } from '../hooks/useProductos';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuth } from '../context/AuthContext';

export const Producto = () => 
{
    const { data: user, isLoading: cargauser, isError} = useUserProfile();
    const {token, setToken} = useAuth();
    const {data: productos,isLoading: cargaproducto} = useProductosVendedor(user.PublicID);
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
    const [filterCount, setFilterCount] = useState<number | null>(null);
    const [filterError, setFilterError] = useState('');

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
        crearProd.mutate({Name: name, Description: description, Price: Number(price), IsVegan: Boolean(vegan), IsVegetarian: Boolean(vegetaria), IsGlutenFree: Boolean(gluten), Calories: Number(caloria), Delivery: deliver, SellerID: Number(idVendedor)});
        setNombre('');
        setDescripcion('');
        setPrecio('');
        setVegano('');
        setVegetariano('');
        setGluten('');
        setCalorias('');
        setEntrega('');
        console.log(user.PublicID);
        setVendedor(user.PublicID);
        console.log(user.PublicID);
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

        if (productos && num > productos.length) {
            setFilterError(`No tienes suficientes productos (máximo ${productos.length})`);
            return;
        }

        setFilterCount(num);
        setFilterError('');
    };

    const resetFilter = () => {
        setFilterCount(null);
        setFilterError('');
    };

    const filteredProducts = filterCount ? productos?.slice(0, filterCount) : productos;

    return (
    <div>
        <h1>Mis productos en venta</h1>
            <div style={{margin: '20px 0'}}>
                <h3>Filtrar productos</h3>
                <div>
                    <input 
                        type="number" 
                        placeholder='Cantidad de productos a mostrar...'
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

            {cargaproducto ? (<p>Cargando productos...</p>)
            : (
            <>
                <h2>Productos en Venta {filterCount ? `(Mostrando ${filterCount} de ${productos?.length})` : ''}</h2>
                {filteredProducts?.length > 0 ? (
                    <ul>
                        {filteredProducts.map((p: any) => (
                            <li key = {p.ID}>
                                {p.Name} - {p.Description} - ${p.Price} - 
                                Vegano: {p.IsVegan ? 'Sí' : 'No'} - 
                                Vegetariano: {p.IsVegetarian ? 'Sí' : 'No'} - 
                                Libre de Gluten: {p.IsGlutenFree ? 'Sí' : 'No'} - 
                                Calorías: {p.Calories} - 
                                Método de entrega: {p.Delivery} - Puntuación: {p.ReviewScore}
                                <button onClick={() => eliminarPrdo.mutate(p.ID)}> Eliminar</button>
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
                <option value="">seleccione</option>
                <option value="delivery">Delivery</option>
                <option value="retiro en tienda">Retiro en tienda</option>
            </select>

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
                                Es libre de gluten?
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