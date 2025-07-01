import React,{SyntheticEvent, useState} from 'react';
import {useProductos} from '../hooks/useProductos'
import { useUserProfile} from '../hooks/useUserProfile';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useCrearCarrito } from '../hooks/useCarrito';
import PersistentDrawerLeft from "../components/Pestañas";
import TablaPaginacionGenerica from "../components/TablaPaginacion";
import {BotonVerde} from "../components/BotonVerde";
import { useAgregarSaldo } from "../hooks/useUsuarios";
import { useCarritosComprador, usePrecioFinal, usePagarCarritos } from '../hooks/useCarrito';
import { useCrearValoracion } from '../hooks/useUsuarios';
import { useCrearTransaccion } from '../hooks/useTransaccion';
import { useCrearOrden } from '../hooks/useOrdenes';
import { useProductosVendedor, useCrearProducto, useEliminarProducto } from '../hooks/useProductos';
import { useCrearProveedor, useEliminarProveedor, useProveedoresVendedor, useCrearProductoProveedor, useProductoProveedor } from '../hooks/useProveedores';
import '../styles/Homegeneral.css'


export const Homegeneral = () => {
    const {token, setToken} = useAuth();
    const navigate = useNavigate();
    const { data: user, isLoading: cargauser, isError, refetch: refetchUser } = useUserProfile();
    const {data: productos, isLoading: cargaproducto} = useProductos();
    const { mutate: crearCarrito } = useCrearCarrito();
    const { mutate: agregarSaldo, isPending: isAddingBalance } = useAgregarSaldo();
    const [amount, setAmount] = useState('');
    const [balanceError, setBalanceError] = useState('');
    const { data: carritos, isLoading: cargandoCarritos, refetch: refetchCarritos } = useCarritosComprador(user?.PublicID);
    const { data: precioTotal, refetch: refetchPrecio } = usePrecioFinal(user?.PublicID);
    const { mutate: pagarCarritos, isPending: isPaying } = usePagarCarritos();
    const [errorPago, setErrorPago] = useState<string | null>(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [currentProductIndex, setCurrentProductIndex] = useState(0);
    const [ratings, setRatings] = useState<{Rating: number, Comment: string}[]>([]);
    const { mutate: crearValoracion } = useCrearValoracion();
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const crearTransaccion = useCrearTransaccion();
    const crearOrden = useCrearOrden();
    const saldoInsuficiente = user?.Balance < parseFloat(precioTotal);
    const [name, setNombre] = useState('');
    const [description, setDescripcion] = useState('');
    const [price, setPrecio] = useState('');
    const [vegan, setVegano] = useState('');
    const [vegetaria, setVegetariano] = useState('');
    const [gluten, setGluten] = useState('');
    const [caloria, setCalorias] = useState('');
    const [deliver, setEntrega] = useState('');
    const [isComestible, setIsComestible] = useState(false);
    const [filterCount, setFilterCount] = useState<number | null>(null);
    const [filterError, setFilterError] = useState('');
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState<number | null>(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [nameProveedor, setNombreProveedor] = useState('');
    const [descriptionProveedor, setDescripcionProveedor] = useState('');
    const { data: proveedores, isLoading: cargandoProveedores } = useProveedoresVendedor(user?.PublicID);
    const crearProv = useCrearProveedor();
    const crearRelacion = useCrearProductoProveedor();
    const eliminarProv = useEliminarProveedor();

    const { data: productosVendedor, isLoading: cargaProductosVendedor } = useProductosVendedor(user?.PublicID);
    const crearProd = useCrearProducto();
    const eliminarPrdo = useEliminarProducto();

    const crearProveedor = (e: SyntheticEvent) => {
        e.preventDefault();
        crearProv.mutate({
            Name: nameProveedor,
            Description: descriptionProveedor,
            SellerID: Number(user?.PublicID)
        });
        setNombreProveedor('');
        setDescripcionProveedor('');
    };

    const abrirModalAsociacion = (proveedorId: number) => {
        setProveedorSeleccionado(proveedorId);
        setMostrarModal(true);
    };

    const asociarProducto = (e: SyntheticEvent) => {
        e.preventDefault();
        if (proveedorSeleccionado && productoSeleccionado) {
            crearRelacion.mutate({
                SupplierID: proveedorSeleccionado,
                ProductID: Number(productoSeleccionado)
            }, {
                onSuccess: () => {
                    setMostrarModal(false);
                    setProductoSeleccionado('');
                }
            });
        }
    };

    const ProductosDeProveedor = ({ proveedorId }: { proveedorId: number }) => {
        const { data: productos, isLoading } = useProductoProveedor(proveedorId);

        if (isLoading) return <div>Cargando productos...</div>;

        return (
            <div style={{ marginLeft: '20px', marginTop: '5px' }}>
                <strong>Productos asociados:</strong>
                {productos?.length > 0 ? (
                    <ul>
                        {productos.map((p: any) => (
                            <li key={p.ID}>
                                <p>{p.Product.Name} - {p.Product.Description} - ${p.Product.Price} - {p.Product.ReviewScore}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay productos asociados</p>
                )}
            </div>
        );
    };

    const crear = (e: SyntheticEvent) => {
        e.preventDefault();
        crearProd.mutate({
            Name: name,
            Description: description,
            Price: Number(price),
            IsVegan: Boolean(vegan),
            IsVegetarian: Boolean(vegetaria),
            IsGlutenFree: Boolean(gluten),
            Calories: Number(caloria),
            Delivery: deliver,
            SellerID: Number(user?.PublicID)
        });
        setNombre('');
        setDescripcion('');
        setPrecio('');
        setVegano('');
        setVegetariano('');
        setGluten('');
        setCalorias('');
        setEntrega('');
    };

    const handleFilterChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        if (productosVendedor && num > productosVendedor.length) {
            setFilterError(`No tienes suficientes productos (máximo ${productosVendedor.length})`);
            return;
        }

        setFilterCount(num);
        setFilterError('');
    };

    const resetFilter = () => {
        setFilterCount(null);
        setFilterError('');
    };

    const filteredProductsVendedor = filterCount ? productosVendedor?.slice(0, filterCount) : productosVendedor;

    const handlePagar = async () => {
        if (!user?.PublicID || !carritos || carritos.length === 0) return;

        const total = parseFloat(precioTotal.message);
        if (user.Balance < total) {
            alert('Saldo insuficiente para realizar la compra');
            setErrorPago('Saldo insuficiente');
            return;
        }

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
                });

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

        } catch (error: any) {
            const mensaje = error.response?.data?.message || 'Error al procesar el pago';
            alert(`Error con el producto: ${mensaje}`);
            setErrorPago(mensaje);
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
    <div className="homegeneral-container"> 

        <div className="homegeneral-card">
            
            

            {user.RoleType === 1 && (
                <>
                    <PersistentDrawerLeft
                        userType={'usuario'}
                        sections={{
                            productos: (
                                <div>
                                    <h1 className="bienvenida">Bienvenid@: {user?.Name} {user.RoleType === 1 && (<>Tu saldo es: ${user?.Balance}</>)}</h1>
                                    <h1>Productos disponibles</h1>
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
                                    <TablaPaginacionGenerica
                                        filas={filteredProducts || []}
                                        columnas={[
                                            { field: 'Name', headerName: 'Producto', width: 200 },
                                            { field: 'Description', headerName: 'Descripcion', width: 150 },
                                            { field: 'Price', headerName: 'Precio', width: 100 },
                                            {
                                                field: 'IsVegan',
                                                headerName: '¿Es Vegano?',
                                                width: 150,
                                                renderCell: (params) => params.row.IsVegan ? 'Sí' : 'No'
                                            },
                                            {
                                                field: 'IsVegetarian',
                                                headerName: '¿Es Vegetariano?',
                                                width: 150,
                                                renderCell: (params) => params.row.IsVegetarian ? 'Sí' : 'No'
                                            },
                                            {
                                                field: 'IsGlutenFree',
                                                headerName: '¿Es libre de gluten?',
                                                width: 150,
                                                renderCell: (params) => params.row.IsGlutenFree ? 'Sí' : 'No'
                                            },
                                            { field: 'Calories', headerName: 'Calorías', width: 100 },
                                            { field: 'Delivery', headerName: 'Tipo de compra', width: 100 },
                                            {
                                                field: 'accion',
                                                headerName: 'Acción',
                                                width: 150,
                                                renderCell: (params) => (
                                                    <BotonVerde
                                                        onClick={() => handleBuyClick(params.row)}
                                                    >
                                                        Comprar
                                                    </BotonVerde>
                                                ),
                                            },
                                        ]}
                                        cantidad={"all"}
                                    />
                                </div>
                            ), recargarSaldo: (
                                <div>
                                    <h2>Recargar Saldo</h2>
                                    <p>Saldo actual: <strong>${user?.Balance}</strong></p>
                                    <form onSubmit={handleAddBalance}>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label>Monto a agregar:</label>
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="Ej: 10000"
                                                min="1"
                                                step="1"
                                                style={{
                                                    marginLeft: '10px',
                                                    padding: '8px',
                                                    width: '200px'
                                                }}
                                            />
                                        </div>
                                        {balanceError && <div style={{ color: 'red', marginBottom: '10px' }}>{balanceError}</div>}
                                        <BotonVerde
                                            type="submit"
                                            disabled={isAddingBalance}
                                            onClick={() => {}}
                                        >
                                            {isAddingBalance ? 'Procesando...' : 'Agregar saldo'}
                                        </BotonVerde>
                                    </form>
                                </div>
                            ), carrito: (
                                <div>
                                    <h2>Mi Carrito</h2>

                                    {carritos?.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '20px' }}>
                                            <p>No tienes productos en tu carrito.</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <h3>Productos en tu carrito:</h3>
                                            <div style={{ marginBottom: '20px' }}>
                                                {carritos?.map((carrito: any) => (
                                                    <div key={carrito.ID} style={{
                                                        border: '1px solid #ddd',
                                                        padding: '15px',
                                                        marginBottom: '10px',
                                                        borderRadius: '8px'
                                                    }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div>
                                                                <h4>{carrito.Product.Name}</h4>
                                                                <p>Cantidad: {carrito.Quantity}</p>
                                                                <p>Precio: ${carrito.FinalPrice}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div style={{
                                                backgroundColor: '#f5f5f5',
                                                padding: '15px',
                                                borderRadius: '8px',
                                                marginBottom: '20px'
                                            }}>
                                                <p>Tu saldo actual: <strong>${user?.Balance}</strong></p>
                                                <p>Total de la compra: <strong>${typeof precioTotal === 'object' ? precioTotal.message : precioTotal || '0'}</strong></p>
                                            </div>

                                            <BotonVerde
                                                onClick={handlePagar}
                                                disabled={isPaying || carritos?.length === 0}
                                            >
                                                {isPaying ? 'Procesando...' : saldoInsuficiente ? 'Saldo insuficiente' : 'Pagar ahora'}
                                            </BotonVerde>

                                            {errorPago && (
                                                <div style={{ color: 'red', marginTop: '10px' }}>
                                                    {errorPago}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {showReviewModal && carritos && ratings.length > 0 && (
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
                                                padding: '30px',
                                                borderRadius: '8px',
                                                width: '400px',
                                                maxHeight: '500px',
                                                overflow: 'auto'
                                            }}>
                                                <h3>Valorar producto {currentProductIndex + 1} de {carritos.length}</h3>
                                                <h4>{carritos[currentProductIndex].Product.Name}</h4>

                                                <div style={{ marginBottom: '15px' }}>
                                                    <label>Puntuación (1-5):</label>
                                                    <select
                                                        value={ratings[currentProductIndex].Rating}
                                                        onChange={(e) => handleRatingChange(currentProductIndex, 'Rating', parseInt(e.target.value))}
                                                        style={{ marginLeft: '10px', padding: '5px' }}
                                                    >
                                                        {[1, 2, 3, 4, 5].map(num => (
                                                            <option key={num} value={num}>{num}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div style={{ marginBottom: '20px' }}>
                                                    <label>Comentario:</label>
                                                    <textarea
                                                        value={ratings[currentProductIndex]?.Comment || ''}
                                                        onChange={(e) => handleRatingChange(currentProductIndex, 'Comment', e.target.value)}
                                                        placeholder="Tu opinión sobre este producto..."
                                                        rows={4}
                                                        style={{
                                                            width: '100%',
                                                            padding: '8px',
                                                            marginTop: '5px',
                                                            borderRadius: '4px',
                                                            border: '1px solid #ddd'
                                                        }}
                                                    />
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <button
                                                        onClick={() => {
                                                            setShowReviewModal(false);
                                                            completePaymentProcess();
                                                        }}
                                                        style={{
                                                            padding: '8px 15px',
                                                            backgroundColor: '#f44336',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Omitir valoraciones
                                                    </button>
                                                    <BotonVerde onClick={handleSubmitReview}>
                                                        {currentProductIndex < carritos.length - 1 ? 'Siguiente' : 'Finalizar'}
                                                    </BotonVerde>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ), misProductos: (
                                <div>
                                    <h1>Mis productos en venta</h1>
                                    <div style={{margin: '20px 0'}}>
                                        <h3>Filtrar productos</h3>
                                        <div>
                                            <input
                                                type="number"
                                                placeholder='Cantidad de productos a mostrar...'
                                                value={filterCount || ''}
                                                onChange={handleFilterChange2}
                                                min="1"
                                            />
                                            <BotonVerde onClick={resetFilter} style={{marginLeft: '10px'}}>
                                                Reiniciar filtro
                                            </BotonVerde>
                                        </div>
                                        {filterError && <p style={{color: 'red'}}>{filterError}</p>}
                                    </div>

                                    <TablaPaginacionGenerica
                                        filas={filteredProductsVendedor || []}
                                        columnas={[
                                            { field: 'Name', headerName: 'Producto', width: 200 },
                                            { field: 'Description', headerName: 'Descripcion', width: 150 },
                                            { field: 'Price', headerName: 'Precio', width: 100 },
                                            {
                                                field: 'IsVegan',
                                                headerName: '¿Es Vegano?',
                                                width: 150,
                                                renderCell: (params) => params.row.IsVegan ? 'Sí' : 'No'
                                            },
                                            {
                                                field: 'IsVegetarian',
                                                headerName: '¿Es Vegetariano?',
                                                width: 150,
                                                renderCell: (params) => params.row.IsVegetarian ? 'Sí' : 'No'
                                            },
                                            {
                                                field: 'IsGlutenFree',
                                                headerName: '¿Es libre de gluten?',
                                                width: 150,
                                                renderCell: (params) => params.row.IsGlutenFree ? 'Sí' : 'No'
                                            },
                                            { field: 'Calories', headerName: 'Calorías', width: 100 },
                                            { field: 'Delivery', headerName: 'Tipo de compra', width: 100 },
                                            {
                                                field: 'accion',
                                                headerName: 'Acción',
                                                width: 150,
                                                renderCell: (params) => (
                                                    <BotonVerde
                                                        onClick={() => eliminarPrdo.mutate(params.row.ID)}
                                                    >
                                                        Eliminar
                                                    </BotonVerde>
                                                ),
                                            },
                                        ]}
                                        cantidad={"all"}
                                    />

                                    <h3>Vender nuevo producto: </h3>
                                    <form onSubmit={crear}>
                                        <input type="text" placeholder='Nombre del producto...' value={name} onChange={(e)=> setNombre(e.target.value)} required/>
                                        <input type="number" placeholder='Precio del producto...' value={price} onChange={(e)=> setPrecio(e.target.value)} required/>
                                        <input type="text" placeholder='Descripcion del producto...' value={description} onChange={(e)=> setDescripcion(e.target.value)} required/>

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

                                        <BotonVerde onClick={() => {} } type="submit"> Agregar</BotonVerde>
                                    </form>

                                </div>
                            ), misProveedores: (
                                <div>
                                    <h1>Tus Proveedores</h1>

                                    {cargandoProveedores ? (
                                        <p>Cargando proveedores...</p>
                                    ) : (
                                        <>
                                            {proveedores?.length > 0 ? (
                                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                                    {proveedores.map((p: any) => (
                                                        <li key={p.ID} style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                                            <div>
                                                                <strong>{p.Name}</strong> - {p.Description}
                                                                <div style={{ marginTop: '5px' }}>
                                                                    <BotonVerde
                                                                        onClick={() => eliminarProv.mutate(p.ID)}
                                                                    >
                                                                        Eliminar
                                                                    </BotonVerde>
                                                                    <BotonVerde
                                                                        onClick={() => abrirModalAsociacion(p.ID)}
                                                                    >
                                                                        Asociar Producto
                                                                    </BotonVerde>
                                                                </div>
                                                                <ProductosDeProveedor proveedorId={p.ID} />
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No hay proveedores registrados</p>
                                            )}
                                        </>
                                    )}

                                    {mostrarModal && (
                                        <div style={{
                                            position: 'fixed',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            zIndex: 1000
                                        }}>
                                            <div style={{
                                                backgroundColor: 'white',
                                                padding: '20px',
                                                borderRadius: '5px',
                                                width: '350px'
                                            }}>
                                                <h3>Asociar Producto</h3>
                                                <p>Selecciona un producto para asociar:</p>

                                                <select
                                                    value={productoSeleccionado}
                                                    onChange={(e) => setProductoSeleccionado(e.target.value)}
                                                    style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
                                                >
                                                    <option value="">-- Seleccione un producto --</option>
                                                    {productosVendedor?.map((producto: any) => (
                                                        <option key={producto.ID} value={producto.ID}>
                                                            {producto.Name}
                                                        </option>
                                                    ))}
                                                </select>

                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                                    <button
                                                        onClick={() => {
                                                            setMostrarModal(false);
                                                            setProductoSeleccionado('');
                                                        }}
                                                        style={{ padding: '5px 10px' }}
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        onClick={asociarProducto}
                                                        disabled={!productoSeleccionado}
                                                        style={{ padding: '5px 10px' }}
                                                    >
                                                        Asociar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <h3>Agregar proveedor</h3>
                                    <form onSubmit={crearProveedor}>
                                        <input
                                            type="text"
                                            placeholder='Nombre del proveedor...'
                                            value={nameProveedor}
                                            onChange={(e) => setNombreProveedor(e.target.value)}
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder='Descripcion del proveedor...'
                                            value={descriptionProveedor}
                                            onChange={(e) => setDescripcionProveedor(e.target.value)}
                                            required
                                        />
                                        <BotonVerde onClick={() => {}} type="submit">Agregar</BotonVerde>
                                    </form>
                                </div>
                            )
                        }}
                    />
                </>

            )}

            

            { user.RoleType === 2 && (
                <div className="botones">
                    <h1>Bienvenid@!: {user.Name}</h1>
                    <button onClick={()=> navigate('/Repartidores')}>Vista de repartidor</button>
                    <button onClick={logout}> Cerrar sesión </button>
                </div>
                
            )}

            { user.RoleType === 3 && (
                <div className="botones">
                    <h1>Bienvenid@!: {user.Name}</h1>
                    <button onClick={()=> navigate('/AdminDashboard')}>Vista de admin</button>
                    <button onClick={logout}> Cerrar sesión </button>
                </div>
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
    </div>
    );
    
};

export default Homegeneral;