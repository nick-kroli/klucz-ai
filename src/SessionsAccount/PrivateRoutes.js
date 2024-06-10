import { useContext } from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import useAuth from '../hooks/useAuth';


const PrivateRoutes = ( ) => {
  const { auth } = useAuth();
  // console.log("attempting home access with stat", auth);
  return(
    auth ? <Outlet/> : <Navigate to='/login'/>
  )
}

export default PrivateRoutes;