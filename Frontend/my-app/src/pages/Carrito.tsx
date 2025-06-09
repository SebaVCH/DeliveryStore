import React, { useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useCarritosComprador, usePrecioFinal, usePagarCarritos} from '../hooks/useCarrito';
import { useAgregarSaldo, useCrearValoracion } from '../hooks/useUsuarios';
import { useCrearTransaccion } from '../hooks/useTransaccion';
import { useCrearOrden } from '../hooks/useOrdenes';

export const Carrito = () => {
    const { token, setToken } = useAuth();
    const navigate = useNavigate();
    const { data: user, isLoading: cargauser, isError, refetch: refetchUser } = useUserProfile();
    const { data: carritos, isLoading: cargandoCarritos, refetch: refetchCarritos } = useCarritosComprador(user.PublicID);
    const { data: precioTotal, refetch: refetchPrecio } = usePrecioFinal(user.PublicID);
    const { mutate: pagarCarritos, isPending: isPaying } = usePagarCarritos();
    const [errorPago, setErrorPago] = useState<string | null>(null);
    const { mutate: agregarSaldo, isPending: isAddingBalance } = useAgregarSaldo();
    const [amount, setAmount] = useState('');
    const [balanceError, setBalanceError] = useState('');
    const [showAddBalance, setShowAddBalance] = useState(false);
    const crearTransaccion = useCrearTransaccion();
    const crearOrden = useCrearOrden()

    //cosas de transaccion
    const [idComprador, setBuyerID] = useState('');
    const [idProducto, setProductID] = useState('');
    const [cantidad, setCantidad] = useState('');

    //cosas de valoraciones
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [currentProductIndex, setCurrentProductIndex] = useState(0);
    const [ratings, setRatings] = useState<{Rating: number, Comment: string}[]>([]);
    const { mutate: crearValoracion } = useCrearValoracion(); 
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    
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
        if (!user?.PublicID || !carritos || carritos.length === 0) return;

        setErrorPago(null);
        setPaymentSuccess(false);

        try {
        
        for (const carrito of carritos) {
            await pagarCarritos({
                BuyerID: user.PublicID,
                ProductID: carrito.IDProduct,
                Amount: carrito.FinalPrice
            });

            await crearTransaccion.mutateAsync({
                BuyerID: user.PublicID,
                ProductID: carrito.IDProduct,
                SellerID: carrito.Product.SellerID,
                Amount: carrito.FinalPrice,
            })

            if (carrito.Product.Delivery === 'delivery') {
                await crearOrden.mutateAsync({
                    Status: 'Pendiente',
                    BuyerID: user.PublicID,
                    SellerID: carrito.Product.SellerID
                });
            }

        }

        setPaymentSuccess(true);
        setRatings(carritos.map(() => ({ Rating: 5, Comment: '' })));
        setCurrentProductIndex(0);
        setShowReviewModal(true);
        
        } catch (error : any) {
            const mensaje = error.response?.data?.message || 'Error al procesar el pago';
            alert(`Error con el producto: ${mensaje}`);
            setErrorPago(mensaje);
        }
    };


    const handleAddBalance = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setBalanceError('Ingrese un monto válido');
            return;
        }

        if (!user?.PublicID) {
            setBalanceError('No se pudo identificar al usuario');
            return;
        }

        setBalanceError('');

        try {
            await agregarSaldo({ id: user.PublicID, monto: Number(amount) }, {
                onSuccess: () => {
                    alert(`Saldo de $${amount} agregado correctamente`);
                    setAmount('');
                    setShowAddBalance(false);
                    refetchUser(); 
                },
                onError: (error: any) => {
                    setBalanceError(error?.response?.data?.message || 'Error al agregar saldo');
                }
            });
        } catch (error) {
            setBalanceError('Error inesperado al agregar saldo');
        }
    };

    const handleRatingChange = (index: number, field: 'Rating' | 'Comment', value: any) => {
        const newRatings = [...ratings];
        newRatings[index] = {
            ...newRatings[index],
            [field]: field === 'Rating' ? Number(value) : value
        };
        setRatings(newRatings);
    };

    const completePaymentProcess = () => {
        setShowReviewModal(false);
        refetchCarritos();
        refetchPrecio();
        refetchUser();
        alert(paymentSuccess ? '¡Gracias por tus valoraciones!' : 'Pago realizado con éxito');
        setPaymentSuccess(false);
    };

    const skipReviews = () => {
        setShowReviewModal(false);
        completePaymentProcess();
    };

    const handleSubmitReview = async () => {
        const currentProduct = carritos[currentProductIndex];
        
        try {
            await crearValoracion({
                Rating: ratings[currentProductIndex].Rating,
                Comment: ratings[currentProductIndex].Comment,
                BuyerID: user.PublicID,
                IDProduct: currentProduct.IDProduct
            });

            if (currentProductIndex < carritos.length - 1) {
                setCurrentProductIndex(currentProductIndex + 1);
            } else {
                completePaymentProcess();
            }
        } catch (error) {
            alert('Error al enviar la valoración');
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
                        className="btn primary"
                        onClick={() => setShowAddBalance(true)}
                    >
                        Recargar saldo
                    </button>
                    <button 
                        className="btn logout"
                        onClick={logout}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
            {showAddBalance && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Recargar saldo</h3>
                        <form onSubmit={handleAddBalance}>
                            <div className="form-group">
                                <label>Monto a agregar:</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Ej: 10000"
                                    min="1"
                                    step="1"
                                />
                            </div>
                            {balanceError && <div className="error-message">{balanceError}</div>}
                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="btn secondary"
                                    onClick={() => {
                                        setShowAddBalance(false);
                                        setBalanceError('');
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn primary"
                                    disabled={isAddingBalance}
                                >
                                    {isAddingBalance ? 'Procesando...' : 'Agregar saldo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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

            

            {showReviewModal && carritos && ratings.length > 0 &&(
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Valorar producto {currentProductIndex + 1} de {carritos.length}</h3>
                        <h4>{carritos[currentProductIndex].Product.Name}</h4>
                        
                        <div className="rating-section">
                            <label>Puntuación (1-5):</label>
                            <select
                                value={ratings[currentProductIndex].Rating}
                                onChange={(e) => handleRatingChange(currentProductIndex, 'Rating', parseInt(e.target.value))}
                            >
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="comment-section">
                            <label>Comentario:</label>
                            <textarea
                                value={ratings[currentProductIndex]?.Comment || ''}
                                onChange={(e) => handleRatingChange(currentProductIndex, 'Comment', e.target.value)}
                                placeholder="Tu opinión sobre este producto..."
                                rows={4}
                            />
                        </div>
                        
                        <div className="modal-actions">
                            <button 
                                onClick={skipReviews}
                                className="btn secondary"
                            >
                                Omitir valoraciones
                            </button>
                            <button
                                onClick={handleSubmitReview}
                                className="btn primary"
                            >
                                {currentProductIndex < carritos.length - 1 ? 'Siguiente' : 'Finalizar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
};

export default Carrito;