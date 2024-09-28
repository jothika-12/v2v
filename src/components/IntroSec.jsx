import React from 'react';
import instroSecImg from '../images/intro-right.png'

const IntroSec = () => {
  return (
    <section className='introSec'>
      <div className="container">
        <div className="row d-flex justify-content-center text-center">
          <div className="col-md-8 ">


            <h1>
              WELCOME TO THE <span className="titleHighlight">
                VISION TO VOICE
              </span> FOR VISUALLY CHALLANGED PEOPLE
            </h1>


            <p>VISION TO VOICE transforms exams for the visually
              challenged by converting questions into audio and transcribing
              spoken answers into text. We aim to make the exam experience independent
              and accessible for all."</p>

          </div>
          <div className="col-md-8">
            <img src={instroSecImg} alt="" className='img-fluid' />
          </div>
        </div>
      </div>
    </section>
  )
}

export default IntroSec