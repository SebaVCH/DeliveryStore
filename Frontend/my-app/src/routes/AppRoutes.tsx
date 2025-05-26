import {Routes , Route} from 'react-router-dom';
import {Login} from '../pages/Login';
import {Register} from '../pages/Register';
import {Home} from '../pages/Home';
import {PrivateRoute} from './PrivateRoute';
import {Producto} from '../pages/Producto';
import { Proveedores } from '../pages/Proveedores';
import { AdminDashboard } from '../pages/AdminDashboard';
import {Repartidores} from '../pages/Repartidores';
import {Envios} from '../pages/Envios';
import {Homegeneral} from '../pages/Homegeneral';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path = '/Login' element = {<Login/>}/>
      <Route path = '/Register' element = {<Register/>}/>
      <Route path = '/AdminDashboard' element={<PrivateRoute roles={[3]}><AdminDashboard/></PrivateRoute>}/> // cambiar a ruta privada cuando se tengan los datos del backend
      <Route path = '/Repartidores' element={<PrivateRoute roles={[2]}><Repartidores/></PrivateRoute>}/> //cambiar a ruta privada cuando se defina lo del repartidor con el coxino en la db

      <Route path = '/Envios' element={<PrivateRoute roles={[2]}><Envios/></PrivateRoute>}/>

      <Route path='/Home'element={<PrivateRoute roles={[1]}><Home/></PrivateRoute>}/>
      <Route path='/Homegeneral'element={<PrivateRoute roles={[1]}> <Homegeneral/> </PrivateRoute>}/>


      <Route path='/Producto' element={<PrivateRoute roles={[1]}><Producto/></PrivateRoute>}/>

      <Route path='/Proveedores' element={<PrivateRoute roles={[1]}> <Proveedores/> </PrivateRoute>}/>
    </Routes>
  );
};