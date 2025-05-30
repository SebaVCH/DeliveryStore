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

        return true;
    });


    return (
    <div> 
        <h2> Bienvenido: {user?.Name}, tu correo es: {user?.Email} </h2> 

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

                    <button 
                        onClick={() => {
                            setDietFilter('');
                        }}
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
                    <p>no hay productos en venta disponibles..</p>
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