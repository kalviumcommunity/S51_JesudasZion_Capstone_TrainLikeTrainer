import './App.css'
import NavBar from './components/NavBar'
import Home from './components/Home'
import {BrowserRouter , Route , Routes,useNavigate} from "react-router-dom"
import GetStarted from './components/GetStarted'
import Register from './components/Register'
import { useState ,useEffect } from 'react'
import axios from 'axios'


function App() {
  
  return (

    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<GetStarted/>} ></Route>
          <Route path='/reg/:form' element={<Register/>}></Route>
          <Route path='/home' element={<Home/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
