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
import GraficoCircular from "../components/GraficoCircular";
import TablaPaginacionGenerica from "../components/TablaPaginacion";
import PersistentDrawerLeft from "../components/Pestañas";
import {BotonVerde} from "../components/BotonVerde";

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
            <div>
                <PersistentDrawerLeft
                    userType="admin"
                    sections={{
                        usuarios: (
                            <>
                                {isLoading ? (
                                    <p>Cargando los usuarios...</p>
                                ) : (
                                    <>
                                        <h2>Usuarios Registrados</h2>
                                        <TablaPaginacionGenerica
                                            filas={usuarios || []}
                                            columnas={[
                                                { field: 'Name', headerName: 'Nombre', width: 200 },
                                                { field: 'Email', headerName: 'Correo', width: 250 },
                                                {
                                                    field: 'accion',
                                                    headerName: 'Acción',
                                                    width: 150,
                                                    renderCell: (params) => (
                                                        <BotonVerde onClick={() => eliminarUsuario.mutate(Number(params.row.PublicID))} >
                                                            Banear usuario
                                                        </BotonVerde>
                                                    ),
                                                },
                                            ]}
                                            cantidad={cantidadUsuarios}
                                        />
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

                                            <BotonVerde
                                                onClick={handleConfirmar}
                                            >
                                                Confirmar
                                            </BotonVerde>

                                            <BotonVerde
                                                onClick={() => {
                                                    setInputValue('');
                                                    setCantidadUsuarios('all');
                                                    setError('');
                                                }}
                                            >
                                                Mostrar todos
                                            </BotonVerde>
                                        </div>

                                        {error && <div style={{color: 'red', marginTop: '5px'}}>{error}</div>}
                                    </>
                                )}
                                <h3>Crear nuevo presidente: </h3>
                                <form onSubmit={crear}>
                                    <input type = "text" placeholder="Nombre de la cuenta..." value={name} onChange={(e)=> setName(e.target.value)} required />

                                    <input type = "email" placeholder="Correo de la cuenta..." value={email} onChange={(e)=> setEmail(e.target.value)} required />

                                    <input type = "password" placeholder="ContraseÃ±a de la cuenta..." value={contrasenha} onChange={(e)=> setContrasenha(e.target.value)} required />

                                    <input type = "text" placeholder="Su dirección..." value={direcc} onChange={(e)=> setDireccion(e.target.value)} required />

                                    <input type = "text" placeholder="Su telefono..." value={telefo} onChange={(e)=> setTelefono(e.target.value)} required />

                                    <BotonVerde
                                        onClick={() => {}}
                                        style={{ marginTop: '10px' }}
                                        type="submit"
                                    >
                                        Agregar
                                    </BotonVerde>
                                </form>
                            </>
                        ),
                        vendedores: (
                            <>
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
                                            <BotonVerde onClick={() => setCantidadVendedores('all')}>
                                                Mostrar todos
                                            </BotonVerde>
                                        </div>
                                        <TablaPaginacionGenerica
                                            filas={topVendedores || []}
                                            columnas={[
                                                { field: 'Name', headerName: 'Nombre', width: 200 },
                                                { field: 'Email', headerName: 'Correo', width: 250 },
                                                { field: 'ReviewScore', headerName: 'Puntuacion', width: 120 },
                                            ]}
                                            cantidad={cantidadVendedores}
                                            onCantidadChange={setCantidadVendedores}
                                        />
                                    </>
                                )}
                            </>
                        ),
                        productos: (
                            <>
                                {isLoadingProductos? (
                                    <p>Cargando top productos...</p>
                                ): (
                                    <>
                                        <h2> Top productos: </h2>
                                        {topProductos?.length > 0 && (
                                            <GraficoCircular
                                                data={topProductos.map((p: any) => ({
                                                    label: p.Name,
                                                    value: p.QuantitySold,
                                                }))}
                                                height={250}
                                                width={250}
                                            />
                                        )}
                                        <TablaPaginacionGenerica
                                            filas={topProductos || []}
                                            columnas={[
                                                { field: 'Name', headerName: 'Nombre', width: 200 },
                                                { field: 'Description', headerName: 'Descripción', width: 250 },
                                                { field: 'Price', headerName: 'Precio', width: 120 },
                                                { field: 'ReviewScore', headerName: 'Puntuación', width: 120 },
                                                { field: 'QuantitySold', headerName: 'Cantidad Vendida', width: 150 },
                                            ]}
                                            cantidad={cantidadProductos}
                                            onCantidadChange={setCantidadProductos}
                                        />
                                        <div style={{marginBottom: '10px'}}>
                                            <input
                                                type="number"
                                                placeholder="Cantidad o 'all'"
                                                value={cantidadProductos}
                                                onChange={(e) => setCantidadProductos(e.target.value)}
                                                style={{marginRight: '10px'}}
                                            />
                                            <BotonVerde onClick={() => setCantidadProductos('all')}>
                                                Mostrar todos
                                            </BotonVerde>
                                        </div>
                                    </>
                                )}
                            </>
                        ),
                        envios: (
                            <>
                                <h2>Envios vigentes </h2>
                                {isLoadingEnvios? (
                                    <p>Cargando los envios...</p>
                                ): (
                                    <>
                                        <TablaPaginacionGenerica
                                            filas={envios || []}
                                            columnas={[
                                                { field: 'Delivery_Name', headerName: 'Nombre del repartidor', width: 200},
                                                { field: 'Status', headerName: 'Estado del envio', width: 200 },
                                                { field: 'Buyer_Address', headerName: 'Dirección de entrega', width: 200 },
                                                { field: 'Buyer_Phone', headerName: 'Teléfono del cliente', width: 200 },
                                            ]}
                                            cantidad= '5'
                                        />
                                    </>
                                )}

                                <h2>Envios entregados </h2>
                                {isLoadingEntregados? (
                                    <p>Cargando los envios...</p>
                                ): (
                                    <>
                                        <TablaPaginacionGenerica
                                            filas={enviosEntregados || []}
                                            columnas={[
                                                { field: 'Delivery_Name', headerName: 'Nombre del repartidor', width: 200},
                                                { field: 'Status', headerName: 'Estado del envio', width: 200 },
                                                { field: 'Buyer_Address', headerName: 'Dirección de entrega', width: 200 },
                                                { field: 'Buyer_Phone', headerName: 'Teléfono del cliente', width: 200 },
                                            ]}
                                            cantidad= '5'
                                        />
                                    </>
                                )}
                            </>
                        ),
                        ordenes: (
                            <>
                                {isLoadingTodasOrdenes? (
                                    <p>Cargando ordenes...</p>
                                ): (
                                    <>
                                        <h2> Ordenes pasadas: </h2>
                                        <TablaPaginacionGenerica
                                            filas={ordenes || []}
                                            columnas={[
                                                { field: 'Date', headerName: 'Fecha', width: 200},
                                                { field: 'Buyer_Address', headerName: 'Dirección de entrega', width: 200 },
                                                { field: 'Buyer_Phone', headerName: 'Teléfono del cliente', width: 200 },
                                                { field: 'Seller_Name', headerName: 'Tienda', width: 200 },
                                                { field: 'Seller_Address', headerName: 'Direccion Tienda', width: 200 },
                                            ]}
                                            cantidad= '5'
                                        />
                                    </>
                                )}

                                {isLoadingOrdenesVigentes? (
                                    <p>Cargando ordenes...</p>
                                ): (
                                    <>
                                        <h2> Ordenes vigentes: </h2>
                                        <TablaPaginacionGenerica
                                            filas={ordenesVigentes || []}
                                            columnas={[
                                                { field: 'Date', headerName: 'Fecha', width: 200},
                                                { field: 'Status', headerName: 'Estado del envio', width: 200 },
                                                { field: 'Buyer_Address', headerName: 'Dirección de entrega', width: 200 },
                                                { field: 'Buyer_Phone', headerName: 'Teléfono del cliente', width: 200 },
                                                { field: 'Seller_Name', headerName: 'Tienda', width: 200 },
                                                { field: 'Seller_Address', headerName: 'Direccion Tienda', width: 200 },
                                            ]}
                                            cantidad= '5'
                                        />
                                    </>
                                )}
                            </>
                        ),
                        transacciones: (
                            <>
                                <h2>Transacciones</h2>
                                {isLoadingMonto? (
                                    <p>Cargando Monto total...</p>
                                ): (
                                    <>
                                        <h2> Monto total transferido en el sistema: </h2>
                                        {montoTotal.total_amount}

                                    </>
                                )}

                                {isLoadingTransac? (
                                    <p>Cargando transacciones...</p>
                                ): (
                                    <>
                                        <h2> Todas las transacciones en el sistema: </h2>
                                        <TablaPaginacionGenerica
                                            filas={transacciones || []}
                                            columnas={[
                                                { field: 'Date', headerName: 'Fecha', width: 200},
                                                { field: 'Amount', headerName: 'Monto total de la transacción', width: 200 },
                                                { field: 'Seller_Email', headerName: 'Correo del vendedor', width: 200 },
                                                { field: 'Buyer_Email', headerName: 'Correo del comprador', width: 200 },
                                            ]}
                                            cantidad= '5'
                                        />
                                    </>
                                )}

                            </>
                        ),
                    }}
                />
            </div>
        </div>
    );
};