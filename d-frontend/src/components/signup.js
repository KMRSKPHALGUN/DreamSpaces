import React from "react";
import '../css/login_signup.css';
import Eye from '../images/eye.svg';
import Signupp from '../images/signupp.jpg';

function Signup() {
    return(
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
                        <form id="registrationForm">
                            <div className="form-control">
                            <h2>Welcome To DreamSpaces!</h2>
                            <p>"Explore and enjoy."</p>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter Name"
                                required
                            />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter Email"
                                required
                            />
                            <span id="email-error"></span>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="Enter Mobile Number"
                                required
                            />
                            <span id="phone-error"></span>
            
                            <div>
                                <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password"
                                required
                                />
                                <div className="icon form-icon">
                                <img src={Eye} alt="" />
                                </div>
                            </div>
                            <div>
                                <input
                                type="password"
                                id="confirmpassword"
                                name="confirmpassword"
                                placeholder="Confirm Password"
                                required
                                />
                                <div className="icon form-icon">
                                    <img src={Eye} alt="" />
                                </div>
                            </div>
                                <input type="Submit" value="Register" />
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