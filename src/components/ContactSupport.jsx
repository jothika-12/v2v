import React, { useState } from 'react';
import contactSecImg from '../images/contactUsSecImg.png';
import { FaUser } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ContactSupport = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [formErrors, setFormErrors] = useState({
        name: '',
        email: '',
        message: ''
    });

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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
                    name: value
                        ? value.length >= 3
                            ? ''
                            : 'Name must be at least 3 characters'
                        : 'Name is required'
                }));
                break;
            case 'email':
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    email: value
                        ? validateEmail(value)
                            ? ''
                            : 'Invalid email format'
                        : 'Email is required'
                }));
                break;

            case 'message':
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    message: value
                        ? value.length >= 20
                            ? ''
                            : 'Message must be at least 20 characters'
                        : 'Message is required'
                }));
                break;
            default:
                break;
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = {
            name: formData.name
                ? formData.name.length >= 3
                    ? ''
                    : 'Name must be at least 3 characters'
                : 'Name is required',
            email: formData.email
                ? validateEmail(formData.email)
                    ? ''
                    : 'Invalid email format'
                : 'Email is required',
            message: formData.message
                ? formData.message.length >= 20
                    ? ''
                    : 'Message must be at least 20 characters'
                : 'Message is required'
        };

        setFormErrors(errors);

        if (!errors.name && !errors.email && !errors.message) {
            console.log("Form submitted:", formData);
            toast.success("Form submitted successfully!");
        } else {
            toast.error("Please fix the errors before submitting.");
        }
    };

    return (
        <section className='contactSupport' id='contactSupport' style={{ paddingTop: '100px' }}>
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
                                        placeholder="name"
                                        aria-label="name"
                                        aria-describedby="basic-addon1"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />

                                </div>
                                {formErrors.name && (
                                    <small className="text-danger">{formErrors.name}</small>
                                )}
                            </div>
                            <div className="mb-3">

                                <div className="input-group ">
                                    <span className="input-group-text" id="basic-addon1">
                                        <IoIosMail />
                                    </span>
                                    <input
                                        type="text"
                                        name="email"
                                        className="form-control"
                                        placeholder="Email"
                                        aria-label="email"
                                        aria-describedby="basic-addon1"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                {formErrors.email && (
                                    <small className="text-danger">{formErrors.email}</small>
                                )}

                            </div>

                            <div class="mb-3">

                                <div>


                                    <label for="exampleFormControlTextarea1" class="form-label">Example textarea</label>
                                    <textarea class="form-control" id="exampleFormControlTextarea1" name='message' rows="3" value={formData.message}
                                        onChange={handleInputChange}></textarea>

                                </div>
                                {formErrors.message && (
                                    <small className="text-danger">{formErrors.message}</small>
                                )}
                            </div>



                            <button type="submit" className="sendMsg">
                                SEND MESSAGE
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSupport;
