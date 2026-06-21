import React, { useState } from 'react';
import axios from 'axios';
import { FaUser } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactSupport = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        message: ''
    });

    const [formErrors, setFormErrors] = useState({
        name: '',
        email: '',
        mobile: '',
        message: ''
    });

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateMobile = (mobile) => {
        const mobileRegex = /^[0-9]{10}$/;
        return mobileRegex.test(mobile);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));

        switch (name) {
            case 'name':
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    name: value.length >= 3 ? '' : 'Name must be at least 3 characters'
                }));
                break;
            case 'email':
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    email: validateEmail(value) ? '' : 'Invalid email format'
                }));
                break;
            case 'mobile':
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    mobile: validateMobile(value) ? '' : 'Invalid mobile number'
                }));
                break;
            case 'message':
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    message: value.length >= 20 ? '' : 'Message must be at least 20 characters'
                }));
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for errors before submission
        const errors = {
            name: formData.name.length >= 3 ? '' : 'Name must be at least 3 characters',
            email: validateEmail(formData.email) ? '' : 'Invalid email format',
            mobile: validateMobile(formData.mobile) ? '' : 'Invalid mobile number',
            message: formData.message.length >= 20 ? '' : 'Message must be at least 20 characters',
        };

        setFormErrors(errors);

        if (!Object.values(errors).some((error) => error)) {
            try {
                const response = await axios.post('http://localhost/v2v/BackEnd/sendEmail.php', formData);
                if (response.status === 200) {
                    toast.success("Form submitted successfully!");

                    // Reset form inputs to initial state
                    setFormData({
                        name: '',
                        email: '',
                        mobile: '',
                        message: ''
                    });
                } else {
                    toast.error("Failed to submit the form.");
                }
            } catch (error) {
                toast.error("An error occurred while submitting the form.");
                console.error(error); // Log error for debugging
            }
        } else {
            toast.error("Please fix the errors before submitting.");
        }
    };

    return (
        <section className='contactSupport' id='contactSupport' >
            <div className="container">
                <h2 className='text-center py-2'>CONTACT SUPPORT</h2>
                <div className="row d-flex justify-content-center">
                    <div className="col-md-8">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <div className="input-group">
                                    <span className="input-group-text" id="basic-addon1">
                                        <FaUser />
                                    </span>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        placeholder="Name"
                                        aria-label="name"
                                        aria-describedby="basic-addon1"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                {formErrors.name && <small className="text-danger">{formErrors.name}</small>}
                            </div>

                            <div className="mb-3">
                                <div className="input-group">
                                    <span className="input-group-text" id="basic-addon1">
                                        <IoIosMail />
                                    </span>
                                    <input
                                        type="email" // Changed to 'email'
                                        name="email"
                                        className="form-control"
                                        placeholder="Email"
                                        aria-label="email"
                                        aria-describedby="basic-addon1"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                {formErrors.email && <small className="text-danger">{formErrors.email}</small>}
                            </div>

                            <div className="mb-3">
                                <div className="input-group">
                                    <span className="input-group-text" id="basic-addon1">
                                        <FaPhone />
                                    </span>
                                    <input
                                        type="text"
                                        name="mobile"
                                        className="form-control"
                                        placeholder="Mobile Number"
                                        aria-label="mobile"
                                        aria-describedby="basic-addon1"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                {formErrors.mobile && <small className="text-danger">{formErrors.mobile}</small>}
                            </div>

                            <div className="mb-3">
                                <textarea
                                    className="form-control"
                                    id="message"
                                    name='message'
                                    placeholder='Message'
                                    rows="3"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                ></textarea>
                                {formErrors.message && <small className="text-danger">{formErrors.message}</small>}
                            </div>

                            <button type="submit" className="sendMsg">
                                SEND MESSAGE
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </section>
    );
};

export default ContactSupport;
