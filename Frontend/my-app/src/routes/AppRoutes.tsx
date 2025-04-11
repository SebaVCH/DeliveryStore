import {Routes , Route} from 'react-router-dom';
import {Login} from '../pages/Login';
import {Register} from '../pages/Register';



export const AppRoutes = () => {
  return (
    <Routes>
      <Route path = '/login' element = {<Login/>}/>
      <Route path = '/Register' element = {<Register/>}/>
      <Route path = '/' element = {<Login/>}/>
      
    </Routes>
  );
};
