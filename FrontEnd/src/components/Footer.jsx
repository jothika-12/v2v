import React from 'react'

const Footer = () => {
    return (
        <footer className="footerSec">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <p className="footerLogoName mb-0">VISION TO VOICE</p>
                        <p className='ourSlogan'> YOUR VOICE, YOUR XAM, YOUR INDEPENDENCE</p>
                    </div>
                    <div className="col-md-2 col-6">
                        <p className='footerMenus'>
                            <a href="">Start Exam</a>
                        </p>
                    </div>
                    <div className="col-md-2 col-6">
                        <p className='footerMenus'>
                            <a href="">Instruction</a>
                        </p>
                    </div>
                    <div className="col-md-2 col-6">
                        <p className='footerMenus'>
                            <a href="">Support</a>
                        </p>
                    </div>
                    <div className="col-md-2 col-6">
                        <p className='footerMenus'>
                            <a href="">About Us</a>
                        </p>
                    </div>
                </div>
                <p className='footerBase text-end'>Terms and Condition | © 2024 Vision to Voice.  All rights reserved.</p>

            </div>
        </footer>
    )
}

export default Footer