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
                                {v.Name} - {v.Email}
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
                                {p.Name} - {p.Description} -<p>Precio del producto: </p>- {p.Price} -<p>Puntuación promedio del producto: </p>- {p.ReviewScore}
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
                            {producto.Name} - {producto.Description} -<p>Precio del producto: </p>- {producto.Price} -<p>Puntuación promedio del producto: </p>- {producto.ReviewScore} -<p>Cantidad vendida: </p>{producto.Amount}
                            {console.log(producto.ID)}
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
                            <p>Repartidor: </p> {envio.Delivery.Name} - <p>Estado del envio: </p> {envio.Status} - <p>Dirección de entrega: </p> {envio.Buyer.Address} - <p>Teléfono del cliente: </p> {envio.Buyer.Phone}
                            {console.log(envio.ID)}
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
                            <p>Repartidor: </p> {envio.Delivery.Name} - <p>Estado del envio: </p> {envio.Status} - <p>Dirección de entrega: </p> {envio.Buyer.Address} - <p>Teléfono del cliente: </p> {envio.Buyer.Phone}
                            {console.log(envio.ID)}
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
                                {t.Name} -<p>Fecha de la transacción: </p>- {t.Date} -<p>Monto total de la transacción: </p>- {t.Amount} -<p>Correo del vendedor: </p>- {t.Seller.Email} -<p>Correo del comprador: </p>- {t.Buyer.Email}
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
                                <p>Fecha de entrega: </p> {orden.Date} - <p>Estado de la orden: </p> {orden.Status} - <p>Dirección de entrega: </p> <strong>{orden.Buyer.Address}</strong> - <p>Número del cliente: </p> {orden.Buyer.Phone}
                                <p>Tienda: </p> {orden.Seller.Name} - <p>Dirección tienda: </p> {orden.Seller.Address}
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
                                <p>Fecha de entrega: </p> {orden.Date} - <p>Estado de la orden: </p> {orden.Status} - <p>Dirección de entrega: </p> <strong>{orden.Buyer.Address}</strong> - <p>Número del cliente: </p> {orden.Buyer.Phone}
                                <p>Tienda: </p> {orden.Seller.Name} - <p>Dirección tienda: </p> {orden.Seller.Address}
                            </li>
                        ))}
                    </ul>
                ) : (<p>No hay ordenes en el sistema.</p>)
                }
            </>
            )}

            {isLoading? (
                <p>Cargando los usuarios...</p>
            ): (
            <>
                <h2> Usuarios Registrados </h2>
                <div style={{marginBottom: '10px'}}>
                    <input 
                        type="number" 
                        placeholder="Cantidad o 'all'" 
                        value={cantidadUsuarios}
                        onChange={(e) => setCantidadUsuarios(e.target.value)}
                        style={{marginRight: '10px'}}
                    />
                    <button onClick={() => setCantidadUsuarios('all')}>
                        Mostrar todos
                    </button>
                </div>
                {usuarios?.length > 0 ? ( 
                    <ul>
                        {usuarios.map((c: any) => (
                            <li key={c.PublicID}>
                                {c.Name} - {c.Email}
                                <button onClick={()=> eliminarUsuario.mutate(c.PublicID)}>Banear usuario</button>
                            </li>
                        ))}
                    </ul>
                ) : (<p>No hay usuarios registrados...</p>)
                }
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