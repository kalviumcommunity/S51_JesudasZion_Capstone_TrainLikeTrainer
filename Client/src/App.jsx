import './App.css'
import NavBar from './components/NavBar'
import Home from './components/Home'
import {BrowserRouter , Route , Routes} from "react-router-dom"
import GetStarted from './components/GetStarted'
import Register from './components/Register'
function App() {

  return (

    <>
      {/* <GetStarted></GetStarted> */}
      <Register></Register>
      {/* <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} ></Route>
        </Routes>
      </BrowserRouter> */}
    </>
  )
}

export default App
