import React, { useState, useEffect } from 'react';
import '../css/residential.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faDollarSign, faMapMarkerAlt, faCamera, faUtensils, faHome, faBath, faDoorOpen, faTint, faDumbbell, faDrumstickBite, faShieldAlt, faArrowAltCircleUp, faWifi, faLandmark, faChild, faTree, faGasPump, faPaperPlane, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResidentialRent = () => {
  const localhost = localStorage.getItem('localhost');
  let navigate = useNavigate();
  const [propertyDetailsVisible, setPropertyDetailsVisible] = useState(true);
  const [rentalDetailsVisible, setRentalDetailsVisible] = useState(false);
  const [localityDetailsVisible, setLocalityDetailsVisible] = useState(false);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [amenitiesVisible, setAmenitiesVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    showPropertyDetails(); // By default, show Property Details form
  }, []);

  const showPropertyDetails = () => {
    setPropertyDetailsVisible(true);
    setRentalDetailsVisible(false);
    setLocalityDetailsVisible(false);
    setGalleryVisible(false);
    setAmenitiesVisible(false);
  };

  const showRentalDetails = () => {
    setPropertyDetailsVisible(false);
    setRentalDetailsVisible(true);
    setLocalityDetailsVisible(false);
    setGalleryVisible(false);
    setAmenitiesVisible(false);
  };

  const showLocalityDetails = () => {
    setPropertyDetailsVisible(false);
    setRentalDetailsVisible(false);
    setLocalityDetailsVisible(true);
    setGalleryVisible(false);
    setAmenitiesVisible(false);
  };

  const showGalleryDetails = () => {
    setPropertyDetailsVisible(false);
    setRentalDetailsVisible(false);
    setLocalityDetailsVisible(false);
    setGalleryVisible(true);
    setAmenitiesVisible(false);
  };

  const showAmenitiesDetails = () => {
    setPropertyDetailsVisible(false);
    setRentalDetailsVisible(false);
    setLocalityDetailsVisible(false);
    setGalleryVisible(false);
    setAmenitiesVisible(true);
  };

  // This is the sidebar component to toggle between sections
  const Sidebar = () => {
    return (
        <div className="sidebar">
          <nav>
            <ul>
              <div className="Property Details" style={{ marginBottom: '50px' }}>
                <li onClick={showPropertyDetails}> <FontAwesomeIcon icon={faHouse} /><a href="#" style={{ fontSize: '20px' }}>Property Details</a></li>
              </div>
              <div className="Rent Details" id="rentDetailsLink" style={{ marginBottom: '50px' }}>
                <li onClick={showRentalDetails} ><FontAwesomeIcon icon={faDollarSign} /><a href="#" id="rentDetailsAnchor" style={{ fontSize: '20px' }}>Rent Details</a></li>
              </div>
              <div className="Locality" style={{ marginBottom: '50px' }}>
                <li onClick={showLocalityDetails} ><FontAwesomeIcon icon={faMapMarkerAlt} /><a href="#" style={{ fontSize: '20px' }}>Locality</a></li>
              </div>
              <div className="Gallery" style={{ marginBottom: '50px' }}>
                <li onClick={showGalleryDetails} ><FontAwesomeIcon icon={faCamera} /><a href="#" style={{ fontSize: '20px' }}>Gallery</a></li>
              </div>
              <div className="Amenities">
                <li onClick={showAmenitiesDetails} ><FontAwesomeIcon icon={faUtensils} /><a href="#" style={{ fontSize: '20px' }}>Amenities</a></li>
              </div>
            </ul>
          </nav>
        </div>
    );
  };


  const [formState, setFormState] = useState({
    buildingType: '',
    bhkType: '',
    floorNumber: '',
    totalFloors: '',
    propertyAge: '',
    facing: '',
    builtUpArea: '',
    expectedRent: '',
    expectedDeposit: '',
    rentNegotiable: false,
    monthlyMaintenance: '',
    availableFrom: '',
    preferredTenants: [],
    furnishing: '',
    parking: '',
    rentalDescription: '',
    city: '',
    locality: '',
    landmark_street: '',
    locality_description: '',
    bathrooms: 0,
    balcony: '0',
    waterSupply: 'corporation',
    gym: '',
    nonVeg: '',
    gatedSecurity: '',
    availabilityToShowProperty: '',
    startTime: '',
    endTime: '',
    amenities: []
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 10); // Limit to 10 images
    setSelectedImages(files);
  };

  const handleUpload = () => {
    if (selectedImages.length > 0) {
      setUploadStatus(`${selectedImages.length} images uploaded successfully.`);
    } else {
      setUploadStatus('Please select images to upload.');
    }
  };

  function saveAndContinuePropertyDetails() {
    var bhkType = formState.bhkType;
    var buildingType = formState.buildingType;
    var age = formState.propertyAge;
    var floors = parseInt(formState.floorNumber);
    var totalFloor = parseInt(formState.totalFloors);
    var builtupArea = parseInt(formState.builtUpArea);
    
    if (bhkType && buildingType && age && floors && totalFloor && builtupArea&& (floors <= totalFloor)) {
        showRentalDetails();
    } 
    else if (floors > totalFloor) {
        alert('Total Floor should be greater than Floor');
    }
    else {
        alert('Please fill in all required fields in Property Details before continuing.');
    }
  }

  function saveAndContinueRentalDetails() {
      var expectedRent = parseInt(formState.expectedRent);
      var expectedDeposit = parseInt(formState.expectedDeposit);

      if (expectedRent && expectedDeposit) {
          // All required fields are filled, proceed to the next step or perform any necessary action
          if(expectedRent <= expectedDeposit)
          {
            showLocalityDetails()
          }
          else
          {
            alert('Expected Deposit should be more than Expected Rent');
          }
          
      }
      else {
          // Alert the user to fill in all required fields before continuing
          alert('Please fill in all required fields in Rental Details before continuing.');
      }
  }

  function saveAndContinueLocalityDetails() {
      var city = formState.city;
      var locality = formState.locality;
      var landmarkStreet = formState.landmark_street;
      var description = formState.locality_description;

      if (city && locality && landmarkStreet && description) {
          showGalleryDetails();
      } else {
          alert('Please fill in all required fields in Locality Details before continuing.');
      }
    }

  function saveAndContinueGalleryDetails() {
      // Check if at least one image is uploaded
      var imageCount = selectedImages.length;
      if (imageCount > 0) {
          // At least one image is uploaded, proceed to the amenities form
          showAmenitiesDetails();
      } else {
          // No image is uploaded, alert the user to upload at least one image
          alert('Please upload at least one image before continuing.');
      }
    }

    const handlePreferredTenantsChange = (e) => {
        const { value, checked } = e.target;
        let tenants = [...formState.preferredTenants];
        if (checked) {
          tenants.push(value);
        } else {
          tenants = tenants.filter((tenant) => tenant !== value);
        }
        setFormState({ ...formState, preferredTenants: tenants });
    };

    const handleCheckboxChange = (e) => {
        const { name, value, checked } = e.target;
        if (checked) {
          setFormState((prevData) => ({
            ...prevData,
            [name]: [...prevData[name], value]
          }));
        } else {
          setFormState((prevData) => ({
            ...prevData,
            [name]: prevData[name].filter((item) => item !== value)
          }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormState({
        ...formState,
        [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');

        const formData = new FormData();
    
        // Append all the form fields
        formData.append('building_type', formState.buildingType);
        formData.append('bhk_type', formState.bhkType);
        formData.append('floor_number', formState.floorNumber);
        formData.append('total_floors', formState.totalFloors);
        formData.append('property_age', formState.propertyAge);
        formData.append('facing', formState.facing);
        formData.append('built_up_area', formState.builtUpArea);
        formData.append('expected_rent', formState.expectedRent);
        formData.append('rent_negotiable', formState.rentNegotiable);
        formData.append('expected_deposit', formState.expectedDeposit);
        formData.append('monthly_maintenance', formState.monthlyMaintenance);
        formData.append('available_from', formState.availableFrom);
        formState.preferredTenants.forEach((tenant) => {
            formData.append('preferred_tenants[]', tenant);
        });
        formData.append('furnishing', formState.furnishing);
        formData.append('parking', formState.parking);
        formData.append('rental_description', formState.rentalDescription);
        
        // Append locality details
        formData.append('city', formState.city);
        formData.append('locality', formState.locality);
        formData.append('landmark_street', formState.landmark_street);
        formData.append('locality_description', formState.locality_description);
        
        // Append amenities details
        formData.append('bathrooms', formState.bathrooms);
        formData.append('balcony', formState.balcony);
        formData.append('water_supply', formState.waterSupply);
        formData.append('gym', formState.gym);
        formData.append('non_veg', formState.nonVeg)
        formData.append('gated_security', formState.gatedSecurity);
        formData.append('availability_to_show_property', formState.availabilityToShowProperty);
        formData.append('start_time', formState.startTime);
        formData.append('end_time', formState.endTime);
        formState.amenities.forEach((amenity) => {
            formData.append('amenities[]', amenity);
        })
        
        // Append selected images
        selectedImages.forEach((image) => {
        formData.append('image', image); // Use the appropriate field name in multer
        });


        try
        {
        const response = await axios.post(`https://dreamspaces.onrender.com/api/residential_rent`, formData,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        }
        });

        alert(response.data.message);

        navigate('/home');
        }
        catch(error)
        {
        if(error.response)
        {
            console.log("Inside catch if");  
            alert(error.response.data.error);
        }
        else
        {
            console.log("Inside catch else");
            alert("Something went wrong!");
        }
        }
    };

  return (
      <div className="commercial-body">
        <button className="back-button" onClick={() => navigate(-1)}><FontAwesomeIcon icon={faArrowLeft}/></button>
        <Sidebar/>

        <form className="forms" encType='multipart/form-data'>
          {propertyDetailsVisible && (
            <div id="PropertyDetailsform" className="form">
                <h1 style={{ marginBottom: '30px', fontSize: '30px' }}>
                <FontAwesomeIcon icon={faHome} /> Property Details
                </h1>
                
                <div className="input-group1" style={{ marginBottom: '50px', marginLeft: '10px' }}>
                <label htmlFor="building-type" style={{ fontSize: '20px' }}>Apartment Type:</label>
                <select
                    id="building-type"
                    name="buildingType"
                    value={formState.apartmentType}
                    onChange={handleInputChange}
                    style={{
                    height: '30px',
                    fontSize: '16px',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    backgroundColor: '#fff',
                    color: '#333',
                    marginRight: '40px'
                    }}
                    required
                >
                    <option value="" disabled>Select Apartment Type</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Independent">Independent House / Villa</option>
                    <option value="Gated">Gated community villa</option>
                    <option value="Penthouse">Penthouse</option>
                </select>
                </div>
        
                <div className="input-group2" style={{ marginBottom: '50px', marginLeft: '10px' }}>
                <label htmlFor="bhk-type" style={{ fontSize: '20px' }}>BHK Type:</label>
                <select
                    id="bhk-type"
                    name="bhkType"
                    value={formState.bhkType}
                    onChange={handleInputChange}
                    style={{
                    height: '25px',
                    marginRight: '50px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    backgroundColor: '#fff',
                    color: '#333',
                    }}
                    required
                >
                    <option value="" disabled>Select BHK Type</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5 BHK</option>
                </select>
        
                <label htmlFor="floor" style={{ fontSize: '20px' }}>Floor Number:</label>
                <input
                    type="number"
                    id="floor"
                    name="floorNumber"
                    min="0"
                    value={formState.floorNumber}
                    onChange={handleInputChange}
                    placeholder="Enter Floor Number"
                    style={{
                    marginRight: '50px',
                    height: '25px',
                    fontSize: '16px',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                    }}
                    required
                />
                </div>
        
                <div className="total-floors" style={{ marginLeft: '10px', marginBottom: '20px' }}>
                <label htmlFor="total-floors" style={{ fontSize: '20px' }}>Total Number of Floors:</label>
                <input
                    type="number"
                    id="total-floors"
                    name="totalFloors"
                    min="0"
                    value={formState.totalFloors}
                    onChange={handleInputChange}
                    placeholder="Enter Total Number of Floors"
                    style={{
                    width: '200px',
                    height: '25px',
                    marginBottom: '35px',
                    fontSize: '16px',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                    }}
                    required
                />
                </div>
        
                <div className="input-group3" style={{ marginBottom: '60px', marginLeft: '10px' }}>
                <label htmlFor="property-age" style={{ fontSize: '20px' }}>Property Age:</label>
                <input
                    type="number"
                    id="property-age"
                    name="propertyAge"
                    min="0"
                    value={formState.propertyAge}
                    onChange={handleInputChange}
                    placeholder="Enter Property Age"
                    style={{
                    width: '140px',
                    marginRight: '55px',
                    height: '25px',
                    fontSize: '16px',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                    }}
                    required
                />
        
                <label htmlFor="facing" style={{ fontSize: '20px' }}>Facing:</label>
                <select
                    id="facing"
                    name="facing"
                    value={formState.facing}
                    onChange={handleInputChange}
                    style={{
                    marginRight: '55px',
                    height: '35px',
                    fontSize: '16px',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                    }}
                    required
                >
                    <option value="" disabled>Select Facing</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North-East">North-East</option>
                    <option value="North-West">North-West</option>
                    <option value="South-East">South-East</option>
                    <option value="South-West">South-West</option>
                </select>
                </div>
        
                <div className="input-group4" style={{ marginBottom: '50px', marginLeft: '10px' }}>
                <label htmlFor="built-up-area" style={{ fontSize: '20px' }}>Built-up Area (sq feet):</label>
                <input
                    type="number"
                    id="built-up-area"
                    name="builtUpArea"
                    min="0"
                    value={formState.builtUpArea}
                    onChange={handleInputChange}
                    placeholder="Enter Built-up Area"
                    style={{
                    height: '25px',
                    fontSize: '16px',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                    }}
                    required
                />
                </div>
        
                <button id="save-property-details-btn" type="button" onClick={saveAndContinuePropertyDetails}> Save Property Details </button>
            </div>
          )}

          {rentalDetailsVisible && (
            <div id="RentalDetailsform" className="form">
                <h1 style={{ marginBottom: '30px', fontSize: '30px' }}>
                <FontAwesomeIcon icon={faDollarSign} /> Rental Details
                </h1>
        
                <div className="input-group5" style={{ marginLeft: '10px', marginBottom: '30px' }}>
                <label htmlFor="Expected-rent" style={{ fontSize: '20px' }}>Expected Rent:</label>
                <input
                    type="number"
                    id="Expected-rent"
                    name="expectedRent"
                    min="0"
                    max="10000000"
                    placeholder="Enter Amount"
                    value={formState.expectedRent}
                    onChange={handleInputChange}
                    style={{
                    width: '170px',
                    marginRight: '55px',
                    height: '35px',
                    fontSize: '16px',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                    }}
                    required
                />
        
                <label htmlFor="Expected-deposit" style={{ fontSize: '20px' }}>Expected Deposit:</label>
                <input
                    type="number"
                    id="Expected-deposit"
                    name="expectedDeposit"
                    min="0"
                    max="10000000"
                    placeholder="Enter Amount"
                    value={formState.expectedDeposit}
                    onChange={handleInputChange}
                    style={{
                    width: '170px',
                    marginRight: '55px',
                    height: '35px',
                    fontSize: '16px',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                    }}
                    required
                />
                </div>
        
                <div className="input-group6" style={{ marginLeft: '10px', marginBottom: '30px' }}>
                    <input
                        type="checkbox"
                        id="Rent-Negotiable"
                        name="rentNegotiable"
                        checked={formState.rentNegotiable}
                        onChange={handleInputChange}
                    />
                    <label htmlFor="Rent-Negotiable" style={{ fontSize: '20px' }}>
                        Rent Negotiable
                    </label>
                </div>
        
                <div className="input-group7" style={{ marginLeft: '10px', marginBottom: '30px' }}>
                <label htmlFor="Monthly-Maintenance" style={{ fontSize: '20px' }}>Monthly Maintenance:</label>
                <select
                    id="Monthly-Maintenance"
                    name="monthlyMaintenance"
                    value={formState.monthlyMaintenance}
                    onChange={handleInputChange}
                    style={{
                    height: '35px',
                    fontSize: '16px',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                    }}
                    required
                >
                    <option value="">Monthly Maintenance</option>
                    <option value="Maintenance Included">Maintenance Included</option>
                    <option value="Maintenance Extra">Maintenance Extra</option>
                </select>
                </div>
        
                <div className="input-group8" style={{ marginLeft: '10px', marginBottom: '30px' }}>
                <label htmlFor="available_from" style={{ fontSize: '20px' }}>Available From:</label>
                <input
                    type="date"
                    id="available_from"
                    name="availableFrom"
                    value={formState.availableFrom}
                    onChange={handleInputChange}
                    style={{
                    height: '35px',
                    fontSize: '16px',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                    }}
                    required
                />
                </div>
        
                <div className="input-group9" style={{ marginLeft: '10px', marginBottom: '30px' }}>
                <label htmlFor="Preferred-Tenants" style={{ fontSize: '20px' }}>Preferred Tenants:</label>
                <label>
                    <input
                    type="checkbox"
                    name="preferred_tenants"
                    value="Anyone"
                    checked={formState.preferredTenants.includes('Anyone')}
                    onChange={handlePreferredTenantsChange}
                    />
                    Anyone
                </label>
                <label>
                    <input
                    type="checkbox"
                    name="preferred_tenants"
                    value="Family"
                    checked={formState.preferredTenants.includes('Family')}
                    onChange={handlePreferredTenantsChange}
                    />
                    Family
                </label>
                <label>
                    <input
                    type="checkbox"
                    name="preferred_tenants"
                    value="Bachelor Female"
                    checked={formState.preferredTenants.includes('Bachelor Female')}
                    onChange={handlePreferredTenantsChange}
                    />
                    Bachelor Female
                </label>
                <label>
                    <input
                    type="checkbox"
                    name="preferred_tenants"
                    value="Bachelor Male"
                    checked={formState.preferredTenants.includes('Bachelor Male')}
                    onChange={handlePreferredTenantsChange}
                    />
                    Bachelor Male
                </label>
                </div>
        
                <div className="input-group10" style={{ marginLeft: '10px', marginBottom: '30px' }}>
                <label htmlFor="Furnishing" style={{ fontSize: '20px' }}>Furnishing:</label>
                <select
                    id="Furnishing"
                    name="furnishing"
                    value={formState.furnishing}
                    onChange={handleInputChange}
                    style={{
                    height: '35px',
                    marginRight: '55px',
                    fontSize: '16px',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                    }}
                    required
                >
                    <option value="">Furnishing</option>
                    <option value="Fully-Furnished">Fully-Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="UnFurnished">UnFurnished</option>
                </select>
        
                <label htmlFor="Parking" style={{ fontSize: '20px' }}>Parking:</label>
                <select
                    id="Parking"
                    name="parking"
                    value={formState.parking}
                    onChange={handleInputChange}
                    style={{
                    height: '35px',
                    fontSize: '16px',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                    }}
                    required
                >
                    <option value="">Parking</option>
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                    <option value="Both">Both</option>
                    <option value="None">None</option>
                </select>
                </div>
        
                <div className="description-box" style={{ marginLeft: '10px', marginBottom: '15px' }}>
                <p style={{ fontSize: '20px' }}>Description-box</p>
                <textarea
                    id="rental_description"
                    name="rentalDescription"
                    rows="4"
                    cols="50"
                    value={formState.rentalDescription}
                    onChange={handleInputChange}
                ></textarea>
                </div>
        
                <button
                id="save-rental-details-btn"
                type="button"
                onClick={saveAndContinueRentalDetails}
                >
                Save Rental Details
                </button>
            </div>
          )}

          {localityDetailsVisible && (
            <div id="LocalityDetailsform">
              <h2 style={{ fontSize: '30px', marginBottom: '30px' }}>
                <i className="fas fa-map-marker-alt"></i> Locality
              </h2>
        
              <div className="input-group11" style={{ marginLeft: '10px', marginBottom: '30px' }}>
                <label htmlFor="City" style={{ fontSize: '20px' }}>City:</label>
                <select
                  id="City"
                  name="city"
                  style={{ height: '35px', marginRight: '55px', width: '160px' ,marginLeft: '30px'}}
                  value={formState.city}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Banglore">Banglore</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Kolkata">Kolkata</option>
                </select>
        
                <label htmlFor="locality" style={{ fontSize: '20px' }}>Locality:</label>
                <input
                  type="text"
                  id="locality"
                  name="locality"
                  placeholder="Enter Locality"
                  style={{ width: '160px', height: '35px',marginLeft: '30px' }}
                  value={formState.locality}
                  onChange={handleInputChange}
                  required
                />
        
                <br /><br /><br /><br />
        
                <label htmlFor="landmark_street" style={{ fontSize: '20px' }}>Landmark / Street:</label>
                <input
                  type="text"
                  id="landmark_street"
                  name="landmark_street"
                  placeholder="Enter Landmark / Street"
                  style={{ width: '200px', height: '35px',marginLeft: '30px' }}
                  value={formState.landmark_street}
                  onChange={handleInputChange}
                  required
                />
        
                <br /><br /><br /><br />
        
                <p style={{ fontSize: '20px' }}>Description-box</p>
        
                <textarea
                  id="locality_description"
                  name="locality_description"
                  placeholder="Write a few lines about your property which is special and makes your property stand out. Please do not mention your contact details in any format."
                  rows="4"
                  cols="50"
                  value={formState.locality_description}
                  onChange={handleInputChange}
                />
              </div>
        
              <button
                id="save-locality-details-btn"
                type="button"
                onClick={saveAndContinueLocalityDetails}
              >
                Save Locality Details
              </button>
            </div>
          )}

          {galleryVisible && (
            <div id="centeredWrapper">
              <div id="Gallery">
                <h2 style={{ fontSize: '30px' , marginBottom: '50px' }}>
                  <i className="fas fa-camera"></i> Gallery
                </h2>
        
                <div className="file-input">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    multiple
                    max={10}
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image">Choose image(s) (Maximum 10)</label>
                </div>
        
                <br /><br /><br />
        
                <button type="button" id="uploadBtn" onClick={handleUpload}>
                  Upload
                </button>
        
                <div id="uploadStatus">
                  {uploadStatus}
                  {selectedImages.length > 0 && (
                    <div style={{display: 'flex', gap: '20px'}}>
                      {selectedImages.map((image, index) => (
                        <div style={{display: 'block'}}>
                          <img
                            key={index}
                            src={URL.createObjectURL(image)}
                            alt={`Selected ${index}`}
                            style={{ width: '100px', margin: '10px' }}
                          />
                          <p key={index}>{image.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
        
                <br /><br />
        
                <button
                  id="save-gallery-btn"
                  type="button"
                  onClick={saveAndContinueGalleryDetails}
                >
                  Save and Continue
                </button>
              </div>
            </div>
          )}

          {amenitiesVisible && (
            <div id="Amenities">
                <div className="input-group11">
                <h2 style={{ fontSize: '30px' }}>
                    <FontAwesomeIcon icon={faUtensils} /> Amenities
                </h2>
                <br />
                <label htmlFor="bathrooms" style={{ fontSize: '20px' }}>
                    <FontAwesomeIcon icon={faBath} /> Number of Bathrooms:
                </label>
                <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    min="0"
                    value={formState.bathrooms}
                    onChange={handleInputChange}
                    style={{
                    height: '35px',
                    marginRight: '20px',
                    width: '50px',
                    fontSize: '16px',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                    }}
                />
                <label htmlFor="balcony" style={{ fontSize: '20px' }}>
                    <FontAwesomeIcon icon={faDoorOpen} /> Balcony:
                </label>
                <select
                    id="balcony"
                    name="balcony"
                    value={formState.balcony}
                    onChange={handleInputChange}
                    style={{
                    height: '35px',
                    marginRight: '20px',
                    fontSize: '16px',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                    }}
                >
                    <option value="0">None</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
        
                <br /><br /><br />
                <label htmlFor="water-supply" style={{ fontSize: '20px' }}>
                    <FontAwesomeIcon icon={faTint} /> Water Supply:
                </label>
                <select
                    id="water-supply"
                    name="waterSupply"
                    value={formState.waterSupply}
                    onChange={handleInputChange}
                    style={{
                    height: '35px',
                    fontSize: '16px',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '5px'
                    }}
                >
                    <option value="corporation">Corporation</option>
                    <option value="borewell">Borewell</option>
                    <option value="both">Both</option>
                </select>
        
                <div className="input-group12" style={{ marginTop: '50px', marginBottom: '50px' }}>
                    <label htmlFor="gym" style={{ fontSize: '20px' }}>
                    <FontAwesomeIcon icon={faDumbbell} />Gym:
                    </label>
                    <label>
                    <input
                        type="radio"
                        name="gym"
                        value="yes"
                        checked={formState.gym === 'yes'}
                        onChange={handleInputChange}
                    /> yes
                    </label>
                    <label>
                    <input
                        type="radio"
                        name="gym"
                        value="no"
                        checked={formState.gym === 'no'}
                        onChange={handleInputChange}
                    /> no
                    </label>
        
                    <label htmlFor="nonVeg" style={{ fontSize: '20px', marginLeft: '35px' }}>
                        <FontAwesomeIcon icon={faDrumstickBite} />Non-veg:
                    </label>
                    <label>
                    <input
                        type="radio"
                        name="nonVeg"
                        value="yes"
                        checked={formState.nonVeg === 'yes'}
                        onChange={handleInputChange}
                    /> yes
                    </label>
                    <label>
                    <input
                        type="radio"
                        name="nonVeg"
                        value="no"
                        checked={formState.nonVeg === 'no'}
                        onChange={handleInputChange}
                    /> no
                    </label>
        
                    <label htmlFor="gatedSecurity" style={{ fontSize: '20px', marginLeft: '35px' }}>
                    <FontAwesomeIcon icon={faShieldAlt} />Gated-security:
                    </label>
                    <label>
                    <input
                        type="radio"
                        name="gatedSecurity"
                        value="yes"
                        checked={formState.gatedSecurity === 'yes'}
                        onChange={handleInputChange}
                    /> yes
                    </label>
                    <label>
                    <input
                        type="radio"
                        name="gatedSecurity"
                        value="no"
                        checked={formState.gatedSecurity === 'no'}
                        onChange={handleInputChange}
                    /> no
                    </label>
                </div>
        
                <div className="input-group13" style={{ marginBottom: '30px' }}>
                    <label htmlFor="availabilityToShowProperty" style={{ fontSize: '20px' }}>
                    Availability to show property:
                    </label>
                    <select
                    id="availabilityToShowProperty"
                    name="availabilityToShowProperty"
                    value={formState.availabilityToShowProperty}
                    onChange={handleInputChange}
                    style={{
                        height: '35px',
                        marginRight: '55px',
                        fontSize: '16px',
                        padding: '5px',
                        border: '1px solid #ccc',
                        borderRadius: '5px'
                    }}
                    >
                    <option value="Availability">Availability</option>
                    <option value="EveryDay">EveryDay</option>
                    <option value="Weekdays">Weekdays</option>
                    <option value="WeekEnds">WeekEnds</option>
                    </select>
                </div>
        
                <div className="scheduleTime">
                    <label htmlFor="startTime" style={{ fontSize: '20px' }}>Schedule Time:</label>
                    <br /><br />
                    <label htmlFor="startTime">Start Time:</label>
                    <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formState.startTime}
                    onChange={handleInputChange}
                    style={{
                        height: '25px',
                        fontSize: '16px',
                        padding: '5px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        marginBottom: '10px'
                    }}
                    />
                    <br /><br />
                    <label htmlFor="endTime">End Time:</label>
                    <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formState.endTime}
                    onChange={handleInputChange}
                    style={{
                        height: '25px',
                        fontSize: '16px',
                        padding: '5px',
                        border: '1px solid #ccc',
                        borderRadius: '5px'
                    }}
                    />
                </div>
        
                <h3>Select the below Available Amenities:</h3>
                <div className="checkbox-group1" style={{ marginBottom: '30px' }}>
                    <label>
                    <input
                        type="checkbox"
                        name="amenities"
                        value="lift"
                        onChange={handleCheckboxChange}
                        style={{ fontSize: '20px' }}
                    /> Lift <FontAwesomeIcon icon={faArrowAltCircleUp} />
                    </label>
                    <label style={{ marginLeft: '50px' }}>
                    <input
                        type="checkbox"
                        name="amenities"
                        value="internet"
                        onChange={handleCheckboxChange}
                        style={{ fontSize: '20px' }}
                    /> Internet <FontAwesomeIcon icon={faWifi} />
                    </label>
                </div>
        
                <div className="checkbox-group3" style={{ marginBottom: '30px' }}>
                    <label>
                    <input
                        type="checkbox"
                        name="amenities"
                        value="club-house"
                        onChange={handleCheckboxChange}
                        style={{ fontSize: '20px' }}
                    /> Club House <FontAwesomeIcon icon={faLandmark} />
                    </label>
                    <label style={{ marginLeft: '50px' }}>
                    <input
                        type="checkbox"
                        name="amenities"
                        value="children-play-area"
                        onChange={handleCheckboxChange}
                        style={{ fontSize: '20px' }}
                    /> Children Play Area <FontAwesomeIcon icon={faChild}/>
                    </label>
                </div>
        
                <div className="checkbox-group2" style={{ marginBottom: '30px' }}>
                    <label>
                    <input
                        type="checkbox"
                        name="amenities"
                        value="park"
                        onChange={handleCheckboxChange}
                        style={{ fontSize: '20px' }}
                    /> Park <FontAwesomeIcon icon={faTree} />
                    </label>
                    <label style={{ marginLeft: '50px' }}>
                    <input
                        type="checkbox"
                        name="amenities"
                        value="gas-pipeline"
                        onChange={handleCheckboxChange}
                        style={{ fontSize: '20px' }}
                    /> Gas Pipeline <FontAwesomeIcon icon={faGasPump} />
                    </label>
                </div>
                <br />
                <button onClick={handleSubmit} className="btn btn-primary">
                    Post Property <FontAwesomeIcon icon={faPaperPlane} />
                </button>
                </div>
            </div>
          )}

        </form>
      </div>
  );
};

export default ResidentialRent;