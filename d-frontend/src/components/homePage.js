import React, { useState } from 'react';
import '../css/homePage.css'; // Ensure the path is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Logo from '../images/Logo.jpg';

function HomePage() {
    // State to manage selected ad type options
    const [adOptions, setAdOptions] = useState([{ value: "", label: "Select Property Ad Type" }]);

    // Handle the change of the property type select box
    const handlePropertyTypeChange = (event) => {
        const selectedValue = event.target.value;

        let newAdOptions = [];
        switch (selectedValue) {
            case "residential":
                newAdOptions = [
                    { value: "rent", label: "Rent" },
                    { value: "buy", label: "Buy" },
                    { value: "flatmates", label: "Flatmates" }
                ];
                break;
            case "commercial":
                newAdOptions = [
                    { value: "rent", label: "Rent" },
                    { value: "buy", label: "Buy" }
                ];
                break;
            case "land":
                newAdOptions = [
                    { value: "buy", label: "Buy" },
                    { value: "development", label: "Development" }
                ];
                break;
            default:
                newAdOptions = [{ value: "", label: "Select Property Ad Type" }];
                break;
        }
        setAdOptions(newAdOptions);
    };

    return (
        <div>
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
                                <a href="/postYourProperty"
                                >Post Property<FontAwesomeIcon icon={faPaperPlane} /></a>
                            </li>
                            
                            <li>
                                <a href="/userProfile">
                                    Dashboard
                                </a>
                            </li>
                            {/* Add more list items as needed */}
                        </ul>
                    </section>
                </nav>
            </header>
            {/* Header End */}

            <div className="home">
                <form>
                    <section className="center">
                        <div className="welcome-hero-form">
                            <div className="hero-form">
                                <select id="property_type" name="property_type" required onChange={handlePropertyTypeChange}>
                                    <option value="">Property Type</option>
                                    <option value="residential">Residential</option>
                                    <option value="commercial">Commercial</option>
                                    <option value="land">Land/Plot</option>
                                </select>
                            </div>
                            <div className="hero-form">
                                <select id="ad_type" name="ad_type" required>
                                    {adOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="hero-form">
                                <select id="city" name="city" required>
                                    <option value="">City</option>
                                    <option value="Chennai">Chennai</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Banglore">Bangalore</option>
                                    <option value="Hyderabad">Hyderabad</option>
                                    <option value="Kolkata">Kolkata</option>
                                </select>
                            </div>
                        </div>
                        <div className="hero-search">
                            <button className="hero-btn" type="submit">
                                <FontAwesomeIcon /> Search
                            </button>
                        </div>
                    </section>
                </form>
            </div>

            {/* Footer */}
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
                                <a href="#"><FontAwesomeIcon /></a>
                                <a href="#"><FontAwesomeIcon /></a>
                                <a href="#"><FontAwesomeIcon /></a>
                                <a href="#"><FontAwesomeIcon /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;
