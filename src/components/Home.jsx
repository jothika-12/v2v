import React from 'react';
import IntroSec from './IntroSec';
import AboutUs from './AboutUs';
import InstructionSec from './InstructionSec';
import StartExam from './StartExam';
import MeetOurTeam from './MeetOurTeam';
import ContactSupport from './ContactSupport';
import Footer from './Footer';

import DemoCarosole from './DemoCarosole';

const Home = () => {
    return (
        <div className='homeSectionMain'>
            <IntroSec />
            <AboutUs />
            <InstructionSec />
            <StartExam />
            <MeetOurTeam />
            <ContactSupport />
            <Footer />


        </div>
    )
}

export default Home