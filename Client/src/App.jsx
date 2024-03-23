import './App.css'
import NavBar from './components/NavBar'
import Home from './components/Home'
import {BrowserRouter , Route , Routes} from "react-router-dom"

function App() {

  return (

    <>
      

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} ></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
