import React from 'react';
import "../CSS_files/Home.css";

function NewsBar({ data }) {
  console.log(data);

  // Define a function to handle click event
  const handleNewsClick = () => {
    // Open the link in a new tab when the div is clicked
    window.open(data.url, '_blank');
  };

  return (
    <>
      <div className='newsContent' onClick={handleNewsClick}>
        {/* <div>
          <img src={data.urlToImage} alt="" />
        </div> */}
        {/* <div> */}
          <p>{data.title}</p>
        {/* </div> */}
      </div>
    </>
  );
}

export default NewsBar;
