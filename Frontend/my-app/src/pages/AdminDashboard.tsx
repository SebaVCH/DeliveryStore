import React, {SyntheticEvent,useState} from 'react';
import { useUsuarios, useCrearUsuario, useEliminarUsuario} from '../hooks/useUsuarios';
import { useNavigate } from 'react-router-dom';
import { useTransacciones, useMontoTotal, useTopVendedores } from '../hooks/useTransaccion';
import { useProductosMasComprados } from '../hooks/useCarrito';
import { useAuth } from '../context/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';

export const AdminDashboard = () => {
    const {data: usuarios, isLoading} = useUsuarios();
    const {data: montoTotal, isLoading: isLoadingMonto} = useMontoTotal();
    const {data: topVendedores, isLoading: isLoadingVendedores} = useTopVendedores();
    const {data: transacciones, isLoading: isLoadingTransac} = useTransacciones();
    const {data: topProductos, isLoading: isLoadingProductos} = useProductosMasComprados();

    const {data: user, isLoading: cargauser, isError} = useUserProfile();
    const {token, setToken} = useAuth();

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
            <button onClick={() => navigate('/Home')}> volver al perfil</button>

            {isLoadingMonto? (
                <p>Cargando Monto total...</p>
            ): (
            <>
                <h2> Monto total transferido en el sistema: </h2>
                {montoTotal?.length > 0 ? ( 
                    <ul>
                        {montoTotal?.map((u: any) => (
                            <li key={u.monto}>
                                {u.monto}
                            </li>
                        ))}
                    </ul>
                ) : (<p>No hay compras en el sistema...</p>)
                }
            </>
            )}

            {isLoadingVendedores? (
                <p>Cargando top vendedores...</p>
            ): (
            <>
                <h2> Top 3 vendedores que más venden: </h2>
                {topVendedores?.length > 0 ? ( 
                    <ul>
                        {topVendedores?.map((v: any) => (
                            <li key={v.identificador}>
                                {v.nombre} - {v.correo}
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
                <h2> Top 3 productos más vendidos: </h2>
                {topProductos?.length > 0 ? ( 
                    <ul>
                        {topProductos?.map((p: any) => (
                            <li key={p.id}>
                                {p.nombre} - {p.descripcion} -<p>Precio del producto: </p>- {p.precio} -<p>Puntuación promedio del producto: </p>- {p.puntuacion_promedio}
                            </li>
                        ))}
                    </ul>
                ) : (<p>No hay compras en el sistema...</p>)
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
                        {transacciones?.map((t: any) => (
                            <li key={t.id}>
                                {t.nombre_producto} -<p>Fecha de la transacción: </p>- {t.fecha} -<p>Monto total de la transacción: </p>- {t.monto_total} -<p>Correo del vendedor: </p>- {t.vendedor.correo} -<p>Correo del comprador: </p>- {t.comprador.correo}
                            </li>
                        ))}
                    </ul>
                ) : (<p>No hay compras en el sistema...</p>)
                }
            </>
            )}

            {isLoading? (
                <p>Cargando los usuarios...</p>
            ): (
            <>

                <h2> Usuarios Registrados </h2>
                {usuarios?.length > 0 ? ( 
                    <ul>
                        {usuarios?.map((c: any) => (
                            <li key={c.identificador}>
                                {c.nombre} - {c.correo}
                                <button onClick={()=> eliminarUsuario.mutate(c.identificador)}>Banear usuario</button>
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