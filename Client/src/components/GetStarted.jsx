import React from 'react'
import logo from "../assets/Logo_Train.png"
import "../CSS_files/GetStarted.css"
import img1 from "../assets/cap_gif1.gif"
import icon1 from "../assets/Football.png"
import icon2 from "../assets/Cricket.png"
import icon3 from "../assets/Basketball.png"
import icon4 from "../assets/Tennis.png"
import icon5 from "../assets/Badminton.png"

function GetStarted() {
  return (
    <>
        <nav>
            <img className='logo' src={logo} alt="" />
            <div>
                <button id='login_button' className='buttonStyle'>Login</button>
                <button id='signUp_button' className='buttonStyle'>Sign up</button>
            </div>
        </nav>

        <div id='get_main'>
            <div id='get_content'>
                <div>
                <span className='biggeer'>Train Like a</span>
                <span className='biggeer bluer'> Pro</span>
                </div>
                <p className='sun_bigger'>Dynamic, Interactive Training for Sports Enthusiasts. Elevate Your Skills in Just 15 Minutes a Day!</p>
                <button className='get_button'>Get Started</button>
            </div>
            <div id='img_get_div'>
                <img className='img1_get' src={img1} alt="" />
            </div>
        </div>
    <h1 className='leftttt'>Categories : </h1>
        <div id='get_category'>
            <div className="games_get">
                <img className='icons' src={icon1} alt="" />
                <p>Football</p>
            </div>
            <div className="games_get">
                <img className='icons' src={icon2} alt="" />
                <p>Cricket</p>
            </div>
            <div className="games_get">
                <img className='icons' src={icon3} alt="" />
                <p>Basketball</p>
            </div>
            <div className="games_get">
            <img className='icons' src={icon4} alt="" />
                <p>Tennis</p>
            </div>
            <div className="games_get">
            <img className='icons' src={icon5} alt="" />
                <p>Badminton</p>
            </div>
        </div>
    </>
  )
}

export default GetStarted