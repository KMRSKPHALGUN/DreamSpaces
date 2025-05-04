import React, { useState, useEffect } from 'react';
import '../css/commercial.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faDollarSign, faMapMarkerAlt, faCamera, faUtensils, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CommercialSale = () => {
  const localhost = localStorage.getItem('localhost');
  let navigate = useNavigate();
  const [buildingType, setBuildingType] = useState([{ value: "", label: "Select Building Type" }]);
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
              <div className="Sale Details" id="rentDetailsLink" style={{ marginBottom: '50px' }}>
                <li onClick={showRentalDetails} ><FontAwesomeIcon icon={faDollarSign} /><a href="#" id="rentDetailsAnchor" style={{ fontSize: '20px' }}>Sale Details</a></li>
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

const handlePropertyTypeChange = (event) => {
    
  const selectedValue = event.target.value;
  setFormState({
    ...formState,
    property_type: selectedValue,
  });
  let newAdOptions = [];
  switch (selectedValue) {
    case 'office':
    case 'co-working':
    case 'shop':
    case 'showroom':
    case 'other':
      newAdOptions = [
        { value: "", label: "Select Building Type" },
        { value: "house", label: "Independent House" },
        { value: "park", label: "Business Park" },
        { value: "mall", label: "Mall" },
        { value: "standalone", label: "Standalone Building" },
        { value: "shop", label: "Independent Shop" }
      ];
      break;
    case 'godown':
    case 'shed':
    case 'indus-building':
      newAdOptions = [
        { value: "", label: "Select Building Type" },
        { value: "standalone", label: "Standalone Building" }
      ];
      break;
    case 'cafe':
      newAdOptions = [
        { value: "", label: "Select Building Type" },
        { value: "park", label: "Business Park" },
        { value: "mall", label: "Mall" },
        { value: "standalone", label: "Standalone Building" },
        { value: "shop", label: "Independent Shop" }
      ];
      break;
    default:
      newAdOptions = [{ value: "", label: "Select Building Type" }];
      break;
  }
  setBuildingType(newAdOptions);
};

  const [formState, setFormState] = useState({
    property_type: '',
    building_type: '',
    age: '',
    floors: '',
    totalfloor: '',
    builtuparea: '',
    carpetarea: '',
    furnish: '',
    Expected_rent: '',
    Rent_Negotiable: false,
    available_from: '',
    Propertytax: '',
    Occupancy: '',
    city: '',
    locality: '',
    landmark_street: '',
    locality_description: '',
    waterSupply: '',
    powerBackup: '',
    lift: '',
    washroom: '',
    security: '',
    parking: '',
    availability: '',
    startTime: '',
    endTime: '',
    directions: ''
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
    var propertyType = formState.property_type;
    var buildingType = formState.building_type;
    var age = formState.age;
    var floors = formState.floors;
    var totalFloor = formState.totalfloor;
    var builtupArea = formState.builtuparea;
    var carpetArea = formState.carpetarea;
    var furnish = formState.furnish;
    
    if (propertyType && buildingType && age && floors && totalFloor && builtupArea && carpetArea && furnish && (builtupArea >= carpetArea) && (floors <= totalFloor)) {
        showRentalDetails();
    } 
    else if(builtupArea < carpetArea) {
        alert('Super Builtup Area should be greater than Carpet Area');
    }
    else if (floors > totalFloor) {
        alert('Total Floor should be greater than Floor');
    }
    else {
        alert('Please fill in all required fields in Property Details before continuing.');
    }
  }

  function saveAndContinueRentalDetails() {
      var expectedRent = formState.Expected_rent;
      var Propertytax = formState.Propertytax;
      var Occupancy = formState.Occupancy;

      if (expectedRent && Propertytax && Occupancy) {
          // All required fields are filled, proceed to the next step or perform any necessary action
          showLocalityDetails()
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
    formData.append('property_type', formState.property_type);
    formData.append('building_type', formState.building_type);
    formData.append('floors', formState.floors);
    formData.append('totalfloor', formState.totalfloor);
    formData.append('age', formState.age);
    formData.append('builtuparea', formState.builtuparea);
    formData.append('carpetarea', formState.carpetarea);
    formData.append('furnish', formState.furnish);
    formData.append('Expected_rent', formState.Expected_rent);
    formData.append('Rent_Negotiable', formState.Rent_Negotiable);
    formData.append('Expected_deposit', formState.Expected_deposit);
    formData.append('lease', formState.lease);
    formData.append('available_from', formState.available_from);
    formData.append('Propertytax', formState.Propertytax);
    formData.append('Occupancy', formState.Occupancy);
    
    // Append locality details
    formData.append('city', formState.city);
    formData.append('locality', formState.locality);
    formData.append('landmark_street', formState.landmark_street);
    formData.append('locality_description', formState.locality_description);
    
    // Append amenities details
    formData.append('wash', formState.washroom);
    formData.append('lift', formState.lift);
    formData.append('powerbackup', formState.powerBackup);
    formData.append('water_supply', formState.waterSupply);
    formData.append('parking', formState.parking);
    formData.append('security', formState.security);
    formData.append('Availability', formState.availability);
    formData.append('start_time', formState.startTime);
    formData.append('end_time', formState.endTime);
    formData.append('Directions', formState.directions);
    
    // Append selected images
    selectedImages.forEach((image) => {
      formData.append('image', image); // Use the appropriate field name in multer
    });


    try
    {
      const response = await axios.post(`https://dreamspaces.onrender.com/api/commercial_sale`, formData,
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
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}><FontAwesomeIcon icon={faArrowLeft}/></button>
        <Sidebar/>

        <form className="forms" encType='multipart/form-data'>  
          {propertyDetailsVisible && (
            <div id="PropertyDetailsform" className="form">
              <h1 style={{ marginBottom: '30px', fontSize: '30px' }}>
              <FontAwesomeIcon icon={faHouse} /> Property Details
              </h1>
              <div className="input-group1" style={{ marginBottom: '60px' }}>
                <label htmlFor="property-type" style={{ fontSize: '20px', marginLeft: '10px' }}>Property Type</label>
                <select
                  id="property-type"
                  name="property_type"
                  value={formState.property_type}
                  onChange={handlePropertyTypeChange}
                  style={{ height: '35px', width: '150px', marginRight: '55px' }}>
                  <option value="">Property Type</option>
                  <option value="office">Office Space</option>
                  <option value="co-working">Co-working</option>
                  <option value="showroom">Showroom</option>
                  <option value="godown">Godown/Warehouse</option>
                  <option value="shed">Industrial Shed</option>
                  <option value="indus-building">Industrial Building</option>
                  <option value="cafe">Restaurant/Cafe</option>
                  <option value="other">Other Business</option>
                  
                </select>
                <label htmlFor="building-type" style={{ fontSize: '20px', marginLeft: '10px' }}>Building Type</label>
                <select id="building-type" name="building_type" value={formState.building_type} style={{ height: '35px', width: '150px', marginRight: '55px' }} onChange={handleInputChange}>
                  {buildingType.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* Add other input fields similarly */}
              </div>

              <div className="input-group2" style={{ marginBottom: '60px', marginLeft: '10px' }}>
                <label htmlFor="age" style={{ fontSize:'20px' }}>Age of Property:</label>
                <input type="number" id="age" name="age" value={formState.age} min="1" placeholder="Age of Property" style={{ height: '25px' }} onChange={handleInputChange} required />
                
                <label htmlFor="floors" style={{ fontSize:'20px' }}>Floor:</label>
                <input type="number" id="floors" name="floors" value={formState.floors} min="0" placeholder="Floor" style={{ height: '25px' }} onChange={handleInputChange} required />
                
                <label htmlFor="totalfloor" style={{ fontSize:'20px' }}>Total Floor:</label>
                <input type="number" id="totalfloor" name="totalfloor" value={formState.totalfloor} min="0" placeholder="Total Floor" style={{ height: '25px' }} onChange={handleInputChange} required />
              </div>

              <div className="input-group3" style={{ marginBottom: '60px', marginLeft: '10px' }}>
                <label htnmlFor="builtuparea" style={{ fontSize:'20px' }}>Super Builtup Area (sq feet):</label>
                <input type="number" id="builtuparea" name="builtuparea" value={formState.builtuparea} min="0" placeholder="Builtup Area" style={{ height: '25px' }} onChange={handleInputChange} required />

                <label htmlFor="carpetarea" style={{ fontSize:'20px' }}>Carpet Area (sq feet):</label>
                <input type="number" id="carpetarea" name="carpetarea" value={formState.carpetarea} min="0" placeholder="Carpet Area" style={{ height: '25px' }} onChange={handleInputChange} required />
              </div>

              <div className="input-group4">
                  <label htmlFor="furnish" style={{ fontSize: '20px', marginLeft: '10px' }}>Furnishing</label>
                  <select id="furnish" name="furnish" value={formState.furnish} style={{ height: '35px', width: '150px', marginRight: '55px' }} onChange={handleInputChange}>
                      <option value="">Select</option>
                      <option value="full">Fully Furnished</option>
                      <option value="semi">Semi Furnished</option>
                      <option value="un">Unfurnished</option>
                  </select>
              </div>
              <br /><br />

              {/* Other form groups */}
              <button id="save-property-details-btn" type='button' onClick={saveAndContinuePropertyDetails}>Save Property Details</button>
            </div>
          )}

          {rentalDetailsVisible && (
            <div id="RentalDetailsform" className="form">
              <h1 style={{ marginBottom: '30px', fontSize: '30px' }}>
                <FontAwesomeIcon icon={faDollarSign} /> Sale Details
              </h1>
        
              <div className="input-group5" style={{ marginBottom: '30px' }}>
                <label htmlFor="Expected-rent" style={{ fontSize: '20px' }}>Expected-price:</label>
                <input
                  type="number"
                  id="Expected-rent"
                  name="Expected_rent"
                  min="0"
                  placeholder="Enter Amount"
                  size="10"
                  style={{ width: '170px', marginRight: '55px', height: '35px' }}
                  value={formState.Expected_rent}
                  onChange={handleInputChange}
                  required
                />
              </div>
        
              <div className="input-group6" style={{ marginBottom: '30px' }}>
                <input
                  type="checkbox"
                  id="Rent-Negotiable"
                  name="Rent_Negotiable"
                  checked={formState.Rent_Negotiable}
                  onChange={handleInputChange}
                />
                <label htmlFor="Rent Negotiable" style={{ fontSize: '20px' }}>Price Negotiable</label>
              </div>

              <div className="input-group8" style={{ marginBottom: '30px' }}>
                <label htmlFor="available_from" style={{ fontSize: '20px' }}>Available From:</label>
                <input
                  type="date"
                  id="available_from"
                  name="available_from"
                  style={{ height: '35px', marginRight: '65px' }}
                  value={formState.available_from}
                  onChange={handleInputChange}
                  required
                />
              </div>
        
              <div className="input-groupx">
                <label htmlFor="Propertytax" style={{ fontSize: '20px' }}>Have you paid Property Tax?</label>
                <select
                  id="Propertytax"
                  name="Propertytax"
                  style={{ height: '35px', marginRight: '55px' }}
                  value={formState.Propertytax}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Dont Know">Don't Know</option>
                </select>
        
                <br /><br /><br /><br />
                <label htmlFor="Occupancy" style={{ fontSize: '20px', marginLeft: '10px' }}>Do you have an Occupancy Certificate?</label>
                <select
                  id="Occupancy"
                  name="Occupancy"
                  style={{ height: '35px', marginRight: '55px' }}
                  value={formState.Occupancy}
                  onChange={handleInputChange}
                >
                  
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Dont Know">Don't Know</option>
                </select>
              </div>
        
              <br /><br />
              <button id="save-rental-details-btn" type="button" onClick={saveAndContinueRentalDetails}>
                Save Sale Details
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
                  style={{ height: '35px', marginRight: '55px', width: '160px' }}
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
                  style={{ width: '160px', height: '35px' }}
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
                  style={{ width: '200px', height: '35px' }}
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
                <h2 style={{ fontSize: '30px' }}>
                  <i className="fas fa-camera"></i> Gallery
                </h2>
        
                <div className="file-input">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    multiple
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
            <div id="Amenities" style={{ marginLeft: '10px' }}>
              <h2 style={{ fontSize: '30px' }}>
                <i className="fas fa-utensils"></i> Amenities
              </h2>
              <div className="input-group11" style={{ marginTop: '40px' }}>
                <label htmlFor="water-storage" style={{ fontSize: '20px' }}>
                  <i className="fas fa-tint"></i> Water Storage Facility:
                </label>
                <select
                  id="water-storage"
                  name="waterSupply"
                  style={{ height: '35px', width: '100px', marginRight: '55px' }}
                  value={formState.waterSupply}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
        
                <label htmlFor="powerbackup" style={{ fontSize: '20px' }}>
                  <i className="fas fa-power-off"></i> Power Backup:
                </label>
                <select
                  id="powerbackup"
                  name="powerBackup"
                  style={{ height: '35px', width: '150px', marginRight: '55px' }}
                  value={formState.powerBackup}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="full">Full</option>
                  <option value="partial">Partial</option>
                  <option value="need">Need to Arrange</option>
                </select>
              </div>
        
              <div className="input-group12" style={{ marginTop: '50px', marginBottom: '50px' }}>
                <label htmlFor="lift" style={{ fontSize: '20px' }}>
                  <i className="fas fa-arrow-up"></i> Lift
                </label>
                <select
                  id="lift"
                  name="lift"
                  style={{ height: '35px', marginRight: '55px' }}
                  value={formState.lift}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="none">None</option>
                  <option value="personal">Personal</option>
                  <option value="common">Common</option>
                </select>
        
                <label htmlFor="wash" style={{ fontSize: '20px' }}>
                  <i className="fas fa-restroom"></i> Washrooms
                </label>
                <select
                  id="wash"
                  name="washroom"
                  style={{ height: '35px', marginRight: '55px' }}
                  value={formState.washroom}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="private">Private</option>
                  <option value="shared">Shared</option>
                  <option value="none">No Washroom</option>
                </select>
              </div>
        
              <div className="input-group13">
                <label htmlFor="security" style={{ fontSize: '20px' }}>
                  <i className="fas fa-shield-alt"></i> Gated Security
                </label>
                <select
                  id="security"
                  name="security"
                  style={{ height: '35px', width: '80px', marginRight: '55px' }}
                  value={formState.security}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
        
                <label htmlFor="parking" style={{ fontSize: '20px', marginLeft: '10px' }}>
                  <i className="fas fa-parking"></i> Parking
                </label>
                <select
                  id="parking"
                  name="parking"
                  style={{ height: '35px', width: '80px', marginRight: '55px' }}
                  value={formState.parking}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
        
              <div className="input-group14" style={{ marginBottom: '30px' }}>
                <label htmlFor="availability" style={{ fontSize: '20px' }}>
                  Availability to show property:
                </label>
                <select
                  id="Availability"
                  name="availability"
                  style={{ height: '35px', marginRight: '55px' }}
                  value={formState.availability}
                  onChange={handleInputChange}
                >
                  <option value="Availability">Availability</option>
                  <option value="EveryDay">EveryDay</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="WeekEnds">WeekEnds</option>
                </select>
              </div>
        
              <div className="scheduleTime">
                <label htmlFor="scheduleTime" style={{ fontSize: '20px' }}>
                  ScheduleTime:
                </label>
                <br />
                <br />
                <label htmlFor="startTime">Start Time:</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formState.startTime}
                  onChange={handleInputChange}
                />
                <br />
                <br />
                <label htmlFor="endTime">End Time:</label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formState.endTime}
                  onChange={handleInputChange}
                />
              </div>
        
              <br />
              <br />
              <p style={{ fontSize: '20px' }}>Add Directions tip:</p>
              <textarea
                id="amenities_description"
                name="directions"
                rows="4"
                cols="50"
                value={formState.directions}
                onChange={handleInputChange}
              ></textarea>
        
              <br />
              <br />
              <button id="post-btn" onClick={handleSubmit}>
                Post
              </button>
        
              <p id="post-message" style={{ display: 'none' }}>
                Property Posted
              </p>
            </div>
          )}

        </form>
      </div>
  );
};

export default CommercialSale;