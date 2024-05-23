import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const PrivateRoute = ({ Component, isAuthenticated }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(isAuthenticated);

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

  const fetchProtectedData = async () => {
    try {
      const response = await axios.post('https://s51-jesudaszion-capstone-trainliketrainer.onrender.com/protected', { "token": getCookie("token") });
      console.log(response.data.authenticated);
      setIsAuth(response.data.authenticated);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch protected data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProtectedData();
  }, [getCookie("token")]);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading spinner
  }

  return isAuth ? <Component /> : <Navigate to="/reg/login" />;
};

export default PrivateRoute;
