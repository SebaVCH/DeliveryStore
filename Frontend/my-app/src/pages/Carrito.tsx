import React, { useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useCarritosComprador, usePrecioFinal, usePagarCarritos } from '../hooks/useCarrito';

export const Carrito = () => {
    const { token, setToken } = useAuth();
    const navigate = useNavigate();
    const { data: user, isLoading: cargauser, isError } = useUserProfile();
    const { data: carritos, isLoading: cargandoCarritos, refetch: refetchCarritos } = useCarritosComprador(user.PublicID);
    const { data: precioTotal, refetch: refetchPrecio } = usePrecioFinal(user.PublicID);
    const { mutate: pagarCarritos, isPending: isPaying } = usePagarCarritos();
    const [errorPago, setErrorPago] = useState<string | null>(null);

    if (!token) {
        navigate('/Login');
        return null;
    }

    const logout = () => {
        setToken(null);
        sessionStorage.removeItem('token');
        navigate('/Login');
    };

    const handlePagar = async () => {
        if (!user?.PublicID) return;
    
        setErrorPago(null); 

        try {
            await pagarCarritos(user.PublicID, {
                onSuccess: () => {
                    refetchCarritos();
                    refetchPrecio();
                    alert('Pago realizado con éxito');
                },
                onError: (error) => {
                    const mensaje = error.response.data.message
                    alert(mensaje)
                    setErrorPago(mensaje);
                }
            });
        } catch (error) {
            setErrorPago('Error inesperado al procesar el pago');
        }
    };

    if (cargauser || cargandoCarritos) {
        return <div className="loading">Cargando tu carrito...</div>;
    }

    if (isError) {
        setToken(null);
        navigate('/Login');
        return null;
    }

    return (
        <div className="carrito-container">
            <div className="header">
                <h2>Tus compras pendientes: </h2>
                <div className="actions">
                    <button 
                        className="btn secondary"
                        onClick={() => navigate('/Homegeneral')}
                    >
                        Ver productos en venta 
                    </button>
                    <button 
                        className="btn logout"
                        onClick={logout}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>

            {carritos?.length === 0 ? (
                <div className="empty-cart">
                    <p>No tienes productos en tu carrito.</p>
                    <button 
                        className="btn primary"
                        onClick={() => navigate('/Homegeneral')}
                    >
                        Ir a comprar
                    </button>
                </div>
            ) : (
                <div className="cart-content">
                    <h3>Productos en tu carrito:</h3>
                    <ul className="cart-items">
                        {carritos?.map((carrito: any) => (
                            <li key={carrito.ID} className="cart-item">
                                <div className="item-details">
                                    <p><strong>{carrito.Product.Name}</strong> - Cantidad: {carrito.Quantity} - Precio: ${carrito.FinalPrice}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <p>Tu saldo actual: <strong>${user.Balance}</strong></p>
                    <p>Total de la compra: <strong>${typeof precioTotal === 'object' ? precioTotal.message : precioTotal || '0'}</strong></p>
                    <button
                        onClick={handlePagar}
                        disabled={isPaying || carritos?.length === 0}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: isPaying ? '#cccccc' : '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                        >
                        {isPaying ? 'Procesando...' : 'Pagar ahora'}
                    </button>

                </div>
            )}
        </div>
    );
};

export default Carrito;