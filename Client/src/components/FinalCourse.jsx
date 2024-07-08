import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NavBar from './NavBar';
import { jwtDecode } from "jwt-decode";

const FinalCourse = () => {
  const { name, pos, skill } = useParams();
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState();
  const [isMarked, setIsMarked] = useState(false);

  const userHandle = async () => {
    const tokenCookie = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="));

    const token = tokenCookie ? tokenCookie.split("=")[1] : null;

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserData(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };

  const handleMark = async () => {
    console.log({ name: skill, _id: userData._id });
    try {
      await axios.put("http://localhost:3000/mark", { name: skill, _id: userData._id });
      setIsMarked(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://s51-jesudaszion-capstone-trainliketrainer.onrender.com/sports/${name}`);
        console.log(response.data.positions);
        setData(response.data.positions);
      } catch (error) {
        console.error(error);
      }
    };
    userHandle();
    fetchData();
  }, [name]);

  const processText = (text) => {
    let processedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    processedText = processedText.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    processedText = processedText.replace(/\*\*/g, '');
    processedText = processedText.replace(/\n/g, '<br>');
    return processedText;
  };

  return (
    <>
      {console.log(data)}
      <NavBar />
      <div className="final-container">
        <div id='final-left'>
        <h1 className="final-heading">{pos} - {skill}</h1>
        {data && data.map(position => {
          if (position.name.toLowerCase() === pos.toLowerCase()) {
            const characteristic = position.characteristics.find(
              characteristic => characteristic.name.toLowerCase() === skill.toLowerCase()
            )
            return (
              <div className="final-characteristic" key={position.name}>
                {characteristic && characteristic.content.map((item, index) => (
                  <div key={index}>
                    {item.type === 'text' && <p className="final-text-content" dangerouslySetInnerHTML={{ __html: processText(item.data) }} />}
                    {item.type === 'video' && (
                      <div className="final-video-container">
                        <iframe width="560" height="315" src={item.data} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          }
          return null;
        })}
        </div>
        

        <div id='final-right'>
          <div className='quotes_final'></div>
        <button onClick={handleMark} className='mark_button' disabled={isMarked}>
          {isMarked ? 'Marked As Done' : 'Mark As Done'}
          {console.log(isMarked)}
        </button>
        </div>
        
      </div>
    </>
  );
};

export default FinalCourse;
