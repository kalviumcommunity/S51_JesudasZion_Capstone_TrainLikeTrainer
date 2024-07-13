import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function SubCourse() {
  const { name, pos } = useParams();
  const [reqData, setReqData] = useState({});

  const fetch = async () => {
    try {
      const response = await axios.get(`https://s51-jesudaszion-capstone-trainliketrainer.onrender.com/sports/${name}`);
      let temp = response.data.positions.filter((item) => {
        return item.name == pos;
      });

      setReqData(temp[0]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetch();
  }, []);
  return (
    <>
      <NavBar></NavBar>
      <div id="sports_constainer">
        {reqData.characteristics &&
          reqData.characteristics.map((data, index) => {
            return (
              <Link to={`/course/${name}/${pos}/${data.name}`} key={index}>
                <div className="sports_tab">
                  <img src="" alt="" />
                  <div>
                    <p>{data.name}</p>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </>
  );
}

export default SubCourse;
