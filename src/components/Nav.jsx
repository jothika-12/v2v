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

        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
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

    )
}

export default Nav