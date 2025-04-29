import React,{SyntheticEvent, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLogin } from '../hooks/useLogin';

export const Login = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const {setToken} = useAuth();
  const navigate = useNavigate();

  const login = useLogin((token) => {
    setToken(token);
    navigate('/Home');
  });

  const submit = (e: SyntheticEvent) => 
  {
    e.preventDefault();
    login.mutate({email,password});
      
  };


  return (
    <div>
        <h1>Login</h1>
        <form onSubmit={submit}>
            <label>Correo: </label>
            <input type="email" name="email" id = "email" required value = {email}
              onChange = {e => setEmail(e.target.value)}
                   placeholder = "Ingrese porfavor su correo.."
            />
            <label>Contraseña: </label>
            <input type="password" name="password" required value = {password}
              onChange = {e => setPassword(e.target.value)}
                   placeholder = "Ingrese porfavor su contraseña"
            />
            <button type="submit" value="Submit">Login</button>
        </form>
        {login.isError && <p>usuario o contraseña incorrectas </p>}
        <p>Si no tienes cuenta, registrate <a href="/Register">aquí</a></p>
        <p>¿Olvidaste tu contraseña? <a href="/forgot-password">Recupera tu contraseña</a></p>
        
    </div>
  );
}


//export default Login;
