import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NavBar from './NavBar';


const FinalCourse = () => {
  const { name, pos, skill } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/sports/${name}`);
        setData(response.data.positions);
      } catch (error) {
        console.error(error);
      }
    };

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
      <NavBar />
      <div className="final-container">
        <h1 className="final-heading">{pos} - {skill}</h1>
        {data.map(position => {
          if (position.name.toLowerCase() === pos.toLowerCase()) {
            const characteristic = position.characteristics.find(
              characteristic => characteristic.name.toLowerCase() === skill.toLowerCase()
            );
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
        <button className='mark_button'>Mark As Done</button>
      </div>
    </>
  );
};

export default FinalCourse;
