import React, { useState, useEffect } from "react";
import logo from "../assets/Logo_Train.png";
import searchIcon from "../assets/searchIcon.png";
import courseIcon from "../assets/course.png";
import homeIcon from "../assets/homeIcon.png";
import "../CSS_files/Nav.css";
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const [showMenu, setShowMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    console.log("hello");
    // Set the expiration date to a past date
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
  };

  useEffect(() => {
    const checkWindowSize = () => {
      setIsMobile(window.innerWidth < 769);
    };

    // Initial check
    checkWindowSize();

    // Event listener for window resize
    window.addEventListener("resize", checkWindowSize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkWindowSize);
    };
  }, []);

  return (
    <>
      <nav>
        <img id="logo" src={logo} alt="" />

        {isMobile ? (
          <div
            className={`hamburger-menu ${showMenu ? "active" : ""}`}
            onClick={toggleMenu}
          >
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
          </div>
        ) : (
          <>
            <div id="nav_buttons_main">
              <Link to="/home">
                <div className="buttons_navigator" id="nav_buttons_home">
                  <img src={homeIcon} alt="" />
                  <p>Home</p>
                </div>
              </Link>

              <Link to="/course">
                <div className="buttons_navigator" id="nav_buttons_course">
                  <img src={courseIcon} alt="" />
                  <p>Courses</p>
                </div>
              </Link>
            </div>

            <div id="search_bar">
              <div id="search_icon_div">
                <img src={searchIcon} alt="" />
              </div>
              <input type="text" />
            </div>

            <div
              className={`hamburger-menu ${showMenu ? "active" : ""}`}
              onClick={toggleMenu}
            >
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
          </>
        )}
      </nav>
      {showMenu && !isMobile && (
        <div className="popup-menu">
          <ul>
            <Link to="/about">
              <li>About Us</li>
            </Link>
            <Link to="/account">
              <li>Account</li>
            </Link>
            <li>Logout</li>
          </ul>
        </div>
      )}

      {isMobile && showMenu && (
        <div className="popup-menu">
          <ul>
            <li id="search-mobile">
              <div id="search_icon_div">
                <img src={searchIcon} alt="" />
              </div>
              <input type="text" placeholder="Search" />
            </li>
            <li>
              <img src={homeIcon} alt="" />
              <p>Home</p>
            </li>
            <li>
              <img src={courseIcon} alt="" />
              <p>Courses</p>
            </li>

            <Link to="/about">
              <li>About Us</li>
            </Link>
            <Link to="">
              <li>Account</li>
            </Link>
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </div>
      )}
    </>
  );
}

export default NavBar;
