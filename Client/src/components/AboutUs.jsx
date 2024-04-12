import React from 'react';
import "../CSS_files/AboutUs.css"
import NavBar from './NavBar';
import back3 from '../assets/background3.jpg'
import spidey from "../assets/spidey.jpg"

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faYoutube, faTwitter } from '@fortawesome/free-brands-svg-icons';

const WebsiteSections = () => {
  return (
    <>
    <NavBar/>
    <div className="website-sections">
      <section className="about-section">
        <div className="About_container">
              <div className="about-content">
                <h2>About Train Like a Trainer</h2>
                <p>Welcome to Train Like a Trainer, where passion for sports meets dedication to excellence! At Train Like a Trainer, we believe that everyone has the potential to become a master of their chosen sport. Whether you're a seasoned athlete looking to refine your skills or a beginner eager to learn the ropes, our platform is designed to empower you on your journey to success.</p>
              </div>
        </div>
      </section>

      <section className="mission-section">
        <div className="sections_container">
              <div className="mission-img">
                <img src={back3} alt="Mission Image" />
              </div>
          
            
              <div className="mission-content">
                <h2>Our Mission</h2>
                <p>Our mission at Train Like a Trainer is simple: to inspire and enable individuals to achieve their athletic goals. We're committed to providing the tools, resources, and support necessary for athletes of all levels to unlock their full potential. Through innovative technology, expert guidance, and a vibrant community, we strive to create a dynamic learning environment where passion for sports thrives.</p>
              </div>
        </div>
      </section>

      <section className="creator-section">
        <div className="sections_container">
              <div className="mission-content">
                <h2>Meet the Creator</h2>
                <p>Train Like a Trainer was founded by [Creator's Name], a dedicated sports enthusiast with a vision to revolutionize the way athletes train and learn. With a background in [relevant field], [Creator's Name] is passionate about helping athletes of all levels achieve their full potential and elevate their performance to new heights.</p>
              </div>
            
              <div className="mission-img">
                <img src={spidey} alt="Creator Image" />
              </div>
        </div>
      </section>

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
        <p>Copyright © 2021  All rights reserved || Designed By:Jesudas Zion</p>
      </div>
    </footer>
    </div>
    </>
  );
};

export default WebsiteSections;
