import React,{SyntheticEvent, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';

export const Register = () => { //Hooks
  const [name, setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
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
    register.mutate({name,email,password});
  };

  return (
    <div>
        <h1>Registro</h1>
        <form onSubmit={enviar}>
            <label>Ingrese su nombre</label>
            <input type = "username" name = "username" placeholder = 'Ingrese su nombre de usuario...' required value={name}
              onChange={e => setName(e.target.value)}
            />

            <label>Correo Electronico: </label>
            <input type = "email" name = "email" placeholder = 'Ingrese un correo electronico porfavor...' required value={email}
              onChange={e => setEmail(e.target.value)}

            />
            <label>Contraseña: </label>
            <input type = "password" name = "password" placeholder = 'Ingrese una contraseña...' required value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button type="submit" disabled = {register.isPending}>
              {register.isPending? 'Registrando...🗿' : 'Registrarse'}
            </button>
        </form>
        {errorMsg && <p>{errorMsg}</p>}
    </div>
  );
}
