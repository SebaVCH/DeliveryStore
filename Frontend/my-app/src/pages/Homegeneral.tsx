import React,{SyntheticEvent, useState} from 'react';
import {useProductos} from '../hooks/useProductos'
import { useUserProfile} from '../hooks/useUserProfile';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useCrearCarrito } from '../hooks/useCarrito';


export const Homegeneral = () => {
    const {token, setToken} = useAuth();
    const navigate = useNavigate();
    const { data: user, isLoading: cargauser, isError} = useUserProfile();
    const {data: productos, isLoading: cargaproducto} = useProductos();
    const { mutate: crearCarrito } = useCrearCarrito();
    
    
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [showModal, setShowModal] = useState<boolean>(false);


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

        // filtro por rango de precio 
        if (filters.price === 'menos de $4999' && producto.Price > 4999) return false;
        if (filters.price === 'entre $5000 y $14999' && (producto.Price <= 4999 || producto.Price > 14999)) return false;
        if (filters.price === 'más de $15000' && producto.Price <= 14999) return false;

        // filtro por rango de calorías 
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
  
    const handleBuyClick = (producto: any) => {
        setSelectedProduct(producto);
        setQuantity(1);
        setShowModal(true);
    };

    const handleConfirmPurchase = () => {
        if (selectedProduct && user) {
            crearCarrito({
                BuyerID: user.ID,
                IDProduct: selectedProduct.ID,
                Quantity: quantity
            });
            setShowModal(false);
        }
    };

    const totalPrice = selectedProduct ? (selectedProduct.Price * quantity).toFixed(2) : '0.00';

    return (
    <div> 
        <h2> Bienvenid@: {user?.Name} {user.RoleType === 1 && (<>Tu saldo es: ${user?.Balance}</>)}</h2> 
        

        {user.RoleType === 1 && (
            <>  
                <button onClick={()=> navigate('/Carrito')}> Revisa tu carrito </button>
                <button onClick={()=> navigate('/Home')}> Gestionar tienda </button>
                <button onClick={logout}> Cerrar sesión </button>
                <h3>Productos en venta</h3>

                <div>
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
                    <option value="">Ningún rango de calorías</option>
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

                                    <div>
                                        <button 
                                            onClick={() => handleBuyClick(producto)}
                                            style={{
                                                marginTop: '10px',
                                                padding: '5px 10px',
                                                backgroundColor: '#4CAF50',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Comprar
                                        </button>
                                    </div>
                                    <p>------------</p>
                            </li>
                        ))}
                    </ul>
                ): (
                    <p>No hay productos que coincidan con los filtros seleccionados.</p>
                )}            
            </>

        )}

        

        { user.RoleType === 2 && (
            <>
                <button onClick={()=> navigate('/Repartidores')}>Vista de repartidor</button>
                <button onClick={logout}> Cerrar sesión </button>
            </>
            
        )}

        { user.RoleType === 3 && (
            <>
                <button onClick={()=> navigate('/AdminDashboard')}>Vista de admin</button>
                <button onClick={logout}> Cerrar sesión </button>
            </>
        )}

        
        {showModal && selectedProduct && (
                <div style={{
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        width: '300px'
                    }}>
                        <h3>Comprar {selectedProduct.Name}</h3>
                        <p>Precio unitario: ${selectedProduct.Price}</p>
                        
                        <div style={{ margin: '15px 0' }}>
                            <label htmlFor="quantity">Cantidad: </label>
                            <input
                                type="number"
                                id="quantity"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                style={{
                                    width: '60px',
                                    padding: '5px',
                                    marginLeft: '10px'
                                }}
                            />
                        </div>
                        
                        <p><strong>Total: ${totalPrice}</strong></p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    padding: '8px 15px',
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmPurchase}
                                style={{
                                    padding: '8px 15px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

    </div>
    );
    
};

export default Homegeneral;