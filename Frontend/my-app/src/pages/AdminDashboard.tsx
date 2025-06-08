import React, {SyntheticEvent,useState} from 'react';
import { useUsuarios, useCrearUsuario, useEliminarUsuario} from '../hooks/useUsuarios';
import { useNavigate } from 'react-router-dom';
import { useTransacciones, useMontoTotal, useTopVendedores } from '../hooks/useTransaccion';
import { useProductosMasComprados } from '../hooks/useCarrito';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { useEnvios, useEnviosEntregados } from '../hooks/useEnvios';
import { useProductos } from '../hooks/useProductos';
import { useOrdenesAdmin, useOrdenes } from '../hooks/useOrdenes';

export const AdminDashboard = () => {
    
    const {token, setToken} = useAuth();
    const {data: user, isLoading: cargauser, isError} = useUserProfile();
    const [cantidadUsuarios, setCantidadUsuarios] = useState<string>('all');
    const [cantidadVendedores, setCantidadVendedores] = useState<string>('3');
    const [cantidadProductos, setCantidadProductos] = useState<string>('3');
    const {data: usuarios, isLoading} = useUsuarios(cantidadUsuarios);
    const {data: montoTotal, isLoading: isLoadingMonto} = useMontoTotal();
    const {data: topVendedores, isLoading: isLoadingVendedores} = useTopVendedores(cantidadVendedores);
    const {data: transacciones, isLoading: isLoadingTransac} = useTransacciones();
    const {data: topProductos, isLoading: isLoadingProductos} = useProductosMasComprados(cantidadProductos);
    const {data: envios, isLoading: isLoadingEnvios} = useEnvios();
    const {data: enviosEntregados, isLoading: isLoadingEntregados} = useEnviosEntregados();
    const {data: productos, isLoading: isLoadingTodosProductos} = useProductos();
    const {data: ordenes, isLoading: isLoadingTodasOrdenes} = useOrdenesAdmin();
    const {data: ordenesVigentes, isLoading: isLoadingOrdenesVigentes} = useOrdenes();
    const [error, setError] = useState<string>(''); 
    const [inputValue, setInputValue] = useState('');

    const crearUsuario = useCrearUsuario();
    const eliminarUsuario = useEliminarUsuario();
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contrasenha, setContrasenha] = useState('');
    const [direcc, setDireccion] = useState('');
    const [telefo, setTelefono] = useState('');


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

    const crear = (e:SyntheticEvent) => {
        e.preventDefault();
        crearUsuario.mutate({Name: name, Email: email, Password: contrasenha, RoleType: 3, Address: direcc, Phone: telefo});
        setName('');
        setEmail('');
        setContrasenha('');
        setDireccion('');
        setTelefono('');
    };

    const handleConfirmar = () => {
    if (inputValue === 'all') {
        setCantidadUsuarios('all');
        setError('');
    } else if (/^\d+$/.test(inputValue)) {
        setCantidadUsuarios(inputValue);
        setError('');
    } else {
        setError('Por favor ingresa un número o haz clic en "Mostrar todos"');
    }
};

    return (
        <div>
            <h1>Administracion de Usuarios</h1>
            <button onClick={() => navigate('/Homegeneral')}> volver al perfil</button>

            {isLoadingMonto? (
                <p>Cargando Monto total...</p>
            ): (
            <>
                <h2> Monto total transferido en el sistema: </h2>
                {montoTotal.total_amount}
                
            </>
            )}

            {isLoadingVendedores? (
                <p>Cargando top vendedores...</p>
            ): (
            <>
                <h2> Top vendedores: </h2>
                <div style={{marginBottom: '10px'}}>
                    <input 
                        type="number" 
                        placeholder="Cantidad o 'all'" 
                        value={cantidadVendedores}
                        onChange={(e) => setCantidadVendedores(e.target.value)}
                        style={{marginRight: '10px'}}
                    />
                    <button onClick={() => setCantidadVendedores('all')}>
                        Mostrar todos
                    </button>
                </div>
                {topVendedores?.length > 0 ? ( 
                    <ul>
                        {topVendedores?.map((v: any) => (
                            <li key={v.PublicID}>
                                {v.Name} - {v.Email} - Puntuación promedio del vendedor: {v.ReviewScore}
                            </li>
                        ))}
                    </ul>
                ) : (<p>No hay compras en el sistema...</p>)
                }
            </>
            )}

            {isLoadingProductos? (
                <p>Cargando top productos...</p>
            ): (
            <>
                <h2> Top productos: </h2>
                <div style={{marginBottom: '10px'}}>
                    <input 
                        type="number" 
                        placeholder="Cantidad o 'all'" 
                        value={cantidadProductos}
                        onChange={(e) => setCantidadProductos(e.target.value)}
                        style={{marginRight: '10px'}}
                    />
                    <button onClick={() => setCantidadProductos('all')}>
                        Mostrar todos
                    </button>
                </div>
                {topProductos?.length > 0 ? ( 
                    <ul>
                        {topProductos?.map((p: any) => (
                            <li key={p.ID}>
                                <p>{p.Name} - {p.Description} - Precio del producto: {p.Price} - Puntuación promedio del producto: {p.ReviewScore} - cantidad vendida: {p.QuantitySold}</p>
                            </li>
                        ))}
                    </ul>
                ) : (<p>No hay compras en el sistema...</p>)
                }
            </>
            )}

            <h2>Productos</h2>
            {isLoadingTodosProductos? (
                <p>Cargando los productos...</p>
            ): (
            <>
                {productos?.length > 0 ? ( 
                    <ul>
                        {productos.map((producto: any) => (
                        <li key = {producto.ID}>
                            <p>{producto.Name} - {producto.Description} Precio del producto: {producto.Price} - Puntuación promedio del producto: {producto.ReviewScore} - Cantidad vendida: {producto.QuantitySold}</p>
                        </li>
                    ))}
                    </ul>
                ) : (<p>No hay envios entregados.</p>)
                }
            </>
            )}

            <h2>Envios vigentes </h2>
            {isLoadingEnvios? (
                <p>Cargando los envios...</p>
            ): (
            <>
                {envios?.length > 0 ? ( 
                    <ul>
                        {envios.map((envio: any) => (
                        <li key = {envio.ID}>
                            <p>Repartidor: {envio.Delivery.Name} - Estado del envio: {envio.Status} - Dirección de entrega: {envio.Buyer.Address} - Teléfono del cliente: {envio.Buyer.Phone}</p>
                        </li>
                    ))}
                    </ul>
                ) : (<p>No hay envios vigentes.</p>)
                }
            </>
            )}

            <h2>Envios entregados </h2>
            {isLoadingEntregados? (
                <p>Cargando los envios...</p>
            ): (
            <>
                {enviosEntregados?.length > 0 ? ( 
                    <ul>
                        {enviosEntregados.map((envio: any) => (
                        <li key = {envio.ID}>
                            <p>Repartidor: {envio.Delivery.Name} - Estado del envio: {envio.Status} - Dirección de entrega: {envio.Buyer.Address} - Teléfono del cliente: {envio.Buyer.Phone}</p>
                        </li>
                    ))}
                    </ul>
                ) : (<p>No hay envios entregados.</p>)
                }
            </>
            )}

            {isLoadingTransac? (
                <p>Cargando transacciones...</p>
            ): (
            <>
                <h2> Todas las transacciones en el sistema: </h2>
                {transacciones?.length > 0 ? ( 
                    <ul>
                        {transacciones.map((t: any) => (
                            <li key={t.ID}>
                                <p>{t.Name} - Fecha de la transacción: {t.Date} - Monto total de la transacción: {t.Amount} - Correo del vendedor: {t.Seller.Email} - Correo del comprador: {t.Buyer.Email}</p>
                            </li>
                        ))}
                    </ul>
                ) : (<p>No hay compras en el sistema...</p>)
                }
            </>
            )}

            {isLoadingTodasOrdenes? (
                <p>Cargando ordenes...</p>
            ): (
            <>
                <h2> Ordenes pasadas: </h2>
                {ordenes?.length > 0 ? ( 
                    <ul>
                        {ordenes.map((orden: any) => (
                            <li key={orden.ID}>
                                <p>Fecha de entrega: {orden.Date} - Estado de la orden: {orden.Status} - Dirección de entrega: {orden.Buyer.Address} - Número del cliente: {orden.Buyer.Phone} - Tienda: {orden.Seller.Name} - Dirección tienda: {orden.Seller.Address}</p>
                            </li>
                        ))}
                    </ul>
                ) : (<p>No hay ordenes en el sistema.</p>)
                }
            </>
            )}

            {isLoadingOrdenesVigentes? (
                <p>Cargando ordenes...</p>
            ): (
            <>
                <h2> Ordenes vigentes: </h2>
                {ordenesVigentes?.length > 0 ? ( 
                    <ul>
                        {ordenesVigentes.map((orden: any) => (
                            <li key={orden.ID}>
                                <p>Fecha de entrega: {orden.Date} - Estado de la orden: {orden.Status} - Dirección de entrega: {orden.Buyer.Address} - Número del cliente: {orden.Buyer.Phone} - Tienda: {orden.Seller.Name} - Dirección tienda: {orden.Seller.Address}</p>
                            </li>
                        ))}
                    </ul>
                ) : (<p>No hay ordenes en el sistema.</p>)
                }
            </>
            )}

                {isLoading ? (
    <p>Cargando los usuarios...</p>
    ) : (
    <>
        <h2>Usuarios Registrados</h2>
        <div>
        <input 
            type="text" 
            placeholder="Cantidad o 'all'" 
            value={inputValue}
            onChange={(e) => {
            setInputValue(e.target.value);
          
            if (e.target.value && e.target.value !== 'all' && !/^\d*$/.test(e.target.value)) {
                setError('Solo números o "all"');
            } else {
                setError('');
            }
            }}
            style={{flex: 1}}
        />
      
        <button 
            onClick={handleConfirmar}
            style={{padding: '5px 15px'}}
        >
            Confirmar
        </button>
      
        <button 
            onClick={() => {
            setInputValue('');
            setCantidadUsuarios('all');
            setError('');
            }}
            style={{padding: '5px 15px'}}
        >
            Mostrar todos
        </button>
        </div>
    
        {error && <div style={{color: 'red', marginTop: '5px'}}>{error}</div>}

    
        <div key={`user-list-${cantidadUsuarios}`}>
        {usuarios?.length > 0 ? ( 
            <ul>
            {usuarios.map((c: any) => (
                <li key={c.PublicID}>
                {c.Name} - {c.Email}
                <button onClick={() => eliminarUsuario.mutate(c.PublicID)}>Banear usuario</button>
                </li>
            ))}
            </ul>
            ) : (<p>No hay usuarios registrados...</p>)}
            </div>
        </>
        )}


            <h3>Crear nuevo presidente: </h3>
            <form onSubmit={crear}>
                <input type = "text" placeholder="Nombre de la cuenta..." value={name} onChange={(e)=> setName(e.target.value)} required />

                <input type = "email" placeholder="Correo de la cuenta..." value={email} onChange={(e)=> setEmail(e.target.value)} required />

                <input type = "password" placeholder="ContraseÃ±a de la cuenta..." value={contrasenha} onChange={(e)=> setContrasenha(e.target.value)} required />

                <input type = "text" placeholder="Su dirección..." value={direcc} onChange={(e)=> setDireccion(e.target.value)} required />

                <input type = "text" placeholder="Su telefono..." value={telefo} onChange={(e)=> setTelefono(e.target.value)} required />

                <button type="submit">Agregar</button>
            </form>



        </div>
    );
};