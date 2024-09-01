import React from "react";
import '../css/login_signup.css';
import Loginn from '../images/loginn.jpeg';

function Login() {
    return(
        <section className="section">
            <div className="container">
                <div className="user login">
                    <div className="img-box">
                        <img src={Loginn} alt="" />
                    </div>
                    <div className="form-box">
                        <div className="top">
                            <p>
                            Not a member?
                            <span data-id="#ff0066"><a href="/signup">Register now</a></span>
                            </p>
                        </div>
                        <form id="loginForm">
                            <div className="form-control">
                            <h2>DreamSpaces</h2>
                            <p>"A Place where Memories are made"</p>
                            <input
                                type="email"
                                id="l_email"
                                name="l_email"
                                placeholder="Enter Email ID"
                                required
                            />
                            <span id="email-error"></span>
                            <div>
                                <input
                                type="password"
                                id="l_password"
                                name="l_password"
                                placeholder="Password"
                                required
                                />
                                <div class="icon form-icon"></div>
                            </div>
                            <span>Recovery Password</span>
                            <input type="Submit" value="Login" />
                            </div>
                        </form>
            
                        {/* <a href="/auth/google">
                            <button>Sign Up with Google</button>
                        </a> */}
                    
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;