import React from 'react'
import logo from "../assets/Logo_Train.png"
import img1 from "../assets/cap_gif1.gif"
import icon1 from "../assets/Football.png"
import icon2 from "../assets/Cricket.png"
import icon3 from "../assets/Basketball.png"
import icon4 from "../assets/Tennis.png"
import icon5 from "../assets/Badminton.png"
import img2 from "../assets/cap_gif2.gif"
import img3 from "../assets/cap_gif3.gif"
import img4 from "../assets/cap_gif4.gif"
import img5 from "../assets/cap_gif6.gif"
import "../CSS_files/GetStarted.css"

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faYoutube, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { Link ,useNavigate } from 'react-router-dom'
import { useState ,useEffect } from 'react'
import axios from 'axios'

function GetStarted() {

  const navigate = useNavigate()
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
        navigate("/home")
      }
    } catch (error) {
      console.error('Failed to fetch protected data:', error);
    }
  };

  useEffect(() => {
    fetchProtectedData();
  }, [token]);

  return (
    <>
        <nav>
            <img className='logo' src={logo} alt="" />
            <div>
                <Link to="/reg/login"><button  id='login_button' className='buttonStyle'>Login</button></Link>
                <Link to="/reg/signup"> <button  id='signUp_button' className='buttonStyle'>Sign up</button></Link>
            </div>
        </nav>

        <div id='get_main'>
            <div id='get_content'>
                <div>
                <span className='biggeer'>Train Like a</span>
                <span className='biggeer bluer'> Pro</span>
                </div>
                <p className='sun_bigger'>Dynamic, Interactive Training for Sports Enthusiasts. Elevate Your Skills in Just 15 Minutes a Day!</p>
                <Link to="/reg/signup"><button className='get_button'>Get Started</button></Link>
            </div>
            <div id='img_get_div'>
                <img className='img1_get' src={img1} alt="" />
            </div>
        </div>
        <div id='categ'><h1 className='leftttt'>Categories : </h1></div>
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

        <div id='get_quote'>
            <p>"I am not a perfectionist, but I like to feel  that things are done well. More important than that, I feel an endless need to learn, to improve, to evolve, not only to please the coach and the fans but also to feel satisfied with myself." - Cristiano Ronaldo</p>
        </div>

        <div id='info_get'>
            <div>
                <h1 className='head_info' id="headdonw">Master Skills in 15 minutes a day</h1>
                <h3 className='sub_info bolder1' >Elevate Your Game with Structured Video Lessons! Explore our curated collection of YouTube videos covering five sports categories and overall fitness, designed to help you learn and excel in your favorite activities.</h3>
            </div>

            <div className='info_div'>
                <img className='imgSize' src={img2} alt="" />
                <div className='word_info'>
                    <p className='head_info'>Dynamic Video Learning</p>
                    <p className='sub_info'>Master Sports Skills with Dynamic Video Lessons! Explore curated YouTube videos covering five sports categories and overall fitness, tailored for effective learning</p>
                </div>

            </div>

            <div className='info_div'>
                
                <div className='word_info'>
                    <p className='head_info'>Track Your Progress</p>
                    <p className='sub_info'>Stay On Top of Your Game. Track your progress effortlessly as you learn from our curated videos and community-generated content. Watch your skills grow in real-time</p>
                </div>
                <img className='imgSize' src={img5} alt="" />

            </div>

            <div className='info_div'>
                <img className='imgSize' src={img4} alt="" />
                <div className='word_info'>
                    <p className='head_info'>Interactive Community</p>
                    <p className='sub_info'>Connect and Inspire. Engage with like-minded athletes, share your knowledge, and draw inspiration from others. Together, we elevate our game</p>
                </div>

            </div>

            <div className='info_div'>
               
                <div className='word_info'>
                    <p className='head_info'>Personalized Learning Paths</p>
                    <p className='sub_info'>Tailored Learning, Your Way. Choose your path to success with personalized learning tracks. Whether you're a beginner or a pro, we've got you covered</p>
                </div>
                <img className='imgSize' src={img3} alt="" />

            </div>
        </div>


        <footer className="footer">
      <div className="row">
        <ul className="social-links">
          <li>
            <a href="#">
              <FontAwesomeIcon className='foot_icon' icon={faFacebook} />
            </a>
          </li>
          <li>
            <a href="#">
              <FontAwesomeIcon className='foot_icon' icon={faInstagram} />
            </a>
          </li>
          <li>
            <a href="#">
              <FontAwesomeIcon className='foot_icon' icon={faYoutube} />
            </a>
          </li>
          <li>
            <a href="#">
              <FontAwesomeIcon className='foot_icon' icon={faTwitter} />
            </a>
          </li>
        </ul>
      </div>

      <div className="row">
        <ul className="navigation-links">
          <li>
            <a href="#">Contact Us</a>
          </li>
          <li>
            <a href="#">Our Services</a>
          </li>
          <li>
            <a href="#">Privacy Policy</a>
          </li>
          <li>
            <a href="#">Terms & Conditions</a>
          </li>
          <li>
            <a href="#">Career</a>
          </li>
        </ul>
      </div>

      <div className="row copyright">
        <p>INFERNO Copyright © 2021 Inferno - All rights reserved || Designed By: Mahesh</p>
      </div>
    </footer>

    </>
  )
}

export default GetStarted