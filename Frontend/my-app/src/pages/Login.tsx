import React,{SyntheticEvent, useState} from 'react';
import { Navigate } from 'react-router-dom';


export const Login = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [redirect, setRedirect] =   useState(false);

  const submit = async (e: SyntheticEvent) => 
  {
    e.preventDefault();
    const api_url = 'http://localhost:8080/login';

    const respuesta = await fetch(api_url,{
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      credentials: 'include',
      body: JSON.stringify({
          email,
          password
      })
  });

  const contenido = await respuesta.json();
    console.log(contenido); //pa visualizar el contenido del objeto que retorna cuando el user se registra

    setRedirect(true);
}

  if(redirect){
    return <Navigate to = "/Home" />;
  }


  return (
    <div>
        <h1>Login</h1>
        <form onSubmit={submit}>
            <label>Correo: </label>
            <input type="email" name="email" required 
              onChange = {e => setEmail(e.target.value)}
            />
            <label>Contraseña: </label>
            <input type="password" name="password" required 
              onChange = {e => setPassword(e.target.value)}
            />
            <input type="submit" value="Submit" />
        </form>
        <p>Si no tienes cuenta, registrate <a href="/Register">aquí</a></p>
        <p>¿Olvidaste tu contraseña? <a href="/forgot-password">Recupera tu contraseña</a></p>
        
    </div>
  );
}


//export default Login;
