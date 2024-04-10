import { Navigate} from "react-router-dom";
import { useState , useEffect } from "react";
import  axios  from "axios";

const PrivateRoute = ({ Component }) => {
 
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    function getCookie(name) {
  
      const cookieString = document.cookie;
      const cookies = cookieString.split('; ');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=');
        if (cookie[0] === name) {
          return cookie[1];
        }
      }
      return null;
    }
    const [token,setToken] = useState(getCookie("token"))
  
    const fetchProtectedData = async () => {
      
  
      try {
        const response = await axios.post('http://localhost:3000/protected',{"token" :getCookie("token")});
        console.log('Protected data:', response.data);
        if (response.data.authenticated){
            setIsAuthenticated(true)
        }else{
            setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Failed to fetch protected data:', error);
      }
    };
  
    useEffect(() => {
      fetchProtectedData();
    }, [token]);

 
 
  return isAuthenticated ? <Component /> : <Navigate to="/reg/login" />;
};
export default PrivateRoute;
