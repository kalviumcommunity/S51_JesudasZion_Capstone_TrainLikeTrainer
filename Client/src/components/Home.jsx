import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import "../CSS_files/Home.css";
import axios from "axios";
import NewsBar from "./NewsBar";

import ClipLoader from "react-spinners/ClipLoader";


function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

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
            <div id="course"></div>
            <div id="forum"></div>
          </div>
        </section>

        <section id="right_home">
          <p>Latest Sports News</p>
          <div className="newsCenter">
          {loading ? (
            <div className="loading"><ClipLoader
            
            loading={loading}
  
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          /></div> // Show loading animation while fetching data
          ) : (
            <div id="newsContainer">
              {data.map((item, index) => (
                <NewsBar key={index} data={item} />
              ))}
            </div>
          )}
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
