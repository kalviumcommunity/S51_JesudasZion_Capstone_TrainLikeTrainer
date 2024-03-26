import './App.css'
import NavBar from './components/NavBar'
import Home from './components/Home'
import {BrowserRouter , Route , Routes} from "react-router-dom"
import GetStarted from './components/GetStarted'

function App() {

  return (

    <>
      <GetStarted></GetStarted>

      {/* <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} ></Route>
        </Routes>
      </BrowserRouter> */}
    </>
  )
}

export default App
