import React from 'react';
import aboutSecImg from '../images/aboutUs.png'

const AboutUs = () => {
    return (
        <section className="aboutUs" id='aboutUs' style={{ paddingTop: '100px' }}>
            <div className="container">


                <div className="row">
                    <h2 className='text-center'>ABOUT US </h2>
                    <div className="col-md-8">

                        <h4>
                            Mission
                        </h4>
                        <p>We empower visually challenged individuals with
                            a platform that makes exam-taking accessible and
                            independent. Our technology converts exam
                            content to audio and enables easy recording
                            and submission of answers.
                            We bridge the gap between technology and
                            accessibility, ensuring everyon e can confidently take exams.</p>


                        <h4>Vision</h4>
                        <p>To be the top platform for accessible exams,
                            empowering visually impaired individuals to
                            take exams with confidence and independence.
                            We strive for a seamless and inclusive
                            experience for everyone.</p>
                    </div>

                    <div className="col-md-4">
                    <img src={aboutSecImg} alt=""  className='img-fluid'/>
                    </div>
                </div>

            </div>
        </section >
    )
}

export default AboutUs