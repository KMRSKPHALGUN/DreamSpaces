import React, { useEffect } from 'react';
import axios from 'axios';
import '../css/landingPage.css'; // Make sure to update the path based on your React project structure
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Logo from '../images/Logo.jpg';
import Icon1 from '../images/icon-1.png';
import Icon2 from '../images/icon-2.png';
import Icon3 from '../images/icon-3.png';
import { useNavigate } from 'react-router-dom';

function LandingPage({ onSetLocalhost }) {
    const navigate = useNavigate();
    useEffect(() => {
        const getLocalHost = async() => {
            try
            {
                const response = await axios.get(`https://10.0.51.35:5000/api/getLocalHost`);

                if(response.data.localhost)1
                {
                    console.log(response.data.localhost);
                    onSetLocalhost(response.data.localhost);
                    localStorage.setItem('localhost', response.data.localhost);
                }
            }
            catch(error)
            {
                if(error.response)
                {
                    alert(error.response.data.error);
                }
                else
                {
                    console.log("in frontend");
                    alert("Something went wrong!");
                }
            }
        }

        getLocalHost();
    }, []);

    return (
        <div className="land-body">
            {/* Header Start */}
            <header className="header">
                <nav className="navbar nav">
                    <section className="flex">
                        <a href="/" className="logo">
                            <img 
                                className="logo-img"
                                src={Logo} 
                                alt="Dream Spaces" 
                                style={{height: '85px'}}
                            />
                            <div className="logo-text">
                            DreamSpaces
                            </div>
                            
                        </a>
                        <FontAwesomeIcon icon={faBars} className="mobile-view" />
                        <ul id="top-menu">
                            <li>
                                <button>
                                    To Connect
                                </button>
                                <ul>
                                    <li className="to-connect"><button onClick={() => navigate('/login')}>Login</button></li>
                                    <li className="to-connect"><button onClick={() => navigate('/signup')}>Signup</button></li>
                                    <li className="to-connect"><button onClick={() => navigate('/adminLogin')}>Admin</button></li>
                                </ul>
                            </li>
                            {/* Add more list items as needed */}
                        </ul>
                    </section>
                </nav>
            </header>
            {/* Header End */}

            {/* Add more sections of your page here */}
            <div className="home-land">
                {/* <div className='overlay'>
                    <p>Welcome to DreamSpaces!</p>
                    <h1>- A Place where Memories are made</h1>
                </div> */}
            </div>

            <section className="services">

                <h1 className="land-heading">our services</h1>

                <div className="box-container">

                    <div className="box">
                        <img src={Icon1} alt=""/>
                        <h3>buy house</h3>
                        <p>Unlock your dream home ownership with this captivating property,Celebrate the journey of finding your home with us.</p>
                    </div>

                    <div className="box">
                        <img src={Icon2} alt=""/>
                        <h3>rent house</h3>
                        <p>Discover your ideal home for rent, offering comfort, convenience, and modern living at its finest.</p>
                    </div>

                    <div className="box">
                        <img src={Icon3} alt=""/>
                        <h3>sell house</h3>
                        <p>Experience the perfect blend of comfort and luxury in this stunning home, now available for sale.</p>
                    </div>
                    <div className="box">
                        <img src={Icon3} alt=""/>
                        <h3>sell plot</h3>
                        <p>Embrace the opportunity to build your vision on this prime plot of land, available for sale now.</p>
                    </div>
                    <div className="box">
                        <img src={Icon1} alt=""/>
                        <h3>buy plot</h3>
                        <p>Seize the chance to invest in your future with this exceptional plot of land, waiting for you to make it yours.</p>
                    </div>
                    <div className="box">
                        <img src={Icon2} alt=""/>
                        <h3>develop land</h3>
                        <p>Unlock the potential of this prime land for development, offering limitless possibilities for your next project.</p>
                    </div>
                </div>

            </section>


            <footer className="footer">
                <div className="container_footer">
                <div className="row_footer">
                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">About us</a></li>
                            <li><a href="#">Reviews</a></li>
                            <li><a href="#">Our Services</a></li>
                            <li><a href="#">Terms and Conditions</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Help</h4>
                        <ul>
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Report</a></li>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Customer Service</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Property</h4>
                        <ul>
                            <li><a href="#">Rent</a></li>
                            <li><a href="#">Sell</a></li>
                            <li><a href="#">Buy</a></li>
                            
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Follow us</h4>
                        <div className="social-links">
                            <a href="#"><FontAwesomeIcon  /></a>
                            <a href="#"><FontAwesomeIcon  /></a>
                            <a href="#"><FontAwesomeIcon  /></a>
                            <a href="#"><FontAwesomeIcon  /></a>
                        </div>
                    </div>
                </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
