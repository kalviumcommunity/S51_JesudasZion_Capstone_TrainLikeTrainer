import React from "react";
import NavBar from "./NavBar";
import "../CSS_files/Course.css";
import { Link } from "react-router-dom";
import football from "../assets/football_icon.png"
import Cricket from "../assets/cricket_icon.png"
import basketball from "../assets/basketball_icon.png"
import tennis from "../assets/tennis_icon.png"
import badminton from "../assets/badminton_icon.png"



function Course() {
  return (
    <>
      <NavBar></NavBar>
      {/* <h1 id="sports_header">Choose your sports.</h1> */}
      <div className="header_course">
        <h1>Select the sport you want to master</h1>
      </div>
      <div id="sports_constainer_main">
        <Link to="/course/Football">
          <div className="sports_tabs" style={{ backgroundColor: '#FFDAB9' }} >
            <div className="image_course" >
              <img src={football} alt="" />
            </div>
            <div className="name_course" >
              <p>Football</p>
            </div>
          </div>
        </Link>
        <Link to="/course/Cricket">
          <div className="sports_tabs"  >
            <div className="image_course"style={{ backgroundColor: '#87CEEB' }}>
            <img src={Cricket} alt="" />
            </div>
            <div className="name_course">
              <p>Cricket</p>
            </div>
          </div>
        </Link>

        <Link className="b" to="/course/Basketball">
          <div className="sports_tabs"  >
            <div className="image_course" style={{ backgroundColor: '#FF7F50' }}>
            <img src={basketball} alt="" />
            </div>
            <div className="name_course">
              <p>Basket Ball</p>
            </div>
          </div>
        </Link>

        <Link  to="/course/Tennis">
          <div className="sports_tabs" >
           <div className="image_course" style={{ backgroundColor: '#FFD700' }}>
           <img src={tennis} alt="" />
           </div>
            <div className="name_course">
              <p>Tennis</p>
            </div>
          </div>
        </Link>

        <Link to="/course/Badminton">
          <div className="sports_tabs" style={{ backgroundColor: '#98FB98' }} >
           <div className="image_course"> <img src={badminton} alt="" /></div>
            <div className="name_course">
              <p>Badminton</p>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}

export default Course;
