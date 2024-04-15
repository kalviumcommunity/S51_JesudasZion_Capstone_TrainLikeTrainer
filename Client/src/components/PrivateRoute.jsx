import { Navigate} from "react-router-dom";
import { useState , useEffect } from "react";
import  axios  from "axios";

const PrivateRoute = ({ Component ,isAuthenticated }) => {
  return isAuthenticated ? <Component /> : <Navigate to="/reg/login" />;
};
export default PrivateRoute;
