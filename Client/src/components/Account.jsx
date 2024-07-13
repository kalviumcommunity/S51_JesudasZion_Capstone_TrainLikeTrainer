// Account.js

import React, { useEffect, useRef, useState } from "react";
import "../CSS_files/Account.css"; // Import the CSS file
import NavBar from "../components/NavBar";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Account = () => {
  const [user, setUser] = useState("");
  const [toggle, setToggel] = useState(false);
  const descriptionRef = useRef()

  const handelProfileEdit = () =>{
    if (toggle){
    }
    setToggel((prev) => !prev)
  }

  const userHandel = async () => {
    const tokenCookie = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="));

    // Extract token value
    const token = tokenCookie ? tokenCookie.split("=")[1] : null;

    if (token) {
      try {
        // Step 2: Decode the token
        const decoded = jwtDecode(token);
        // Fetch user data after successful login
        const userDataResponse = await axios.get(
          `https://s51-jesudaszion-capstone-trainliketrainer.onrender.com/user/${decoded.email}`
        );

        // Update state with decoded token
        setUser(userDataResponse.data);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error("Token cookie not found or invalid.");
    }
  };

  useEffect(() => {
    userHandel();
  }, []);

  return (
    <>
      <NavBar></NavBar>
      <div className="container_account">
        <div className="card ">
          <div className="image">
            <button className="btn-secondary">
              <img
                src={user.profilePhoto}
                height="100"
                width="100"
                alt="profile"
              />
            </button>
          </div>

          <span className="name mt-3">{user.name}</span>
          <span className="idd1">{user._id}</span>
          <span>{user.email}</span>

          <div className="d-flex mt-2">
            <button
              onClick={handelProfileEdit}
              className="btn1 btn-dark"
            >
              {toggle ? "Save" : "Edit profile"}
            </button>
          </div>
          {toggle ? (
            <>
              <textarea placeholder="Enter the discription.." name="" id="" defaultValue={user.description} ref={descriptionRef}></textarea>
            </>
          ) : (
            <div className="text mt-3">
              <span>{user.description}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Account;
