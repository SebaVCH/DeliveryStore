import {Routes , Route} from 'react-router-dom';
import {Login} from '../pages/Login';
import {Register} from '../pages/Register';
import {Home} from '../pages/Home';
import {PrivateRoute} from './PrivateRoute';
import {Producto} from '../pages/Producto';
import { Proveedores } from '../pages/Proveedores';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path = '/Login' element = {<Login/>}/>
      <Route path = '/Register' element = {<Register/>}/>

      <Route path='/Home'element={<PrivateRoute> <Home/> </PrivateRoute>}/>

      <Route path='/Producto' element={<PrivateRoute> <Producto/> </PrivateRoute>}/>

      <Route path='/Proveedores' element={<PrivateRoute> <Proveedores/> </PrivateRoute>}/>
    </Routes>
  );
};
