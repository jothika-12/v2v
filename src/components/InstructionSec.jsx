import React from 'react'

const InstructionSec = () => {
    return (
        <section className="instructionSec" id='instructionSec'style={{ paddingTop: '100px' }}>

            <div className="container">
                <div className="row g-4">

                    <h2 className='text-center mb-4'>INSTRUCTION</h2>

                    <div className=" col-xl-3 col-lg-6 ">
                        <div className="instrCard purple">

                            <p className="instructTitle">
                                Upload Question Paper
                            </p>
                            <p className="instructCont">
                                Choose your question paper file in either image or PDF format.then upload it to start the audio output process.
                            </p>
                        </div>
                    </div>

                    <div className=" col-xl-3 col-lg-6 ">

                        <div className="instrCard white">

                            <p className="instructTitle">
                                Listen to Questions
                            </p>
                            <p className="instructCont">
                                The system will read each question aloud, providing clear audio output. Simply listen to the question being read out and prepare your answer.
                            </p>
                        </div>
                    </div>
                    <div className=" col-xl-3 col-lg-6 ">
                        <div className="instrCard white">

                            <p className="instructTitle">
                                Speak Your Answer
                            </p>
                            <p className="instructCont">
                                After listening to the question, speak your answer clearly into the microphone,it will convert your spoken response into text.
                            </p>
                        </div>
                    </div>
                    <div className=" col-xl-3 col-lg-6 ">
                        <div className="instrCard purple">

                            <p className="instructTitle">
                                Submit for Printing
                            </p>
                            <p className="instructCont">
                                Once you’ve answered all questions, review your responses and click “Submit.” Your answers will be prepared for printing.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}

export default InstructionSec