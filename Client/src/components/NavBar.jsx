import React from 'react'
import logo from "../assets/logo.png"
import { Link } from 'react-router-dom'
function NavBar() {
  return (
    <>
        <nav>
            <div  className='nav naviga'>
                <ul>
                    <li><Link className='anchore'>Home</Link></li>
                    <li><Link className='anchore'>Catogories</Link></li>
                    <li><Link className='anchore'>About Us</Link></li>
                </ul>
            </div>
            <img id='logo' src={logo} alt="" />

            <div className='nav_buttons'>
                <button id='login_button' className='buttonStyle'>Login</button>
                <button id='signUp_button' className='buttonStyle'>Sign up</button>
            </div>
        </nav>
    </>
  )
}

export default NavBar