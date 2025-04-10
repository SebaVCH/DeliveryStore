import React,{SyntheticEvent, useState} from 'react';
import {useNavigate} from 'react-router-dom';

interface LoginRespuesta
{
    token: string;
    user: {
        email: string;
        name: string;
    };
}



export const Login = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e: SyntheticEvent) => 
  {
    e.preventDefault();
    setError('');

      try {
          const respuesta = await fetch('http://localhost:8080/login', {
              method: 'POST',
              headers: {
                  'Content-Type':'application/json',
                  'Accept':'application/json'
              },
              body: JSON.stringify({
                  email,
                  password
              })
          });


          const contenido: LoginRespuesta = await respuesta.json();

          if (!respuesta.ok) {
              throw new Error('error en el puto login');
          }

          localStorage.setItem('token', contenido.token);
          localStorage.setItem('user', JSON.stringify(contenido.user));


          navigate('/Home');

      } catch (err) {
          setError('credenciales incorrectas 8===D');
          console.error('error en el login:', error);
      }
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
        <p>Si no tienes cuenta, registrate <a href="/Register">aquí</a></p>
        <p>¿Olvidaste tu contraseña? <a href="/forgot-password">Recupera tu contraseña</a></p>
        
    </div>
  );
}


//export default Login;
