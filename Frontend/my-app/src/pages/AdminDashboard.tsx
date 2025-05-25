import React, {SyntheticEvent,useState} from 'react';
import { useUsuarios, useCrearUsuario, useEliminarUsuario} from '../hooks/useUsuarios';
import { useNavigate } from 'react-router-dom';
import { useTransacciones, useMontoTotal, useTopVendedores } from '../hooks/useTransaccion';
import { useProductosMasComprados } from '../hooks/useCarrito';

export const AdminDashboard = () => {
    const {data: usuarios, isLoading} = useUsuarios();
    const {data: montoTotal, isLoading: isLoadingMonto} = useMontoTotal();
    const {data: topVendedores, isLoading: isLoadingVentas} = useTopVendedores();
    const {data: transacciones, isLoading: isLoadingTransac} = useTransacciones();
    const {data: topProductos, isLoading: isLoadingProductos} = useProductosMasComprados();

    const crearUsuario = useCrearUsuario();
    const eliminarUsuario = useEliminarUsuario();
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contrasenha, setContrasenha] = useState('');
    

    const crear = (e:SyntheticEvent) => {
        e.preventDefault();
        crearUsuario.mutate({nombre: name, correo: email, password: contrasenha, tipo: 3});
        setName('');
        setEmail('');
        setContrasenha('');
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

            {isLoading? (
                <p>Cargando los usuarios...</p>
            ): (
            <>

                <h2> Usuarios Registrados </h2>
                {usuarios?.length > 0 ? ( 
                    <ul>
                        {usuarios?.map((u:any, indice:number) => (
                            <li key={u._id || indice}>
                                {u.name} - {u.email}
                                <button onClick={()=> eliminarUsuario.mutate(u._id)}>Eliminar</button>
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

                <button type="submit">Agregar</button>
            </form>



        </div>
    );
};