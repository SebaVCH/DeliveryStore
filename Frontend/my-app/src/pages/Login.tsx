import React,{SyntheticEvent, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLogin } from '../hooks/useLogin';
import {BotonVerde} from "../components/BotonVerde";
import '../styles/Login.css'

export const Login = () => {
  const [correo,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const {setToken} = useAuth();
  const navigate = useNavigate();

  const login = useLogin((token) => {
    setToken(token);

    navigate('/Homegeneral');
  },
  (error)=>{
    setErrorMsg(error);
  }

);

  const submit = (e: SyntheticEvent) => 
  {
    e.preventDefault();
    setErrorMsg('');
    login.mutate({Email:correo,Password:password});
      
  };


  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Iniciar Sesión</h1>
        <form onSubmit={submit} className="login-form">
          <label>Correo:</label>
          <input
            type="email"
            value={correo}
            onChange={e => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
          />
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="********"
          />
          <BotonVerde onClick={()=>{}}type="submit" disabled={login.isPending}>
            {login.isPending ? 'Iniciando...' : 'Login'}
          </BotonVerde>
        </form>
        {errorMsg && <p className="error">{errorMsg}</p>}
        <p className="register-link">
          ¿No tienes cuenta? <a href="/Register">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
}


//export default Login;
