import React, { useState ,useEffect} from 'react';
import '../CSS_files/Register.css'; // Import CSS file
import img1 from "../assets/img_login.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import img_google from "../assets/GoogleIcon.webp"
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

const Register = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { form } = useParams();


  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (loginEmail.trim() === '' || loginPassword.trim() === '') {
      toast.error('Email and password are required', {
        position: 'top-right',
        autoClose: 5000
      });
      return;
    }
    
    console.log('Logging in with:', loginEmail, loginPassword);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    if (signupName.trim() === '' || signupEmail.trim() === '' || signupPassword.trim() === '' || confirmPassword.trim() === '') {


      toast.error('All fields are required', {
        position: 'top-right',
        autoClose: 5000
      });
      return;
    }
  
    if (signupPassword !== confirmPassword) {
      toast.error('Passwords do not match', {
        position: 'top-right',
        autoClose: 5000
      });
      return;
    }
  
    // Password validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(signupPassword)) {
      toast.error('Password must contain at least 8 characters, one number, and one symbol', {
        position: 'top-right',
        autoClose: 5000
      });
      return;
    }


    console.log('Signing up with:', signupName, signupEmail, signupPassword, confirmPassword);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  useEffect(() => {
    console.log(form)
    setIsLogin(form == 'login');
  }, [form]);

  return (
    <div  className="container">
      <img id='login_img' src={img1} alt="" />  
      {isLogin ? (
        <form onSubmit={handleLoginSubmit} className="form" noValidate>
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
        <form onSubmit={handleSignupSubmit} className="form" noValidate>
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
       <ToastContainer />
    </div>

    
  );
};

export default Register;
