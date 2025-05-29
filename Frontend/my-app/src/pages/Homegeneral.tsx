import React from 'react';
import {useProductos} from '../hooks/useProductos'
import { useUserProfile } from '../hooks/useUserProfile';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export const Homegeneral = () => {
    const {token, setToken} = useAuth();
    const navigate = useNavigate();
    const { data: user, isLoading: cargauser, isError} = useUserProfile();
    const {data: productos, isLoading: cargaproducto} = useProductos();
    

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

    return (
    <div> 
        <h2> Bienvenido: {user?.Name}, tu correo es: {user?.Email} </h2> 
        <h3>Productos en venta</h3>
        {cargaproducto ? (
            <p>cargando productos en venta... 🗣️🗣️</p>
        ) : productos?.length > 0 ? (
            <ul>
                {productos.map((producto: any) => (
                    <li key = {producto.ID}>
                        {producto.Name} - {producto.Description} - ${producto.Price} - 
                            Vegano: {producto.IsVegan ? 'Sí' : 'No'} - 
                            Vegetariano: {producto.IsVegetarian ? 'Sí' : 'No'} - 
                            Gluten: {producto.IsGlutenFree ? 'Sí' : 'No'} - 
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
        <button onClick={logout}>Cerrar la sesion 🤑</button>
    </div>
    );
    
};

export default Homegeneral;