import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/prop_det_list.css'; // Custom CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faImage, faMapMarkerAlt, faBed, faBath, faMaximize } from '@fortawesome/free-solid-svg-icons';


const PropertyListings = () => {
    const [city, setCity] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [adType, setAdType] = useState('');
    const [properties, setProperties] = useState([]);
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [adOptions, setAdOptions] = useState([{ value: "", label: "Select Property Ad Type" }]);
    
    // Using useEffect to set initial state from URL parameters
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setPropertyType(urlParams.get('propertyType') || '');
        setAdType(urlParams.get('adType') || '');
        setCity(urlParams.get('city') || '');
    }, []); // Empty dependency array ensures this runs once on mount
  
    const handlePropertyTypeChange = (e) => {
        setPropertyType(e.target.value);
        setAdType(''); // Reset ad type on property type change

        let newAdOptions = [];
        switch (e.target.value) {
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
        console.log(adOptions);
    };
  
    const handleAdTypeChange = (e) => {
      setAdType(e.target.value);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');
      setLoading(true);
      setError('');

      console.log('City:', city);
      console.log('Property Type:', propertyType);
      console.log('Ad Type:', adType);


  
      try {
        // Send request to backend with the search parameters
        const response = await axios.post('http://localhost:5000/api/property_listings', {
          city: city,
          property_type: propertyType,
          ad_type: adType,
        },
        {
            headers: {
              Authorization: `Bearer ${token}`,
            }
        });
  
        // Assuming the response contains properties and owners in the expected format
        setProperties(response.data.properties);
        setOwners(response.data.owners);
      } catch (err) {
        setError('Error fetching data, please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <>  
        {/* Search Filter Section */}
        <div className="search-container">
          <section className="filters">
            <form onSubmit={handleSubmit}>
              <div id="close-filter">
                <FontAwesomeIcon icon={faTimes}/>
              </div>
              <h3>Filter your search</h3>
              <div className="flex">
                <div className="box">
                  <p>Select City</p>
                  <select value={city} onChange={(e) => setCity(e.target.value)} className="input" required>
                    <option value="">City</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Banglore">Banglore</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Kolkata">Kolkata</option>
                  </select>
                </div>
                <div className="box">
                  <p>Property Type</p>
                  <select value={propertyType} onChange={handlePropertyTypeChange} className="input" required>
                    <option value="">Property Type</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land/Plot</option>
                  </select>
                </div>
                <div className="box">
                  <p>Property Ad Type</p>
                  <select value={adType} onChange={handleAdTypeChange} className="input" required>
                    {adOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                  </select>
                </div>
              </div>
              <input type="submit" value="Search Property" className="btn" />
            </form>
          </section>
  
          {/* Listings Section */}
          <section className="listings">
            <h1 className="heading">Searched Results</h1>
  
            {/* Show loading spinner or message while fetching data */}
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <div className="box-container">
                {properties && properties.length > 0 ? (
                  properties.map((property, i) => (
                    <div className="box" key={i}>
                      <div className="admin">
                        <h3>{owners[i].name.charAt(0)}</h3>
                        <div>
                          <p>{owners[i].name}</p>
                          <span>{property.available_from}</span>
                        </div>
                      </div>
                      <div className="thumb">
                        <p className="total-images">
                        <FontAwesomeIcon icon={faImage}/><span>{property.image.length}</span>
                        </p>
                        <p className="type"><span>flat</span><span>sale</span></p>
                        <form className="save">
                          <button type="submit" className="far fa-heart"></button>
                        </form>
                        <img src={`${property.image[0]}`} alt={property.image[0]} />
                      </div>
                      <h3 className="name">Modern Flats and Apartments</h3>
                      <p className="location">
                      <FontAwesomeIcon icon={faMapMarkerAlt}/>
                        <span>{property.landmark_street}, {property.locality}, {property.city}</span>
                      </p>
                      <div className="flex">
                        <p><FontAwesomeIcon icon={faBed}/><span>{property.bhk_type}</span></p>
                        <p><FontAwesomeIcon icon={faBath}/><span>{property.bathrooms}</span></p>
                        <p><FontAwesomeIcon icon={faMaximize}/><span>{property.built_up_area} sqft</span></p>
                      </div>
                      <form action="/property_details" method="post">
                        <textarea name="object_id" style={{ display: 'none' }} defaultValue={property._id}></textarea>
                        <button className="btn" type="submit">View Property</button>
                      </form>
                    </div>
                  ))
                ) : (
                  <p>Sorry, we don't have any properties matching your specifications.</p>
                )}
              </div>
            )}
          </section>
        </div>
      </>
    );
  };
  
  export default PropertyListings;
