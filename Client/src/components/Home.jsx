import React from 'react'
import NavBar from './NavBar'
import "../CSS_files/Home.css"

function Home() {
  return (
    <>
        <NavBar></NavBar>
        <div id='homeContainer'>
          <section id='left_home'>
          <div id='userWelcome'>
            <p>Hi Jesudas</p>
            <p>It's nice to see you again.</p>

            </div>

            <div id='dailyScore'>

            </div>

            <div id='home_buttons'>
              <div id='course'>

              </div>
              <div id='forum'>

              </div>
            </div>
          </section>

          <section id='right_home'>
                <p>Latest Sports News</p>
                <div id='newsContainer'>
                <div className='newsContent'></div>
                <div className='newsContent'></div>
                <div className='newsContent'></div>
                <div className='newsContent'></div>
                <div className='newsContent'></div>
                <div className='newsContent'></div>
                </div>
          </section>
        </div>
    </>
  )
}

export default Home