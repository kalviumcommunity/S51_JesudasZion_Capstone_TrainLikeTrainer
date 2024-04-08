import React ,{useState ,useEffect} from 'react'
import logo from "../assets/Logo_Train.png"
import searchIcon from "../assets/searchIcon.png"
import courseIcon from "../assets/course.png"
import homeIcon from "../assets/homeIcon.png"
import "../CSS_files/Nav.css"

function NavBar() {
    const [showMenu, setShowMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        const checkWindowSize = () => {
            setIsMobile(window.innerWidth < 769);
        };

        // Initial check
        checkWindowSize();

        // Event listener for window resize
        window.addEventListener('resize', checkWindowSize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', checkWindowSize);
        };
    }, []);


  return (
    <>
        <nav>
            <img id='logo' src={logo} alt="" />

            {isMobile ? (
                     <div className={`hamburger-menu ${showMenu ? 'active' : ''}`} onClick={toggleMenu}>
                        <div className="bar1"></div>
                        <div className="bar2"></div>
                        <div className="bar3"></div>
                    </div>
                ) : (
                    <>
                        <div id='nav_buttons_main'>
                        <div className='buttons_navigator' id='nav_buttons_home'>
                            <img src={homeIcon} alt="" />
                            <p>Home</p>
                        </div>

                        <div className='buttons_navigator' id='nav_buttons_course'>
                            <img src={courseIcon} alt="" />
                            <p>Courses</p>
                        </div>
                    </div>

                    <div id='search_bar'>
                    <div id='search_icon_div'>
                        <img src={searchIcon} alt="" />
                    </div>
                    <input type="text" />
                </div>

                 <div className={`hamburger-menu ${showMenu ? 'active' : ''}`} onClick={toggleMenu}>
                        <div className="bar1"></div>
                        <div className="bar2"></div>
                        <div className="bar3"></div>
                    </div>
                    </>
                )}

                
            </nav>
        {showMenu && !isMobile &&(
        <div className="popup-menu">
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Account</a></li>
            <li><a href="#">Logout</a></li>
          </ul>
        </div>
      )}

{isMobile && showMenu && (
                <div className="popup-menu">
                    <ul>
                    <li id="search-mobile">
                            <div id='search_icon_div'>
                                <img src={searchIcon} alt="" />
                            </div>
                            <input type="text" placeholder="Search" />
                        </li>
                        <li>
                            <img src={homeIcon} alt="" />
                            <p>Home</p>
                        </li>
                        <li>
                            <img src={courseIcon} alt="" />
                            <p>Courses</p>
                        </li>
                        
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Account</a></li>
                        <li><a href="#">Logout</a></li>
                    </ul>
                </div>
            )}
    </>
  )
}

export default NavBar