import React from 'react';
import { FaFacebookF, FaTwitter, FaGithub } from "react-icons/fa";
import Slider from "react-slick";
import jothikaProfile from '../images/jothika.png';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const teamMembers = [
  {
    name: "Jothika",
    department: "Software Systems",
    year: "2nd Year",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tincidunt, lorem eget bibendum vehicula.",
    imgSrc: jothikaProfile,
    social: { facebook: '#', twitter: '#', github: '#' }
  },
  {
    name: "Rajesh",
    department: "Computer Science",
    year: "3rd Year",
    bio: "Rajesh is an excellent team player with a deep understanding of backend development.",
    imgSrc: jothikaProfile, // Replace with actual image source
    social: { facebook: '#', twitter: '#', github: '#' }
  },
  {
    name: "Sanjana",
    department: "Electronics",
    year: "4th Year",
    bio: "Sanjana specializes in hardware and IoT systems and enjoys building innovative projects.",
    imgSrc: jothikaProfile, // Replace with actual image source
    social: { facebook: '#', twitter: '#', github: '#' }
  },
  // Add more team members as needed
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }
  ]
};

const MeetOurTeam = () => {
  return (
    <section className="meetOurTeam" id='meetOurTeam'style={{ paddingTop: '100px' }}>
      <div className="container">
        <h2 className='text-center '>MEET OUR TEAM</h2>
        <Slider {...sliderSettings}>
          {teamMembers.map((member, idx) => (
            <div key={idx} className="px-4 d-flex justify-content-center">
              <div className="teamMemDetailCont">
                <div className="topCardImg">
                  <img src={member.imgSrc} alt={member.name} className='img-fluid' />
                </div>
                <div className="bottomCardDetails">
                  <p className="teamMemName mb-0 py-1">{member.name}</p>
                  <p className="deptYr mb-0">{member.department}, {member.year}</p>
                  <p className="aboutTeamMem">{member.bio}</p>
                  <p className="contactLinks mb-0">
                    <a href={member.social.facebook}><FaFacebookF /></a>
                    <a href={member.social.twitter}><FaTwitter /></a>
                    <a href={member.social.github}><FaGithub /></a>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default MeetOurTeam;
