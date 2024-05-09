import React from "react";
import NavBar from "./NavBar";
import "../CSS_files/Course.css";
import { Link } from "react-router-dom";

function Course() {
  return (
    <>
      <NavBar></NavBar>
      <h1 id="sports_header">Choose your sports.</h1>
      <div id="sports_constainer">
        <Link to="/course/Football">
          <div className="sports_tab">
            <img src="" alt="" />
            <div>
              <p>Football</p>
            </div>
          </div>
        </Link>
        <Link to="/course/Cricket">
          <div className="sports_tab">
            <img src="" alt="" />
            <div>
              <p>Cricket</p>
            </div>
          </div>
        </Link>

        <Link to="/course/Basketball">
          <div className="sports_tab">
            <img src="" alt="" />
            <div>
              <p>Basket Ball</p>
            </div>
          </div>
        </Link>

        <Link  to="/course/Tennis">
          <div className="sports_tab">
            <img src="" alt="" />
            <div>
              <p>Tennis</p>
            </div>
          </div>
        </Link>

        <Link to="/course/Badminton">
          <div className="sports_tab">
            <img src="" alt="" />
            <div>
              <p>Badminton</p>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}

export default Course;
