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
  
  return (

    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<GetStarted/>} ></Route>
          <Route path='/reg/:form' element={<Register/>}></Route>
          <Route path='/home' element={<PrivateRoute Component={Home} />}></Route>
          <Route path='/about' element={<PrivateRoute Component={AboutUs} />}></Route>
          <Route path='/course' element={<PrivateRoute Component={Course} />}></Route>
          <Route path='/account' element={<PrivateRoute Component={Account} />} ></Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
