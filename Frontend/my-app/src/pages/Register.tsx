import React,{SyntheticEvent, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import {BotonVerde} from "../components/BotonVerde";
import '../styles/Register.css'


export const Register = () => { //Hooks
  const [nombre, setName] = useState('');
  const [correo,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [tipo, setTipo] = useState(1); //por defecto 1 pal usuario normal
  const [errorMsg,setErrorMsg] = useState('');
  const navigate = useNavigate();

  const register = useRegister(() => {
    navigate('/Login');
    },
    (error) => {
      setErrorMsg(error);
    }
  );

  const enviar = (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorMsg('');
    register.mutate({Name:nombre,Email:correo,Password:password,Address:direccion,Phone:telefono,RoleType:tipo});
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Crear cuenta</h1>

      <form onSubmit={enviar} className="register-form">
        <div className="form-field">
          <label>Nombre completo</label>
          <input
            type="text"
            placeholder="Ingresa tu nombre..."
            required
            value={nombre}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            required
            value={correo}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="********"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Dirección</label>
          <input
            type="text"
            placeholder="Calle 123, Ciudad"
            required
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Teléfono</label>
          <input
            type="text"
            placeholder="+56 9 1234 5678"
            required
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Tipo de cuenta</label>
          <select value={tipo} onChange={(e) => setTipo(Number(e.target.value))}>
            <option value={1}>Usuario normal</option>
            <option value={2}>Repartidor</option>
          </select>
        </div>

        <BotonVerde onClick={()=>{}}type="submit" disabled={register.isPending}>
          {register.isPending ? 'Registrando...' : 'Registrarse'}
        </BotonVerde>

        {errorMsg && <p className="error-message">{errorMsg}</p>}
      </form>

      <p className="register-link">
        ¿Ya tienes cuenta? <a href="/Login">Inicia sesión</a>
      </p>
    </div>
  );
}
