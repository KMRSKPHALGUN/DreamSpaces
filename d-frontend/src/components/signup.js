import axios from 'axios';
import React, { useState, useRef } from "react";
import '../css/login_signup.css';
import Eye from '../images/eye.svg';
import EyeHide from '../images/hide.svg';
import Signupp from '../images/loginn.jpeg';

function Signup() {
    // State for controlling password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formValidated, setFormValidated] = useState(false); // Toggle between form and OTP
    const [formData, setFormData] = useState({}); // Store form data
    
    // State for OTP step
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [otp, setOtp] = useState(new Array(6).fill(""));

    // Refs for input fields
    const nameInputRef = useRef(null);
    const emailInputLoginRef = useRef(null);
    const phoneInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    const confirmPasswordInputRef = useRef(null);
    

    // Email validation function
    function validateEmail(email) {
        const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return validRegex.test(email);
    }

    // Phone number validation function
    function validatePhone(phone) {
        return phone.length === 10; // Assuming phone numbers should be 10 digits
    }

    // Handle OTP input changes
    const handleOtpChange = (element, index) => {
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus the next input field automatically
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    // Final validation function on form submit
    const finalValidate = async (event) => {
        event.preventDefault(); // Prevent form submission by default

        const name = nameInputRef.current.value;
        const email = emailInputLoginRef.current.value;
        const phone = phoneInputRef.current.value;
        const password = passwordInputRef.current.value;
        const confirmPassword = confirmPasswordInputRef.current.value;

        // Name validation
        if (name.trim() === '') {
            alert("Name is required");
            return;
        }

        // Email validation
        else if (!validateEmail(email)) {
            alert("Invalid email format");
            return;
        }

        // Phone validation
        else if (!validatePhone(phone)) {
            alert("Invalid phone number");
            return;
        }

        // Password match validation
        else if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        else{
            if (name && email && phone && password === confirmPassword) {
                // If validated, store the data in the state
                setFormData({ name, email, phone, password, confirmPassword });
                setFormValidated(true); // Move to OTP screen
            } else {
                alert("Validation failed");
            }
        }

        // Send request to backend to initiate OTP process (but do not send the form data yet)
        try {
            const response = await axios.post('http://localhost:5000/api/verifyEmail', { email });
            if (response.data.success) {
                setIsOtpStep(true); // Show OTP step after successful validation
            } else {
                alert("Failed to send OTP. Check your Email.");
            }
        } catch (error) {
            alert("Something went wrong!");
        }
    };

    // Handle OTP submission
    const submitOtp = async (event) => {
        event.preventDefault();
        const otpValue = otp.join("");
        if (otpValue.length !== 6) {
            alert("Please enter a 6-digit OTP");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/register', {
                name: formData.name, email: formData.email, phone: formData.phone, password: formData.password, confirmPassword: formData.confirmPassword, otp: otpValue
            });

            if (response.data.success) {
                alert("Registration successful");
                window.location.href = '/login'; // Redirect after success
            } else {
                alert(response.data.error);
            }
        } catch (error) {
            alert("Something went wrong!");
        }
    };

    return (
        <section className="section">
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
                            // OTP Step
                            <form id="otpForm" onSubmit={submitOtp}>
                                <div className="form-control">
                                    <h2>Enter OTP</h2>
                                    <p>Check your email for the OTP.</p>

                                    <div className="otp-container">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength="1"
                                                className="otp-input"
                                                value={digit}
                                                onChange={(e) => handleOtpChange(e.target, index)}
                                            />
                                        ))}
                                    </div>

                                    <input type="submit" value="Verify OTP" />
                                </div>
                            </form>
                        ) : (
                            // Signup Form
                            <form id="registrationForm">
                                <div className="form-control">
                                    <h2>Welcome To DreamSpaces!</h2>
                                    <p>"Explore and enjoy."</p>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Enter Name"
                                        ref={nameInputRef}
                                        required
                                    />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Enter Email"
                                        ref={emailInputLoginRef}
                                        required
                                    />
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        placeholder="Enter Mobile Number"
                                        ref={phoneInputRef}
                                        required
                                    />

                                    <div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            placeholder="Password"
                                            ref={passwordInputRef}
                                            required
                                        />
                                        <div className="icon form-icon" onClick={() => setShowPassword(!showPassword)}>
                                            <img src={showPassword ? EyeHide : Eye} alt="Toggle visibility" />
                                        </div>
                                    </div>
                                    <div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmpassword"
                                            name="confirmpassword"
                                            placeholder="Confirm Password"
                                            ref={confirmPasswordInputRef}
                                            required
                                        />
                                        <div className="icon form-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            <img src={showConfirmPassword ? EyeHide : Eye} alt="Toggle visibility" />
                                        </div>
                                    </div>
                                    <input type="submit" value="Register" onClick={finalValidate} />
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
