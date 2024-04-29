import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import "../CSS_files/Home.css";
import axios from "axios";
import NewsBar from "./NewsBar";
import forum from "../assets/forum-gif.gif";
import courseButton from "../assets/course-gif.gif";
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

  const fetchNews = async () => {


    try {
      const response = await axios.get(
        "https://newsapi.org/v2/top-headlines?country=in&category=sports&apiKey=726045543c0c431fa40bedae070f9be7"
      );
      if (response) {
        setData(response.data.articles);
        setLoading(false); // Set loading to false when data fetching is complete
      } else {
        console.log("nodata");
      }
    } catch (error) {
      console.error("Failed to fetch protected data:", error);
    }
  };

  useEffect(() => {
    fetchNews();
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
            <Link>
              <div id="course" className="navi_home">
                <img src={courseButton} alt="" />
                <div>Course</div>
              </div>
            </Link>
            <Link to="/dashboard">
              <div id="forum"   className="navi_home">
                <img  src={forum} alt="" />
                <div>Forum</div>
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
