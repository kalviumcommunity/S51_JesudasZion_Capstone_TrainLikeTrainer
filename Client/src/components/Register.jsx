import React, { useState, useEffect } from "react";
import "../CSS_files/Register.css";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ClipLoader from "react-spinners/ClipLoader";

const Register = () => {
  const navigate = useNavigate();
  const { form } = useParams();
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [token, setToken] = useState("");
  const [showOTPPass, setShowOTPPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [userNewPass, setUserNewPass] = useState("");
  const [userNewPassCon, setUserNewPassCon] = useState("");
  const [showEmailPass, setShowEmailPass] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [loading, setLoading] = useState(false);

  function setCookie(name, value, expiresInDays) {
    const date = new Date();
    date.setTime(date.getTime() + expiresInDays * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + "; " + expires + "; path=/";
  }

  function getCookie(name) {
    const cookieString = document.cookie;
    const cookies = cookieString.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split("=");
      if (cookie[0] === name) {
        return cookie[1];
      }
    }
    return null;
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (loginEmail.trim() === "" || loginPassword.trim() === "") {
      toast.error("Email and password are required", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "https://s51-jesudaszion-capstone-trainliketrainer.onrender.com/login",
        {
          email: loginEmail,
          password: loginPassword,
        }
      );

      // Fetch user data after successful login
      const userDataResponse = await axios.get(
        `https://s51-jesudaszion-capstone-trainliketrainer.onrender.com/user/${loginEmail}`
      );

      setToken(response.data.token);
      setCookie("token", response.data.token, 10);
      navigate("/home");
      // setTimeout(() => {
      //   window.location.reload();
      // }, 500);
    } catch (error) {
      setLoading(false)
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Error logging in:", error.response.data.message);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (
      signupName.trim() === "" ||
      signupEmail.trim() === "" ||
      signupPassword.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      toast.error("All fields are required", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (signupPassword !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(signupPassword)) {
      toast.error(
        "Password must contain at least 8 characters, one number, and one symbol",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
      return;
    }

    try {
      const response = await axios.post(
        "https://s51-jesudaszion-capstone-trainliketrainer.onrender.com/signup",
        {
          email: signupEmail,
        }
      );

      setOtp(response.data.code);

      // Show OTP popup after successful login
      setShowOTP(true);
    } catch (error) {
      setLoading(false)
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Error logging in:", error);
    }
  };

  const fetchProtectedData = async () => {
    try {
      // Make a GET request to the protected route

      const response = await axios.post(
        "https://s51-jesudaszion-capstone-trainliketrainer.onrender.com/protected",
        {
          token: getCookie("token"),
        }
      );

      // Handle the response
      // if (response.data.)
      if (response.data.authenticated) {
        // window.location.reload()
        navigate("/home");
        setLoading(false);
      }
    } catch (error) {
      // Handle errors
      console.error("Failed to fetch protected data:", error);
    }
  };

  const toggleForm = () => {
    setTransitioning(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setTransitioning(false);
    }, 300);
  };

  const handleOTPSubmit = async () => {
    try {
      const response = await axios.post(
        "https://s51-jesudaszion-capstone-trainliketrainer.onrender.com/optVerify",
        {
          otp: otp,
          userOtp: userOtp,
        }
      );

      if (response.data.auth) {
        const response1 = await axios.post(
          "https://s51-jesudaszion-capstone-trainliketrainer.onrender.com/user",
          {
            email: signupEmail,
            password: signupPassword,
            name: signupName,
          }
        );

        setToken(response1.data.token);
        setCookie("token", response1.data.token, 10);
        setShowOTP(false);
        navigate("/home")
        // window.location.reload();
      }

      // Show OTP popup after successful login
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Error logging in:", error);
    }
  };

  const handelForget = async () => {
    setShowOTPPass(true);
  };

  const handleOTPPassSubmit = async () => {
    try {
      const response = await axios.post(
        "https://s51-jesudaszion-capstone-trainliketrainer.onrender.com/optVerify",
        {
          otp: otp,
          userOtp: userOtp,
        }
      );
      if (response.data.auth) {
        setShowNewPass(true);
        setShowOTPPass(false);
      }

      // Show OTP popup after successful login
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Error logging in:", error);
    }
  };

  async function handleGoogleResponse(response) {
    const userObject = jwtDecode(response.credential);
    try {
      const response = await axios.post("https://s51-jesudaszion-capstone-trainliketrainer.onrender.com/googleSave", {
        email: userObject.email,
        name: userObject.name,
      });
      setToken(response.data.token);
      setCookie("token", response.data.token, 10);
      navigate("/home");
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Error logging in:", error);
    }
  }

  const handelEmailPass = async () => {
    try {
      const response = await axios.post(
        "https://s51-jesudaszion-capstone-trainliketrainer.onrender.com/mail",
        {
          email: loginEmail,
        }
      );
      setShowEmailPass(true);
      setOtp(response.data.code);
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 5000,
      });
      
    }
  };

  const handelChangePass = async () => {
    try{
      const response1 = await axios.put(
        "https://s51-jesudaszion-capstone-trainliketrainer.onrender.com/passChange",
        {
          email: loginEmail,
          password: userNewPass,
        }
      );
      setShowOTP(false);
      setShowNewPass(false);
      setShowOTPPass(false);
    }catch (err){
      console.log(err)
    }
  };

  useEffect(() => {
    
    fetchProtectedData();
    setIsLogin(form == "login");

    setTimeout(()=>{
      google.accounts.id.initialize({
        client_id:
          "715331636246-9n9b52a1n67q0hbo77dm76eedbmhl50t.apps.googleusercontent.com",
        callback: handleGoogleResponse,
      });
  
      google.accounts.id.renderButton(document.getElementById("googleDiv"), {
        size: "large",
      });
    },0)
  }, []);

  return (
    <div className="container">
      {!loading ? (
        <>
          {/* <img id="login_img" src={img1} alt="" /> */}
          {isLogin ? (
            <form
              onSubmit={handleLoginSubmit}
              className={`form ${transitioning ? "hidden" : ""}`}
              noValidate
            >
              <h2>Login</h2>
              <div id="login_type">
                <div id="googleDiv" className="button_google">
                  {/* <img id='google_icon' src={img_google} alt="" />
                  <p>Login using Google</p> */}
                </div>

              </div>
              <div className="orr_div">
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
              <button type="submit" className="button">
                Login
              </button>
              <div className="login_veri">
                <p>
                  New User?{" "}
                  <span onClick={toggleForm} className="link under_login">
                    Sign up
                  </span>
                </p>
                <p className="under_login" onClick={handelForget}>
                  Forgot password?
                </p>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleSignupSubmit}
              className={`form ${transitioning ? "hidden" : ""}`}
              noValidate
            >
              <h2>Sign Up</h2>

              <div id="login_type">
                <div id="googleDiv">
                  {/* <img id='google_icon' src={img_google} alt="" />
                  <p>Login using Google</p> */}
                </div>
              </div>
              <div className="orr_div">
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
              <button type="submit" className="button">
                Sign Up
              </button>
              <div className="login_veri">
                <p>
                  Existing User?{" "}
                  <span onClick={toggleForm} className="link under_login">
                    Login
                  </span>
                </p>
              </div>
            </form>
          )}

          {/* OTP Popup */}
          {showOTP && (
            <div className="otp-popup">
              <div className="otp-content">
                <h1>OTP Verification</h1>
                <div id="green_tab">
                  <p>
                    We have sent the Verification code to you Via email , check
                    and fill below .
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={userOtp}
                  onChange={(e) => setUserOtp(e.target.value)}
                  className="otp-input"
                />
                <div id="pop_buttons">
                  <button
                    onClick={handleOTPSubmit}
                    className="otp-submit-button"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setShowOTP(false)}
                    className="otp-close-button"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {showOTPPass && (
            <div className="otp-popup">
              <div className="otp-content">
                <h1>OTP Verification</h1>
                <div id="green_tab">
                  <p>
                    {showOTPPass && !showEmailPass
                      ? "Enter your email for verification."
                      : "We have sent the verification code to you via email, check and fill below."}
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Enter The Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="otp-input"
                />
                {showEmailPass && (
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={userOtp}
                    onChange={(e) => setUserOtp(e.target.value)}
                    className="otp-input"
                  />
                )}
                <div id="pop_buttons">
                  <button
                    onClick={
                      showEmailPass ? handleOTPPassSubmit : handelEmailPass
                    }
                    className="otp-submit-button"
                  >
                    {showEmailPass ? "Submit" : "Confirm"}
                  </button>
                  <button
                    onClick={() => setShowOTPPass(false)}
                    className="otp-close-button"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {showNewPass && (
            <div className="otp-popup">
              <div className="otp-content">
                <h1>OTP Verification</h1>
                <div id="gray_tab">
                  <p>Enter the New password Below</p>
                </div>
                <input
                  type="text"
                  placeholder="Enter New Password"
                  value={userNewPass}
                  onChange={(e) => setUserNewPass(e.target.value)}
                  className="otp-input"
                />
                <input
                  type="text"
                  placeholder="Confirm Password"
                  value={userNewPassCon}
                  onChange={(e) => setUserNewPassCon(e.target.value)}
                  className="otp-input"
                />

                <div id="pop_buttons">
                  <button
                    onClick={handelChangePass}
                    className="otp-submit-button"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setShowNewPass(false)}
                    className="otp-close-button"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="loading">
          <ClipLoader
            loading={loading}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}

<ToastContainer />

    </div>
  );
};

export default Register;
