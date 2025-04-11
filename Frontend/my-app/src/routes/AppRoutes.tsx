import {Routes , Route} from 'react-router-dom';
import {Login} from '../pages/Login';
import {Register} from '../pages/Register';
import Home from '../pages/Home';



export const AppRoutes = () => {
  return (
    <Routes>
      <Route path = '/login' element = {<Login/>}/>
      <Route path = '/Register' element = {<Register/>}/>
      <Route path = '/Home' element = {<Home/>}/>
      
    </Routes>
  );
};
