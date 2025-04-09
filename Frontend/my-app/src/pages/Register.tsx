import React,{SyntheticEvent, useState} from 'react';
import { Navigate } from 'react-router-dom';

export const Register = () => {
  const [name, setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [redirect, setRedirect] =   useState(false);

  const enviar = async (e:SyntheticEvent) => {
    e.preventDefault();

    const api_url = 'http://localhost:8080/register';

    const respuesta = await fetch(api_url,{
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
          name,
          email,
          password
      })
    });

    const contenido = await respuesta.json();
    console.log(contenido); //pa visualizar el contenido del objeto que retorna cuando el user se registra

    setRedirect(true);
  }

  if(redirect){
    return <Navigate to = "/Login" />;
  }

  return (
    <div>
        <h1>Registro</h1>
        <form onSubmit={enviar}>
            <label>Ingrese su nombre</label>
            <input type = "username" name = "username" placeholder = 'Ingrese su nombre de usuario...' required
              onChange={e => setName(e.target.value)}
            />

            <label>Correo Electronico: </label>
            <input type = "email" name = "email" placeholder = 'Ingrese un correo electronico porfavor...' required
              onChange={e => setEmail(e.target.value)}

            />
            <label>Contraseña: </label>
            <input type = "password" name = "password" placeholder = 'Ingrese una contraseña...' required
              onChange={e => setPassword(e.target.value)}
            />
            <button onClick={enviar}>Registrarse</button>

        </form>
    </div>
  );
}
