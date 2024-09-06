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
        if (!validateEmail(email)) {
            alert("Invalid email format");
            return;
        }

        // Phone validation
        if (!validatePhone(phone)) {
            alert("Invalid phone number");
            return;
        }

        // Password match validation
        if (password !== confirmPassword) {
            console.log(passwordInputRef.current.getAttribute("type"), password);
            console.log(confirmPasswordInputRef.current.getAttribute("type"), confirmPassword);
            alert("Passwords do not match");
            return;
        }

        // If all validations pass, send data to backend
        try {
            const response = await axios.post('http://localhost:5000/api/register', { // Update with your actual backend endpoint
                name,
                email,
                phone,
                password,
                confirmPassword,
            });

            alert(response.data.message);
            // Handle successful registration (e.g., redirect to login page or show a success message)
            window.location.href = '/login'; // Example of redirection
        } catch (error) {
            if(error.response)
            {
                alert(error.response.data.error);
            }
            else
            {
                alert("Something went wrong!");
            }
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
                        <form id="registrationForm" onSubmit={finalValidate}>
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
                                <span id="email-error"></span>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    placeholder="Enter Mobile Number"
                                    ref={phoneInputRef}
                                    required
                                />
                                <span id="phone-error"></span>

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
                                <input type="submit" value="Register" />
                            </div>
                        </form>
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
