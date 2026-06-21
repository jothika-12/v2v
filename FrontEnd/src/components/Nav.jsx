import React, { useState } from 'react';
import { CgMenuRightAlt } from "react-icons/cg";
import logo from '../images/v2v.png'
const Nav = () => {



    const [activeLink, setActiveLink] = useState('Home');

    // const handleClick = (link) => {
    //     setActiveLink(link);
    // };



    const handleClick = (id) => {
        setActiveLink(id);

        const section = document.getElementById(id);
        if (section) {
            // Scroll to the element
            section.scrollIntoView({
                behavior: 'smooth',
            });

            // Adjust scroll position by offset of 100px
            window.scrollBy(0, -100);
        }


    }
    return (
        <><nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Navbar
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Link
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Dropdown
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link disabled"
                  href="#"
                  tabIndex={-1}
                  aria-disabled="true"
                >
                  Disabled
                </a>
              </li>
            </ul>
            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
      

            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container">
                    {/* <a className="navbar-brand" href="#">V2V</a> */}
                    <a className="navbar-brand" href="/"> <img src={logo} alt="" height={50} /></a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        {/* <span className="navbar-toggler-icon"></span> */}
                        <CgMenuRightAlt />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a
                                    className={`nav-link pt-1 ${activeLink === 'Home' ? 'active' : ''}`}
                                    href="/"
                                    onClick={() => handleClick('Home')}
                                >
                                    Home
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link pt-1 ${activeLink === 'aboutUs' ? 'active' : ''}`}
                                    href="#aboutUs"
                                    onClick={() => handleClick('aboutUs')}
                                >
                                    ABOUT US
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link pt-1 ${activeLink === 'Link2' ? 'active' : ''}`}
                                    href="#instructionSec"
                                    onClick={() => handleClick('Link2')}
                                >
                                    Instructions
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link pt-1 ${activeLink === 'Link3' ? 'active' : ''}`}
                                    href="#meetOurTeam"
                                    onClick={() => handleClick('Link3')}
                                >
                                    Team
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link pt-1 ${activeLink === 'Link4' ? 'active' : ''}`}
                                    href="#contactSupport"
                                    onClick={() => handleClick('Link4')}
                                >
                                    Support
                                </a>
                            </li>

                            <li className="nav-item">
                                <a href="#startExamSec" className='' >
                                    <button className='startXamBtn'>  START EXAM </button>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Nav