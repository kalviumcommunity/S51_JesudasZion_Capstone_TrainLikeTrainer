import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import "../CSS_files/Home.css";
import axios from "axios";
import NewsBar from "./NewsBar";
import forum from "../assets/stadium.png";
import courseButton from "../assets/sport.png";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";


import ClipLoader from "react-spinners/ClipLoader";


function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNews, setShowNews] = useState(false); // State to track visibility of news section
  const [isMobile, setIsMobile] = useState(window.innerWidth < 770); // State to track if the screen is mobile

  const navigate = useNavigate()

  async function fetchSportsNews() {
    const apiKey = 'f8a1880804efa42f2eca1258d37ecd87';
    const apiUrl = `https://gnews.io/api/v4/search?q=sports&apikey=${apiKey}`;
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json();
      setData(responseData.articles)
      setLoading(false)
      // console.log(responseData.articles); // Log the response data to the console
    } catch (error) {
      console.error('Error fetching sports news:', error.message);
    }
  }
  
  // Call the function to fetch and log sports news
 
  
  useEffect(() => {
    // window.location.reload()
    fetchSportsNews();
    // Add event listener to track window resize
    window.addEventListener("resize", handleResize);
    return () => {
      // Remove event listener on component unmount
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Function to toggle visibility of news section
  const toggleNewsSection = () => {
    setShowNews(!showNews);
  };

  // Function to handle window resize
  const handleResize = () => {
    setIsMobile(window.innerWidth < 770);
  };
  const handelForum = () =>{
    console.log("123")
    navigate("/dashboard")
  }

  return (
    <>
      <NavBar />
      <div id="homeContainer">
        <section id="left_home">
          <div id="userWelcome">
            <p>Hi Jesudas</p>
            <p>It's nice to see you again.</p>
          </div>
          <div id="dailyScore"></div>
          <div id="home_buttons">
            <Link to="/course">
              <div id="course" className="navi_home" >
                <div className="homeImg"><img src={courseButton} alt="" /></div>
                <div className="title_home">Course</div>
              </div>
            </Link>
            <Link to="/dashboard">
              <div id="forum"   className="navi_home">
              <div className="homeImg"><img  src={forum} alt="" /></div>
                <div className="title_home">Forum</div>
              </div>
            </Link>
          </div>
        </section>

        {isMobile && (
          <section id="right_home" className={showNews ? "visible" : "hidden"}>
            <div id="toggleButton" onClick={toggleNewsSection}>
              {showNews ? (
                <FontAwesomeIcon icon={faArrowAltCircleLeft} />
              ) : (
                <FontAwesomeIcon icon={faArrowAltCircleRight} />
              )}
            </div>
            <p>{!showNews ? "N - E - W - S" : "Latest Sports News"}</p>
            <div className="newsCenter">
              {loading ? (
                <div className="loading">
                  <ClipLoader
                    loading={loading}
                    size={150}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              ) : (
                <div id="newsContainer">
                  {data.map((item, index) => (
                    <NewsBar key={index} data={item} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {!isMobile && 
        <section id="right_home" className={showNews ? "visible" : "hidden"}>
            <p>Latest Sports News</p>
            <div className="newsCenter">
              {loading ? (
                <div className="loading">
                  <ClipLoader
                    loading={loading}
                    size={150}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              ) : (
                <div id="newsContainer">
                  {data.map((item, index) => (
                    // console.log(item)
                    <NewsBar key={index} data={item} />
                  ))}
                </div>
              )}
            </div>
          </section>}
      </div>
    </>
  );
}

export default Home;
