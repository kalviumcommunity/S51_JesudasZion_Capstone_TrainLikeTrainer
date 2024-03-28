import React, { useState } from 'react';
import '../CSS_files/Register.css'; // Import CSS file
import img1 from "../assets/img_login.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import img_google from "../assets/GoogleIcon.webp"
const Register = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Here you can implement the login functionality
    console.log('Logging in with:', loginEmail, loginPassword);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Here you can implement the signup functionality
    console.log('Signing up with:', signupName, signupEmail, signupPassword, confirmPassword);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div  className="container">
      <img id='login_img' src={img1} alt="" />  
      {isLogin ? (
        <form onSubmit={handleLoginSubmit} className="form">
          <h2>Login</h2>
          <div id='login_type'>
            <div className="login_methods">
                <img id='google_icon' src={img_google} alt="" />
                <p>Login using Google</p>
            </div>
            <div className="login_methods">
                <FontAwesomeIcon icon={faFacebook} style={{ color: 'blue' ,fontSize: "20px"}} />
                <p>Login using Facebook</p>
            </div>
          </div>
          <div className='orr_div'>
            <hr />
                <p>OR</p>
            <hr />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
            className="input"
            id="login-email"
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
            className="input"
            id="login-password"
          />
          <button  type="submit" className="button">Login</button>
          <div className='login_veri'>
            <p>New User? <span onClick={toggleForm} className="link under_login">Sign up</span></p>
            <p className='under_login'>Forgot password?</p>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSignupSubmit} className="form">
          <h2>Sign Up</h2>

          <div id='login_type'>
            <div className="login_methods">
                <img id='google_icon' src={img_google} alt="" />
                <p>Login using Google</p>
            </div>
            <div className="login_methods">
                <FontAwesomeIcon icon={faFacebook} style={{ color: 'blue' ,fontSize: "20px"}} />
                <p>Login using Facebook</p>
            </div>
          </div>
          <div className='orr_div'>
            <hr />
                <p>OR</p>
            <hr />
          </div>

          <input
            type="text"
            placeholder="Name"
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
            required
            className="input"
            id="signup-name"
          />
          <input
            type="email"
            placeholder="Email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            required
            className="input"
            id="signup-email"
          />
          <input
            type="password"
            placeholder="Password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            required
            className="input"
            id="signup-password"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="input"
            id="confirm-password"
          />
          <button type="submit" className="button">Sign Up</button>
          <div className='login_veri'>
            <p>Existing User? <span onClick={toggleForm} className="link under_login">Login</span></p>
          </div>
        </form>
      )}
    </div>
  );
};

export default Register;
