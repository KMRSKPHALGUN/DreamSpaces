import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/user_details.css'; // Import your CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import EmptyProfile from '../images/empty_profile.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faMapMarkerAlt, faBed, faBath, faMaximize, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';


function UserProfile({}) {
  const localhost = localStorage.getItem('localhost');
  let navigate = useNavigate();
  const [myDetails, setMyDetails] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    motive: '',
    profile_pic: ''
  });
  const [owners, setOwners] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadImage, setUploadImage] = useState(null);
  const [activeTab, setActiveTab] = useState('account'); // state to track the active tab
  const [savedProperties, setSavedProperties] = useState([]); // Track saved properties
  const [postedProperties, setPostedProperties] = useState([]); // Track posted properties
  const [editMode, setEditMode] = useState(false); // Track if we are in edit mode
  const [passwordsState, setPasswordsState] = useState({
    inputPasswordCurrent: '',
    inputPasswordNew: '',
    inputPasswordNew2: ''
  });
  const [deleteAccount, setDeleteAccount] = useState('');
  const token = localStorage.getItem('token');

  const [forgotPassword, setForgotPassword] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const [dltProp, setDltProp] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`https://${localhost}:5000/api/userDetails`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSavedProperties(response.data.s_property);
        setPostedProperties(response.data.property);
        setOwners(response.data.s_owner);
        setMyDetails({
          name: response.data.owner.name,
          email: response.data.owner.email,
          phone: response.data.owner.phone,
          bio: response.data.owner.bio || '',
          motive: response.data.owner.motive || '',
          profile_pic: response.data.owner.profile_pic || EmptyProfile,
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
        alert('Something went wrong!');
      }
    };
    fetchUserDetails();
  }, [token]);

  const statisticsData = [
    { name: 'Posted', value: postedProperties.length },
    { name: 'Saved', value: savedProperties.length }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const updateMyDetails = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    // Append fields to formData
    formData.append('name', myDetails.name);
    formData.append('email', myDetails.email);
    formData.append('phone', myDetails.phone);
    formData.append('bio', myDetails.bio);
    formData.append('motive', myDetails.motive);
    
    // Append selected image file if available
    if (uploadImage) {
      formData.append('image', uploadImage); // Use the appropriate field name in multer
    }

    try {
      const response = await axios.post(`https://${localhost}:5000/api/updateMyDetails`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(response.data.message);
      setEditMode(false); // Exit edit mode after saving
      window.location.reload(); // Reload the page to reflect changes
    } catch (error) {
      console.error('Error updating details:', error);
      alert('Error updating details, please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMyDetails({
      ...myDetails,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const input = e.target;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(input.files[0]);
    }

    setUploadImage(input.files[0]);
  };

  const handlePasswordsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPasswordsState({
      ...passwordsState,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleChangePassword = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://${localhost}:5000/api/changePassword`, passwordsState, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(response.data.message);
      if(response.data.error)
      {
        console.error(response.data.error);
        alert(response.data.error);
      }
    }
    catch(error)
    {
      console.log("Someting went wrong");
      alert("Someting went wrong");
    }
  };

  const logUserOut = () => {
    alert("User Logged Out Successfully");
    localStorage.clear();
    navigate('/');
  }

  const confirmDelete = async(event) => {
    event.preventDefault();
    try{
      const response = await axios.post(`https://${localhost}:5000/api/deleteAccount`, {
        password: deleteAccount
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(response.data.message);
      navigate('/');
    }
    catch(error)
    {
      console.log("Someting went wrong");
      alert("Someting went wrong");
    }
  }

  const openPopup = () => {
    setDltProp(true);
  };

  const closePopup = () => {
    setDltProp(false);
  };

  const handleDltProp = async (propertyId) => {
    setDltProp(false);
    try {
      const response = await axios.post(`https://${localhost}:5000/api/deleteProperty`, {
        propertyId: propertyId
      }, {
        headers: {
          Authorization : `Bearer ${token}`
        }
      });

      // Display the success message from the server
      if (response.status === 200 && response.data.message) {
        alert(`Success: ${response.data.message}`);
        navigate('/home');
      }
      else {
        alert('Property deleted successfully!'); // Fallback message
      }
    } catch (error) {
        // Handle error message from the server
        if (error.response && error.response.data && error.response.data.message) {
            alert(`Error: ${error.response.data.message}`);
        } else {
            alert('Something went wrong');
        }
    }
  }

  const handleViewProperty = async (propertyId) => {
    try{
      const response = await axios.post(`https://${localhost}:5000/api/viewProperty`, {
        propertyId: propertyId
      }, {
        headers: {
          Authorization : `Bearer ${token}`
        }
      });

      localStorage.setItem('property', JSON.stringify(response.data.property));
      localStorage.setItem('owner', JSON.stringify(response.data.owner));
      localStorage.setItem('reviews', JSON.stringify(response.data.reviews));
      localStorage.setItem('users', JSON.stringify(response.data.users));
      localStorage.setItem('client', JSON.stringify(response.data.client));
      
      if(response.data.propertyType === 'residential')
      {
        if(response.data.adType === 'rent')
        {
          navigate('/resRentViewProperty');
        }
        else if(response.data.adType === 'buy')
        {
          navigate('/resBuyViewProperty');
        }
        else if(response.data.adType === 'flatmates')
        {
          navigate('/resFlatViewProperty');
        }
      }
      else if(response.data.propertyType === 'commercial')
      {
        if(response.data.adType === 'rent')
        {
          navigate('/comRentViewProperty');
        }
        else if(response.data.adType === 'buy')
        {
          navigate('/comBuyViewProperty');
        }
      }
      else if(response.data.propertyType === 'plot')
      {
        if(response.data.adType === 'buy')
        {
          navigate('/plotBuyViewProperty');
        }
        else if(response.data.adType === 'development')
        {
          navigate('/plotDevViewProperty');
        }
      }
    }
    catch(error)
    {
      console.log('Something went wrong');
      alert('Something went wrong');
    }
  };

  return (
    <div className="container-user-det pt-0">
      <button className="back-button" onClick={() => navigate(-1)}><FontAwesomeIcon icon={faArrowLeft}/></button>
      {/* <div className="row mt-5"> */}
        {/* <div className="col-md-5 col-xl-4"> */}
          <div className="card-left">
            <div className="card-header">
              <h5 className="card-title-main mb-0">Profile Settings</h5>
            </div>
            <div className="list-group list-group-flush" role="tablist">
              <a
                className={`list-group-item list-group-item-action  user-acct${activeTab === 'account' ? 'active' : ''}`}
                onClick={() => setActiveTab('account')}
              >
                Account
              </a>
              <a
                className={`list-group-item list-group-item-action  user-acct${activeTab === 'statistics' ? 'active' : ''}`}
                onClick={() => setActiveTab('statistics')}
              >
                Statistics
              </a>
              <a
                className={`list-group-item list-group-item-action ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
              >
                Password
              </a>
              <a
                className={`list-group-item list-group-item-action ${activeTab === 'saved_properties' ? 'active' : ''}`}
                onClick={() => setActiveTab('saved_properties')}
              >
                Saved Properties
              </a>
              <a
                className={`list-group-item list-group-item-action ${activeTab === 'posted_properties' ? 'active' : ''}`}
                onClick={() => setActiveTab('posted_properties')}
              >
                Posted Properties
              </a>
              <a
                className={`list-group-item list-group-item-action ${activeTab === 'logout' ? 'active' : ''}`}
                onClick={() => setActiveTab('logout')}
              >
                Log Out
              </a>
              <a
                className={`list-group-item list-group-item-action ${activeTab === 'delete' ? 'active' : ''}`}
                onClick={() => setActiveTab('delete')}
              >
                Delete account
              </a>
            </div>
          {/* </div> */}
        </div>

        <div className="card-right col-md-7 col-xl-8">
          <div className="tab-content">
            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="tab-pane fade show active">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Your Details</h5>
                  </div>
                  <div className="card-body">
                    {!editMode ? (
                      <>
                        {/* Display user details in non-editable format */}
                        <div className="row">
                          <div className="col-md-8">
                            <h5>Name:</h5>
                            <p>{myDetails.name}</p>

                            <h5>Email:</h5>
                            <p>{myDetails.email}</p>

                            <h5>Phone Number:</h5>
                            <p>{myDetails.phone}</p>

                            <h5>Bio:</h5>
                            <p>{myDetails.bio || 'N/A'}</p>

                            <h5>Primary Motive:</h5>
                            <p>{myDetails.motive || 'N/A'}</p>
                          </div>
                          <div className="col-md-4 text-center">
                            <img
                              alt="Profile_Picture"
                              src={myDetails.profile_pic || EmptyProfile}
                              className="rounded-circle img-responsive mt-2"
                              width="128"
                              height="128"
                            />
                          </div>
                        </div>
                        <button
                          className="btn btn-primary mt-4"
                          onClick={() => setEditMode(true)} // Enable edit mode on click
                        >
                          Update Profile
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Editable form */}
                        <form onSubmit={updateMyDetails} encType="multipart/form-data">
                          <div className="row">
                            <div className="col-md-8">
                              <div className="form-group">
                                <label htmlFor="inputname">
                                  <h5>Name:</h5>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="inputname"
                                  name="name"
                                  value={myDetails.name}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="inputemail">
                                  <h5>Email:</h5>
                                </label>
                                <input
                                  type="email"
                                  className="form-control"
                                  id="inputemail"
                                  name="email"
                                  value={myDetails.email}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="inputphone">
                                  <h5>Phone Number:</h5>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="inputphone"
                                  name="phone"
                                  value={myDetails.phone}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="bio">
                                  <h5>Bio:</h5>
                                </label>
                                <textarea
                                  rows="2"
                                  className="form-control"
                                  id="bio"
                                  name="bio"
                                  value={myDetails.bio}
                                  onChange={handleInputChange}
                                ></textarea>
                              </div>
                              <div className="form-group">
                                <label htmlFor="motive">
                                  <h5>Primary Motive:</h5>
                                </label>
                                <select
                                  id="motive"
                                  name="motive"
                                  className="form-control"
                                  value={myDetails.motive}
                                  onChange={handleInputChange}
                                >
                                  <option value="">Choose</option>
                                  <option value="Rent Homes/Commercial Spaces">Rent Homes/Commercial Spaces</option>
                                  <option value="Sell Homes/Commercial Spaces/Plots">Sell Homes/Commercial Spaces/Plots</option>
                                  <option value="Buy Homes/Commercial Spaces/Plots">Buy Homes/Commercial Spaces/Plots</option>
                                  <option value="Develop Plots">Develop Plots</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-md-4 text-center">
                              <img
                                alt="Profile_Picture"
                                src={selectedImage || myDetails.profile_pic || EmptyProfile}
                                id="profile-pic"
                                className="rounded-circle img-responsive mt-2"
                                width="128"
                                height="128"
                              />
                              <label htmlFor="image" className="upload_img">
                                Upload Image
                              </label>
                              <input
                                className="disappear"
                                type="file"
                                accept="image/*"
                                id="image"
                                name="image"
                                onChange={handleImageChange}
                              />
                            </div>
                          </div>
                          <button type="submit" className="btn btn-primary mt-4">
                            Save Changes
                          </button>
                          <button
                            className="btn btn-secondary mt-4 ml-2"
                            onClick={() => setEditMode(false)} // Cancel edit mode
                          >
                            Cancel
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Statistics Tab */}

            {activeTab === 'statistics' && (
              <div className='tab-pane fade show active'>
                <div className='card'>
                  <div className='card-header'>
                    <h2>User Statistics</h2>
                  </div>
              
                  {/* Bar Chart */}
                  {/* <div className='card-body'>
                      <h3>Property Activities (Bar Chart)</h3>
                      <BarChart
                          width={500}
                          height={300}
                          data={statisticsData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#82ca9d" />
                      </BarChart>
                  </div> */}

                  {/* Pie Chart */}
                  <div className='card-body'>
                      <h3>Property Overview (Pie Chart)</h3>
                      <PieChart width={1500} height={600}>
                          <Pie
                              data={statisticsData}
                              cx={500}
                              cy={200}
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={150}
                              fill="#8884d8"
                              dataKey="value"
                          >
                              {statisticsData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                          </Pie>
                          <Tooltip />
                      </PieChart>
                  </div>
                </div>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="tab-pane fade show active">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Password</h5>
                    <form action="/changePassword" method="post">
                      <div className="form-group">
                        <label htmlFor="inputPasswordCurrent">Current password</label>
                        <input type="password" className="form-control" id="inputPasswordCurrent" name="inputPasswordCurrent" onChange={handlePasswordsChange} />
                        <small>
                          <a href="#" style={{ color: '#936c4ac7' }}>
                            Forgot your password?
                          </a>
                        </small>
                      </div>
                      <div className="form-group">
                        <label htmlFor="inputPasswordNew">New password</label>
                        <input type="password" className="form-control" id="inputPasswordNew" name="inputPasswordNew" onChange={handlePasswordsChange} />
                      </div>
                      <div className="form-group">
                        <label htmlFor="inputPasswordNew2">Verify password</label>
                        <input type="password" className="form-control" id="inputPasswordNew2" name="inputPasswordNew2" onChange={handlePasswordsChange} />
                      </div>
                      <button type="submit" className="btn" onClick={handleChangePassword} >Save changes</button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Properties Tab */}
            {activeTab === 'saved_properties' && (
              <section className="listings section-det">
                  <div className="box-container-user">
                    {savedProperties && savedProperties.length > 0 ? (
                      savedProperties.map((property, i) => (
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
                            <img src={`./${property.image[0].replace(/\\/g, '/')}`} alt={property.image[0].replace(/\\/g, '/')} />
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
                          
                          <button className="btn" type="submit" onClick={() => handleViewProperty(property._id)}>View Property</button>
                        </div>
                      ))
                    ) : (
                      <p>You haven't Saved any Properties yet.</p>
                    )}
                  </div>
              </section>
            )}

            {/* Posted Properties Tab */}
            {activeTab === 'posted_properties' && (
              <section className="listings section-det">
                <div className="box-container-user">
                  {postedProperties && postedProperties.length > 0 ? (
                    postedProperties.map((property, i) => (
                      <div className="box" key={i}>
                        <div className="admin">
                          <h3>{myDetails.name.charAt(0)}</h3>
                          <div>
                            <p>{myDetails.name}</p>
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
                          <img src={`./${property.image[0].replace(/\\/g, '/')}`} alt={property.image[0].replace(/\\/g, '/')} />
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
                        
                        <button className="btn" type="submit" onClick={() => handleViewProperty(property._id)}>View Property</button>
                        <button className="dltbtn" type="button" onClick={openPopup}>Delete Property</button>

                        {dltProp && (
                          <div>
                            <div className="overlay" onClick={closePopup}></div>
                            <div className="popup">
                              <button className="dltbtn" type="button" onClick={() => handleDltProp(property._id)}>Permanently Delete this Property</button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                    ))
                  ) : (
                    <p>You haven't Posted any Properties yet.</p>
                  )}
                </div>
              </section>
            )}

              

            {/* Log Out Tab */}
            {activeTab === 'logout' && (
              <div className="tab-pane fade show active">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Do you want to log out?</h5>
                    <button type="submit" className="btn btn-1" onClick={logUserOut}>Confirm Log Out</button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Tab */}
            {activeTab === 'delete' && (
              <div className="tab-pane fade show active">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Permanently Delete Account</h5>
                    <form>
                      <div className="form-group">
                        <label htmlFor="inputPasswordCurrent">Enter the current password</label>
                        <input type="password" className="form-control" id="password" name="password" onChange={(e)=>setDeleteAccount(e.target.value)} required/>
                      </div>
                      <button className="btn btn-danger" onClick={confirmDelete}>Delete Account</button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      {/* </div> */}
    </div>
  );
}

export default UserProfile;
