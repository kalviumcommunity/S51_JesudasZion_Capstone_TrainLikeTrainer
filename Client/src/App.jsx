import './App.css'
import NavBar from './components/NavBar'
import Home from './components/Home'
import {BrowserRouter , Route , Routes,useNavigate} from "react-router-dom"
import GetStarted from './components/GetStarted'
import Register from './components/Register'
import { useState ,useEffect } from 'react'
import axios from 'axios'
import AboutUs from './components/AboutUs'
import Course from './components/Course'
import Account from './components/Account'
import PrivateRoute from './components/PrivateRoute'


function App() {
  const [userName , setUserName] = useState("")
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
  
    const fetchProtectedData = async () => {
      
  
      try {
        const response = await axios.post('http://localhost:3000/protected',{"token" :getCookie("token")});
        // console.log('Protected data:', response.data);
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
    }, []);
  return (

    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<GetStarted/>} ></Route>
          <Route path='/reg/:form' element={<Register/>}></Route>
          <Route path='/home' element={<PrivateRoute isAuthenticated={isAuthenticated} Component={Home} />}></Route>
          <Route path='/about' element={<PrivateRoute isAuthenticated={isAuthenticated} Component={AboutUs} />}></Route>
          <Route path='/course' element={<PrivateRoute isAuthenticated={isAuthenticated} Component={Course} />}></Route>
          <Route path='/account' element={<PrivateRoute isAuthenticated={isAuthenticated} Component={Account} />} ></Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
