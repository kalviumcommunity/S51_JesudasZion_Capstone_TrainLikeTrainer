import React, { useState, useEffect } from "react";
import logo from "../assets/Logo_Train.png";
import searchIcon from "../assets/searchIcon.png";
import courseIcon from "../assets/course.png";
import homeIcon from "../assets/homeIcon.png";
import aiIcon from "../assets/ai.png";
import "../CSS_files/Nav.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function NavBar() {
  const [showMenu, setShowMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("hello");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
  };

  const [data, setData] = useState([]);

  const fetch = async () => {
    try {
      const response = await axios.get(`https://s51-jesudaszion-capstone-trainliketrainer.onrender.com/sports/Football`);
      setData(response.data.positions);
      console.log(response.data);
      let transformedData = [];
      response.data.positions.forEach((position) => {
        position.characteristics.forEach((characteristic) => {
          transformedData.push({
            name: characteristic.name,
            pos: position.name,
            sport: response.data.name,
          });
        });
      });
      console.log(transformedData);
      setSearchData(transformedData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetch();

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

  useEffect(() => {
    if (searchQuery) {
      const results = searchData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.pos.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sport.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  }, [searchQuery, searchData]);

  return (
    <>
      <nav>
        <img id="logo" src={logo} alt="Logo" />

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
                  <img src={homeIcon} alt="Home Icon" />
                  <p>Home</p>
                </div>
              </Link>

              <Link to="/course">
                <div className="buttons_navigator" id="nav_buttons_course">
                  <img src={courseIcon} alt="Course Icon" />
                  <p>Courses</p>
                </div>
              </Link>

              <Link to="/ai
              ">
                <div className="buttons_navigator" id="nav_buttons_home">
                  <img src={aiIcon} alt="" />
                  <p>AI</p>
                </div>
              </Link>
            </div>

            

            <div id="search_bar">
              <div>
         
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
              />
              </div>
              <div className="options_nav">
              {filteredResults.length > 0 && (
                <div className="search-results-dropdown">
                  {filteredResults.map((item, index) => (
                    <Link to={`/course/${item.sport}/${item.pos}/${item.name}`} key={index}>
                    <div  className="search-result-item">
                      <p>{item.name} / {item.pos} / {item.sport}</p>
                    </div>
                    </Link>
                  ))}
                </div>
              )}
              </div>
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
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </div>
      )}

      {isMobile && showMenu && (
        <div className="popup-menu">
          <ul>
            <li id="search-mobile">
              <div id="search_icon_div">
                <img src={searchIcon} alt="Search Icon" />
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {filteredResults.length > 0 && (
                <div className="search-results-dropdown">
                  {filteredResults.map((item, index) => (
                    <div key={index} className="search-result-item">
                      <p>{item.name} / {item.pos} / ({item.sport})</p>
                    </div>
                  ))}
                </div>
              )}
            </li>
            <li>
              <img src={homeIcon} alt="Home Icon" />
              <p>Home</p>
            </li>
            <li>
              <img src={courseIcon} alt="Course Icon" />
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
