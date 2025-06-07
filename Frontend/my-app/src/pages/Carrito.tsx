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
    
        if (user?.Balance < (precioTotal || 0)) {
        setErrorPago('Saldo insuficiente para realizar esta compra');
        return;
        }

        setErrorPago(null);
    
        try {
            await pagarCarritos(user.PublicID);
        
        
            await Promise.all([refetchCarritos(), refetchPrecio()]);
        
            alert('¡Pago realizado con éxito!');
        
        } catch (error) {
            if (error instanceof Error) {
                setErrorPago(error.message);
            } else {
                setErrorPago('Ocurrió un error desconocido al procesar el pago');
            }
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

                    <div className="checkout-section">
                        {errorPago && (
                            <div className="error-message">
                                {errorPago}
                            </div>
                        )}
                        
                        <div className="balance-info">
                            <p>Tu saldo actual: <strong>${user?.Balance.toFixed(2)}</strong></p>
                            <p>Total de la compra: <strong>${precioTotal?.toFixed(2) || '0.00'}</strong></p>
                            {user?.Balance < (precioTotal || 0) && (
                                <p className="balance-warning">
                                    ¡No tienes suficiente saldo! Por favor recarga tu cuenta.
                                </p>
                            )}
                        </div>
                        
                        <button 
                            className={`btn primary ${isPaying ? 'loading' : ''}`}
                            onClick={handlePagar}
                            disabled={isPaying || carritos?.length === 0 || (user?.Balance < (precioTotal || 0))}
                        >
                            {isPaying ? (
                                <>
                                    <span className="spinner"></span>
                                    Procesando pago...
                                </>
                            ) : (
                                'Proceder al pago'
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Carrito;