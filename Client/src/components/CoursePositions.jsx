import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import NavBar from "./NavBar";
import dropdown from "../assets/dropdown.png";
import {jwtDecode} from "jwt-decode";

function CoursePositions() {
  const { name } = useParams();
  const [toggledPos, setToggledPos] = useState(null); // State for toggled position
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState();

  const userHandle = async () => {
    const tokenCookie = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="));

    const token = tokenCookie ? tokenCookie.split("=")[1] : null;

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log(decoded);
        const userDataResponse = await axios.get(
          `https://s51-jesudaszion-capstone-trainliketrainer.onrender.com/user/${decoded.email}`
        );

        setUserData(userDataResponse.data);
        console.log(decoded);
        console.log(userDataResponse.data);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };

  const fetch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/sports/${name}`);
      setData(response.data.positions);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetch();
    userHandle();
  }, []);

  const handleToggle = (posName) => {
    setToggledPos((prevPos) => (prevPos === posName ? null : posName));
  };

  const isLessonCompleted = (lessonName) => {
    console.log(userData && userData.lessons.some((lesson) => lesson.name === lessonName))
    return userData && userData.lessons.some((lesson) => lesson.name === lessonName);
  };

  return (
    <>
      <NavBar />
      <h1 className="pageHeading">{name} positions</h1>
      <div id="sports_container">
        {data &&
          data.map((pos, index) => (
            <div key={index}>
              <div onClick={() => handleToggle(pos.name)} className="sports_tab">
                <div className="marker">
                  <div className="straitDiv"></div>
                  <div className="squreDiv"></div>
                  <div className="straitDiv"></div>
                </div>
                <div>
                  <p className={`SportsPosName ${toggledPos === pos.name ? "colorChange" : ""}`}>{pos.name}</p>
                </div>
                <div>
                  <img className={`dropdown ${toggledPos === pos.name ? "rotated" : ""}`} src={dropdown} alt="" />
                </div>
              </div>
              {toggledPos === pos.name && (
                <div className="courseSub">
                  {pos.characteristics.map((item, index) => (
                    <Link to={`/course/${name}/${pos.name}/${item.name}`} key={index}>
                      <div className="subParts">
                        <div className="marker">
                          <div className="straitDiv"></div>
                          <div className={`squreDiv ${isLessonCompleted(item.name) ? "completed" : ""}`}></div>
                          <div className="straitDiv"></div>
                        </div>
                        <div className="SportsPosName" key={index}>{item.name}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </>
  );
}

export default CoursePositions;
