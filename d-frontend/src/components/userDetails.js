import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/user_details.css'; // Import your CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import EmptyProfile from '../images/empty_profile.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faMapMarkerAlt, faBed, faBath, faMaximize } from '@fortawesome/free-solid-svg-icons';

function UserProfile() {
  const [myDetails, setMyDetails] = useState(null);
  const [owners, setOwners] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('account'); // state to track the active tab
  const [savedProperties, setSavedProperties] = useState([]); // Track saved properties
  const [postedProperties, setPostedProperties] = useState([]); // Track posted properties

  useEffect(() => {
    const fetchUserDetails = async (event) => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/userDetails', 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }           
          }
        );
        setMyDetails(response.data.owner);
        setSavedProperties(response.data.s_property);
        setPostedProperties(response.data.property);
        setOwners(response.data.s_owner);
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
    }
    fetchUserDetails();
  }, []);

  const confirmDelete = () => {
    const confirmation = window.confirm('Are you sure you want to permanently delete your account?');
    if (confirmation) {
      alert('Account deleted successfully!');
    } else {
      alert('Account deletion canceled.');
    }
  };

  const handleImageChange = (event) => {
    const input = event.target;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(input.files[0]);
    }
  };

  return (
    <div className="container-user-det pt-0">
      {/* <div className="row mt-5"> */}
        {/* <div className="col-md-5 col-xl-4"> */}
          <div className="card-left">
            <div className="card-header">
              <h5 className="card-title mb-0">Profile Settings</h5>
            </div>
            <div className="list-group list-group-flush" role="tablist">
              <a
                className={`list-group-item list-group-item-action ${activeTab === 'account' ? 'active' : ''}`}
                onClick={() => setActiveTab('account')}
              >
                Account
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
                    <form action="/updateMyDetails" encType="multipart/form-data" method="post">
                      {myDetails && (
                        <>
                          <div className="row">
                            <div className="col-md-8">
                              <div className="form-group">
                                <label htmlFor="inputname">
                                  <h5>Name:</h5> <label>{myDetails.name}</label>
                                </label>
                              </div>
                              <div className="form-group">
                                {myDetails.bio ? (
                                  <span>
                                    <label htmlFor="bio">
                                      <h5>Bio:</h5> <label>{myDetails.bio}</label>
                                    </label>
                                  </span>
                                ) : (
                                  <>
                                    <label htmlFor="bio">
                                      <h5>Bio:</h5>
                                    </label>
                                    <textarea rows="2" className="form-control" id="bio" name="bio" placeholder="Something about yourself"></textarea>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="col-md-4 text-center">
                              <img
                                alt="Profile_Picture"
                                src={(myDetails.profile_pic || EmptyProfile)}
                                id="profile-pic"
                                className="rounded-circle img-responsive mt-2"
                                width="128"
                                height="128"
                              />
                              {!myDetails.profile_pic && (
                                <>
                                  <label htmlFor="image" className="upload_img">
                                    Upload Image
                                  </label>
                                  <input className="disappear" type="file" accept="image/*" id="image" name="image" onChange={handleImageChange} />
                                </>
                              )}
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="inputemail">
                              <h5>Email:</h5> <label>{myDetails.email}</label>
                            </label>
                          </div>
                          <div className="form-group">
                            <label htmlFor="inputnumber">
                              <h5>Phone Number:</h5> <label>{myDetails.phone}</label>
                            </label>
                          </div>
                          <div className="form-group">
                            <label htmlFor="motive">
                              <h5>What is your primary motive of being active on our website?</h5>
                            </label>
                            {myDetails.motive ? (
                              <label>{myDetails.motive}</label>
                            ) : (
                              <select id="motive" name="motive" className="form-control">
                                <option value=''>Choose</option>
                                <option value="Rent Homes/Commercial Spaces">Rent Homes/Commercial Spaces</option>
                                <option value="Sell Homes/Commercial Spaces/Plots">Sell Homes/Commercial Spaces/Plots</option>
                                <option value="Buy Homes/Commercial Spaces/Plots">Buy Homes/Commercial Spaces/Plots</option>
                                <option value="Develop Plots">Develop Plots</option>
                              </select>
                            )}
                          </div>
                          <button type="submit" className="btn">Save changes</button>
                        </>
                      )}
                    </form>
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
                        <input type="password" className="form-control" id="inputPasswordCurrent" name="inputPasswordCurrent" />
                        <small>
                          <a href="#" style={{ color: '#936c4ac7' }}>
                            Forgot your password?
                          </a>
                        </small>
                      </div>
                      <div className="form-group">
                        <label htmlFor="inputPasswordNew">New password</label>
                        <input type="password" className="form-control" id="inputPasswordNew" name="inputPasswordNew" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="inputPasswordNew2">Verify password</label>
                        <input type="password" className="form-control" id="inputPasswordNew2" name="inputPasswordNew2" />
                      </div>
                      <button type="submit" className="btn">Save changes</button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Properties Tab */}
            {activeTab === 'saved_properties' && (
              <section className="listings section-det">
                  <div className="box-container">
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
                          <form action="/property_details" method="post">
                            <textarea name="object_id" style={{ display: 'none' }} defaultValue={property._id}></textarea>
                            <button className="btn" type="submit">View Property</button>
                          </form>
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
                <div className="box-container">
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
                        <form action="/property_details" method="post">
                          <textarea name="object_id" style={{ display: 'none' }} defaultValue={property._id}></textarea>
                          <button className="btn" type="submit">View Property</button>
                        </form>
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
                    <form action="/logout" method="post">
                      <div className="form-group">
                        <label htmlFor="inputPasswordCurrent">Enter the current password</label>
                        <input type="password" className="form-control" id="inputPasswordCurrent" name="inputPasswordCurrent" />
                      </div>
                      <button type="submit" className="btn btn-1">Confirm Log Out</button>
                    </form>
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
                    <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
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
