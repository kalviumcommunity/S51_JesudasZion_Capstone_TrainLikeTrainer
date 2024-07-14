import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import "../CSS_files/Home.css";
import axios from "axios";
import NewsBar from "./NewsBar";
import aiIcon from "../assets/ai.png";
import forum from "../assets/stadium.png";
import courseButton from "../assets/sport.png";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import { Bar } from "react-chartjs-2";
import {Chart as ChartJS} from "chart.js/auto"

import ClipLoader from "react-spinners/ClipLoader";


function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNews, setShowNews] = useState(false); // State to track visibility of news section
  const [isMobile, setIsMobile] = useState(window.innerWidth < 770); // State to track if the screen is mobile
  const [userData , setUserData] = useState()
  const [name,setName] = useState()
  const [chart , setChart] = useState({
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
    datasets: [{
        label: 'Completed Items per Day',
        data: [0, 0, 0, 0, 0],
        backgroundColor: '#1A4B6F', // Background color #1A4B6F
        borderColor: '#466D88',      // Border color #466D88
        borderWidth: 50,
    }]
})
  const navigate = useNavigate();

  const userHandle = async () => {
    const tokenCookie = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="));

    const token = tokenCookie ? tokenCookie.split("=")[1] : null;

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userDataResponse = await axios.get(
          `https://s51-jesudaszion-capstone-trainliketrainer.onrender.com/user/${decoded.email}`
        );
        setName(userDataResponse.data.name)
        setUserData(userDataResponse.data.lessons);
        setChart(processData(userDataResponse.data.lessons))

      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };

  function processData(data) {
    const dayCounts = {};

    // Process each item
    data.forEach(item => {
        const date = new Date(item.time);
        const day = date.toISOString().split('T')[0]; // Extract the date part (YYYY-MM-DD)

        if (dayCounts[day]) {
            dayCounts[day]++;
        } else {
            dayCounts[day] = 1;
        }
    });

    // Generate labels and data for Chart.js
    const labels = [];
    const counts = [];

    let dayIndex = 1;
    for (const day in dayCounts) {
        labels.push(`Day ${dayIndex}`);
        counts.push(dayCounts[day]);
        dayIndex++;
    }

    return {
        labels,
        datasets: [{
            label: 'Completed Items per Day',
            data: counts,
            backgroundColor: 'rgba(30, 129, 191, 0.211)', // Background color #1A4B6F
        borderColor: 'rgba(45, 109, 149, 0.611)',      // Border color #466D88
        borderWidth: 2,
        }]
    };
}



  async function fetchSportsNews() {
    const apiKey = "f8a1880804efa42f2eca1258d37ecd87";
    const apiUrl = `https://gnews.io/api/v4/search?q=sports&apikey=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json();
      setData(responseData.articles);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sports news:", error.message);
    }
  }

  // Call the function to fetch and log sports news

  useEffect(() => {
    // userHandle()
    // window.location.reload()
    fetchSportsNews();
    setChart(userHandle())
    
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
  const handelForum = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <NavBar />
      <div id="homeContainer">
        <section id="left_home">
          <div id="userWelcome">
            <p>Hi {name}</p>
            <p>It's nice to see you again.</p>
          </div>
          <div id="dailyScore">
            <Bar data={chart}  style={{ width: '100%', height: '100%' }} />
          </div>
          <div id="home_buttons">
            <Link to="/course">
              <div id="course" className="navi_home">
                <div className="homeImg">
                  <img src={courseButton} alt="" />
                </div>
                <div className="title_home">Course</div>
              </div>
            </Link>
            <Link to="/dashboard">
              <div id="forum" className="navi_home">
                <div className="homeImg">
                  <img src={forum} alt="" />
                </div>
                <div className="title_home">Forum</div>
              </div>
            </Link>
            <Link to="/ai">
              <div id="ai" className="navi_home">
                <div className="homeImg">
                  <img src={aiIcon} alt="" className="invert"/>
                </div>
                <div className="title_home">ai</div>
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

        {!isMobile && (
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
          </section>
        )}
      </div>
    </>
  );
}

export default Home;
