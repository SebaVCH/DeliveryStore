import React,{SyntheticEvent, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';

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
    register.mutate({nombre,correo,password,direccion,telefono,tipo});
  };

  return (
    <div>
        <h1>Registro</h1>
        <form onSubmit={enviar}>
            <label>Ingrese su nombre</label>
            <input type = "text" name = "username" placeholder = 'Ingrese su nombre de usuario...' required value={nombre}
              onChange={e => setName(e.target.value)}
            />

            <label>Correo Electronico: </label>
            <input type = "email" name = "email" placeholder = 'Ingrese un correo electronico porfavor...' required value={correo}
              onChange={e => setEmail(e.target.value)}

            />
            <label>Contraseña: </label>
            <input type = "password" name = "password" placeholder = 'Ingrese una contraseña...' required value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <label>Direccion: </label>
            <input type = "text" name = "direccion" placeholder = 'Ingrese una direccion...' required value={direccion}
              onChange={e => setDireccion(e.target.value)}
            />
            <label>Telefono: </label>
            <input type = "text" name = "telefono" placeholder = 'Ingrese un telefono...' required value={telefono}
              onChange={e => setTelefono(e.target.value)}
            />
            <label>Tipo de cuenta: </label>
            <select value={tipo} onChange={e => setTipo(Number(e.target.value))}>
              <option value={1}>Usuario normal</option>
              <option value={2}>Repartidor</option>
            </select>

            <button type="submit" disabled = {register.isPending}>
              {register.isPending? 'Registrando...🗿' : 'Registrarse'}
            </button>
        </form>
        {errorMsg && <p>{errorMsg}</p>}
    </div>
  );
}
