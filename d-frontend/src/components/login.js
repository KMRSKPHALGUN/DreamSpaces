import React, {useRef, useEffect} from "react";
import '../css/login_signup.css';
import Loginn from '../images/loginn.jpeg';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

function Login() {
  const localhost = useSelector((state) => state.lh.localhost) || localStorage.getItem('localhost');
  
  let navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    console.log("Updated localhost:", localhost);
  }, [localhost]);

  const login = async (event) => {
    event.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    try {
      console.log(localhost);
      const response = await axios.post(`https://${localhost}:5000/api/login`, { // Update with your actual backend endpoint
          email,
          password,
      });

      const message = response.data.message;

      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('client', JSON.stringify(response.data.client));

      alert(message);
      // Handle successful registration (e.g., redirect to login page or show a success message)
      window.location.href = '/home'; // Example of redirection
    }
    catch (error) {
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
      <button className="back-button" onClick={() => navigate(-1)}><FontAwesomeIcon icon={faArrowLeft}/></button>
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
            <form id="loginForm" onSubmit={login}>
              <div className="form-control">
                <h2>DreamSpaces</h2>
                <p>"A Place where Memories are made"</p>
                <input
                  type="email"
                  id="l_email"
                  name="l_email"
                  placeholder="Enter Email ID"
                  ref={emailRef}
                  required
                />
                <span id="email-error"></span>
                <div>
                  <input
                    type="password"
                    id="l_password"
                    name="l_password"
                    placeholder="Password"
                    ref={passwordRef}
                    required
                  />
                  <div className="icon form-icon"></div>
                </div>
                <span>Recovery Password</span>
                <input type="Submit" value="Login" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
