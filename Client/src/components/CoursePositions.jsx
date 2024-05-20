import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";
import dropdown from "../assets/dropdown.png"

function CoursePositions() {
  const { name } = useParams();
  const [toggledPos, setToggledPos] = useState(null); // State for toggled position
  const [data, setData] = useState([]);

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
  }, []);

  const handleToggle = (posName) => {
    setToggledPos((prevPos) => (prevPos === posName ? null : posName));
  };

  return (
    <>
      <NavBar />
      <h1 className="pageHeading">{name} positions</h1>
      <div id="sports_container">
        {data &&
          data.map((pos, index) => (
            <div key={index}>
              <div
                onClick={() => handleToggle(pos.name)}
                className="sports_tab"
              >
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
                        <div className="squreDiv"></div>
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
