import React,{SyntheticEvent, useState} from 'react';
import {useProductos} from '../hooks/useProductos'
import { useUserProfile } from '../hooks/useUserProfile';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export const Homegeneral = () => {
    const {token, setToken} = useAuth();
    const navigate = useNavigate();
    const { data: user, isLoading: cargauser, isError} = useUserProfile();
    const {data: productos, isLoading: cargaproducto} = useProductos();
    //filtros: 
    const [dietFilter, setDietFilter] = useState<string>('');
    const [priceFilter, setPriceFilter] = useState<string>('');
    const [caloriesFilter, setCaloriesFilter] = useState<string>('');

    if(!token)
    {
        navigate('/Login');
        return null;
    }


    const logout = () => {
        setToken(null);
        sessionStorage.removeItem('token');
        navigate('/Login');
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

    const filteredProducts = productos?.filter((producto: any) => {
        // filtro por características
        if (dietFilter === 'veganos' && !producto.IsVegan) return false;
        if (dietFilter === 'vegetarianos' && !producto.IsVegetarian) return false;
        if (dietFilter === 'sin gluten' && !producto.IsGlutenFree) return false;

        // filtro por rango de precio
        if (priceFilter === 'menos de $4999' && producto.Price > 4999) return false;
        if (priceFilter === 'entre $5000 y $14999' && (producto.Price <= 4999 || producto.Price > 14999)) return false;
        if (priceFilter === 'más de $15000' && producto.Price <= 14999) return false;

        // filtro por rango de calorías
        if (caloriesFilter === 'menos de 200' && producto.Calories > 200) return false;
        if (caloriesFilter === 'entre 200 y 400' && (producto.Calories <= 199 || producto.Calories > 400)) return false;
        if (caloriesFilter === 'más de 400' && producto.Calories <= 399) return false;

        return true;
    });

    const clearFilters = () => {
        setDietFilter('');
        setPriceFilter('');
        setCaloriesFilter('');
    };

    return (
    <div> 
        <h2> Bienvenid@: {user?.Name}</h2> 

        {user.RoleType === 1 && (
            <>
                <h3>Productos en venta</h3>

                <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                    <select 
                        value={dietFilter}
                        onChange={(e) => setDietFilter(e.target.value)}
                        style={{ padding: '5px' }}
                    >
                        <option value="">Todos los productos</option>
                        <option value="veganos">Productos veganos</option>
                        <option value="vegetarianos">Productos vegetarianos</option>
                        <option value="sin gluten">Productos sin gluten</option>
                    </select>

                        <select 
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(e.target.value)}
                            style={{ padding: '5px' }}
                        >
                            <option value="">Todos los precios</option>
                            <option value="baratos">Menos de $10</option>
                            <option value="medios">$10 - $20</option>
                            <option value="caros">Más de $20</option>
                        </select>

                        <select 
                            value={caloriesFilter}
                            onChange={(e) => setCaloriesFilter(e.target.value)}
                            style={{ padding: '5px' }}
                        >
                            <option value="">Todas las calorías</option>
                            <option value="bajas">Menos de 200 cal</option>
                            <option value="moderadas">200 - 400 cal</option>
                            <option value="altas">Más de 400 cal</option>
                        </select>

                        <button 
                            onClick={clearFilters}
                            style={{ padding: '5px 10px' }}
                        >
                            Limpiar filtros
                        </button>
                </div>


                {cargaproducto ? (
                    <p>cargando productos en venta... 🗣️🗣️</p>
                ) : filteredProducts?.length > 0 ? (
                    <ul>
                        {filteredProducts.map((producto: any) => (
                            <li key = {producto.ID}>
                                {producto.Name} - {producto.Description} - ${producto.Price} - 
                                    Vegano: {producto.IsVegan ? 'Sí' : 'No'} - 
                                    Vegetariano: {producto.IsVegetarian ? 'Sí' : 'No'} - 
                                    Libre de Gluten: {producto.IsGlutenFree ? 'Sí' : 'No'} - 
                                    Calorías: {producto.Calories} - 
                                    Método de entrega: {producto.Delivery} - Puntuación: {producto.ReviewScore}
                                    <p>------------</p>
                            </li>
                        ))}
                    </ul>
                ): (
                    <p>No hay productos que coincidan con los filtros seleccionados.</p>
                )}
                <button onClick={()=> navigate('/Home')}>Gestionar tienda</button>            
            </>

        )}

        

        { user.RoleType === 2 && (
            <button onClick={()=> navigate('/Repartidores')}>Vista de repartidor</button>
        )}

        { user.RoleType === 3 && (
            <button onClick={()=> navigate('/AdminDashboard')}>Vista de admin</button>
        )}


        
        <button onClick={logout}>Cerrar la sesion 🤑</button>
        
    </div>
    );
    
};

export default Homegeneral;