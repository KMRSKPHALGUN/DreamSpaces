import axios from 'axios';
import React, { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import '../css/login_signup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Eye from '../images/eye.svg';
import EyeHide from '../images/hide.svg';
import Signupp from '../images/loginn.jpeg';

function Signup() {
    const localhost = localStorage.getItem('localhost');
    let navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formValidated, setFormValidated] = useState(false);
    const [formData, setFormData] = useState({});
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [otpEmail, setOtpEmail] = useState(new Array(6).fill(""));
    const [otpPhone, setOtpPhone] = useState(new Array(6).fill(""));

    const [errors, setErrors] = useState({});
    const [inputs, setInputs] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    function validateName(name)
    {
        const validRegex = /^(?=.*[A-Za-z])[A-Za-z\s-\.+_@#$%^&*]{2,20}$/;
        return validRegex.test(name);
    }

    function validateEmail(email) {
        const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return validRegex.test(email);
    }

    function validatePhone(phone) {
        return phone.length === 10;
    }

    const handleChange = (field, value) => {
        setInputs({ ...inputs, [field]: value });

        let newErrors = { ...errors };

        // Real-time validation for each field
        if (field === 'name' && !value.trim()) {
            newErrors.name = "Name is required";
        } else if (field === 'name' && value.length < 2) {
            newErrors.name = "Name is too short";
        } else if (field === 'name' && value.length > 20) {
            newErrors.name = "Name is too long";
        } else if (field === 'name' && !validateName(value)) {
            newErrors.name = "Invalid name format";
        } else if (field === 'email' && !validateEmail(value)) {
            newErrors.email = "Invalid email format";
        } else if (field === 'phone' && !validatePhone(value)) {
            newErrors.phone = "Phone number must be 10 digits";
        } else if (field === 'password' && value.length < 6) {
            newErrors.password = "Password is too short";
        } else if (field === 'confirmPassword' && inputs.password && value !== inputs.password) {
            newErrors.confirmPassword = "Passwords do not match";
        } else {
            delete newErrors[field];
        }

        setErrors(newErrors);
    };

    // Handle OTP input changes
    const handleEmailOtpChange = (element, index) => {
        const newOtp = [...otpEmail];
        newOtp[index] = element.value;
        setOtpEmail(newOtp);

        // Focus the next input field automatically
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    const handlePhoneOtpChange = (element, index) => {
        const newOtp = [...otpPhone];
        newOtp[index] = element.value;
        setOtpPhone(newOtp);

        // Focus the next input field automatically
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (Object.keys(errors).length > 0) {
            alert("Please fix the errors before submitting");
            return;
        }

        setFormData(inputs);
        setFormValidated(true);

        try {
            const response = await axios.post(`https://${localhost}:5000/api/verifyUser`, { email: inputs.email, phone: inputs.phone });
            if (response.data.success) {
                setIsOtpStep(true);
            }
        } catch (error) {
            if (error.response) {
                // Handle the 409 Conflict status here
                alert(error.response.data.message);
            } else {
                // Handle other types of errors
                console.log("errrorrrrr!!!1")
                alert("Something went wrong!");
            }
        }
    };

    const submitOtp = async (event) => {
        event.preventDefault();
        const otpEmailValue = otpEmail.join("");
        const otpPhoneValue = otpPhone.join("");
        if (otpEmailValue.length !== 6 || otpPhoneValue.length !== 6) {
            alert("Please enter a 6-digit OTP");
            return;
        }

        try {
            const response = await axios.post(`https://${localhost}:5000/api/register`, {
                ...inputs,
                otpEmail: otpEmailValue,
                otpPhone: otpPhoneValue
            });

            if (response.data.success) {
                alert("Registration successful");
                navigate('/login');
            } else {
                alert(response.data.error);
            }
        } catch (error) {
            alert("Something went wrong!");
        }
    };

    return (
        <section className="section">
            <button className="back-button" onClick={() => navigate(-1)}><FontAwesomeIcon icon={faArrowLeft}/></button>
            <div className="container active">
                <div className="user signup">
                    <div className="form-box">
                        <div className="top">
                            <p>
                                Already a member?
                                <span data-id="#1a1aff"><a href="/login">Login now</a></span>
                            </p>
                        </div>

                        {isOtpStep ? (
                            <form id="otpForm" onSubmit={submitOtp}>
                                <div className="form-control">
                                    <h2>Enter OTP sent to Email</h2>
                                    <p>Check your email for the OTP.</p>

                                    <div className="otp-container">
                                        {otpEmail.map((digit, index) => (
                                            <input
                                                key={index}
                                                type="password"
                                                maxLength="1"
                                                className="otp-input"
                                                value={digit}
                                                onChange={(e) => handleEmailOtpChange(e.target, index)}
                                            />
                                        ))}
                                    </div>

                                    <h2>Enter OTP sent to Phone</h2>
                                    <p>Check your phone for the OTP.</p>

                                    <div className="otp-container">
                                        {otpPhone.map((digit, index) => (
                                            <input
                                                key={index}
                                                type="password"
                                                maxLength="1"
                                                className="otp-input"
                                                value={digit}
                                                onChange={(e) => handlePhoneOtpChange(e.target, index)}
                                            />
                                        ))}
                                    </div>

                                    <input type="submit" value="Verify OTP" />
                                </div>
                            </form>
                        ) : (
                            <form id="registrationForm" onSubmit={handleSubmit}>
                                <div className="form-control">
                                    <h2>Welcome To DreamSpaces!</h2>
                                    <p>"Explore and enjoy."</p>

                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Enter Name"
                                        value={inputs.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        style={{ borderColor: errors.name ? 'red' : '' }}
                                    />
                                    {errors.name && <p className="error-message">{errors.name}</p>}

                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Enter Email"
                                        value={inputs.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        style={{ borderColor: errors.email ? 'red' : '' }}
                                    />
                                    {errors.email && <p className="error-message">{errors.email}</p>}

                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        placeholder="Enter Mobile Number"
                                        value={inputs.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        style={{ borderColor: errors.phone ? 'red' : '' }}
                                    />
                                    {errors.phone && <p className="error-message">{errors.phone}</p>}

                                    <div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            placeholder="Password"
                                            value={inputs.password}
                                            onChange={(e) => handleChange('password', e.target.value)}
                                            style={{ borderColor: errors.password ? 'red' : '' }}
                                        />
                                        <div className="icon form-icon" onClick={() => setShowPassword(!showPassword)}>
                                            <img src={showPassword ? EyeHide : Eye} alt="Toggle visibility" />
                                        </div>
                                    </div>
                                    {errors.password && <p className="error-message">{errors.password}</p>}

                                    <div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            value={inputs.confirmPassword}
                                            onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                            style={{ borderColor: errors.confirmPassword ? 'red' : '' }}
                                        />
                                        <div className="icon form-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            <img src={showConfirmPassword ? EyeHide : Eye} alt="Toggle visibility" />
                                        </div>
                                    </div>
                                    {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

                                    <input type="submit" value="Register" />
                                </div>
                            </form>
                        )}
                    </div>
                    <div className="img-box">
                        <img src={Signupp} alt="" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Signup;
