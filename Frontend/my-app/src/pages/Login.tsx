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
    <div className="container-login">
        <h1>Login</h1>
        <form onSubmit={submit}>
            <label>Correo: </label>
            <input type="email" name="email" id = "email" required value = {correo}
              onChange = {e => setEmail(e.target.value)}
                   placeholder = "Ingrese porfavor su correo.."
            />
            <label>Contraseña: </label>
            <input type="password" name="password" required value = {password}
              onChange = {e => setPassword(e.target.value)}
                   placeholder = "Ingrese porfavor su contraseña"
            />
            <BotonVerde onClick={() => {}} type="submit" disabled={login.isPending}>
              {login.isPending? 'iniciando sesion...🗣️🗣️': 'Login'}
            </BotonVerde>
        </form>
        {login.isError && <p>usuario o contraseña incorrectas </p>}
        {errorMsg && <p>{errorMsg}</p>}
        <p>Si no tienes cuenta, registrate <a href="/Register">aquí</a></p>
    </div>
  );
}


//export default Login;
