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
    const [filters, setFilters] = useState({
        diet: '',
        price: '',
        calories: ''
    });

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
        if (filters.diet === 'veganos' && !producto.IsVegan) return false;
        if (filters.diet === 'vegetarianos' && !producto.IsVegetarian) return false;
        if (filters.diet === 'sin gluten' && !producto.IsGlutenFree) return false;

        // filtro por rango de precio - CORREGIDO los valores
        if (filters.price === 'menos de $4999' && producto.Price > 4999) return false;
        if (filters.price === 'entre $5000 y $14999' && (producto.Price <= 4999 || producto.Price > 14999)) return false;
        if (filters.price === 'más de $15000' && producto.Price <= 14999) return false;

        // filtro por rango de calorías - CORREGIDO los valores
        if (filters.calories === 'menos de 200' && producto.Calories > 200) return false;
        if (filters.calories === 'entre 200 y 400' && (producto.Calories <= 199 || producto.Calories > 400)) return false;
        if (filters.calories === 'más de 400' && producto.Calories <= 399) return false;

        return true;
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            diet: '',
            price: '',
            calories: ''
        });
    };

    return (
    <div> 
        <h2> Bienvenid@: {user?.Name} Tu saldo es: ${user?.Balance}</h2> 
        

        {user.RoleType === 1 && (
            <>
                <h3>Productos en venta</h3>

                <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                    <select 
                    name="diet"
                    value={filters.diet}
                    onChange={handleFilterChange}
                    style={{ padding: '5px' }}
                    >
                    <option value="">Todos los productos</option>
                    <option value="veganos">Productos veganos</option>
                    <option value="vegetarianos">Productos vegetarianos</option>
                    <option value="sin gluten">Productos sin gluten</option>
                    </select>

                    <select 
                    name="price"
                    value={filters.price}
                    onChange={handleFilterChange}
                    style={{ padding: '5px' }}
                    >
                    <option value="">Todos los precios</option>
                    <option value="menos de $4999">menos de $4999</option>
                    <option value="entre $5000 y $14999">entre $5000 y $14999</option>
                    <option value="más de $15000">más de $15000</option>
                    </select>

                    <select 
                    name="calories"
                    value={filters.calories}
                    onChange={handleFilterChange}
                    style={{ padding: '5px' }}
                    >
                    <option value="">Ningún rango</option>
                    <option value="menos de 200">Menos de 200 cal</option>
                    <option value="entre 200 y 400">200 - 400 cal</option>
                    <option value="más de 400">Más de 400 cal</option>
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