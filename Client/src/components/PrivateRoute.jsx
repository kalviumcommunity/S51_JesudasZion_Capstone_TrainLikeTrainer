import { Navigate } from "react-router-dom";

const PrivateRoute = ({ Component, isAuthenticated }) => {
  return isAuthenticated ? <Component /> : <Navigate to="/reg/login" />;
};
export default PrivateRoute;
