import React, { useEffect, useState } from 'react';
import '../css/user_details.css'; // Import your CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

function UserProfile()  {
  const [myDetails, setMyDetails] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setMessage(urlParams.get('message'));

    if (message) {
      alert(message);
    }
  }, [message]);

  const confirmDelete = () => {
    const confirmation = window.confirm("Are you sure you want to permanently delete your account?");
    if (confirmation) {
      alert("Account deleted successfully!");
    } else {
      alert("Account deletion canceled.");
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
    <div>

      <div className="container pt-0">
        <div className="row mt-5">
          <div className="col-md-5 col-xl-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Profile Settings</h5>
              </div>
              <div className="list-group list-group-flush" role="tablist">
                <a className="list-group-item list-group-item-action" data-toggle="list" href="#account" role="tab">Account</a>
                <a className="list-group-item list-group-item-action" data-toggle="list" href="#password" role="tab">Password</a>
                <a className="list-group-item list-group-item-action" data-toggle="list" href="#saved_properties" role="tab">Saved Properties</a>
                <a className="list-group-item list-group-item-action" data-toggle="list" href="#posted_properties" role="tab">Posted Properties</a>
                <a className="list-group-item list-group-item-action" data-toggle="list" href="#logout" role="tab">Log Out</a>
                <a className="list-group-item list-group-item-action" data-toggle="list" href="#delete" role="tab">Delete account</a>
              </div>
            </div>
          </div>

          <div className="col-md-7 col-xl-8">
            <div className="tab-content">
              {/* Account Tab */}
              <div className="tab-pane fade" id="account" role="tabpanel">
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
                                <label htmlFor="inputname"><h5>Name:</h5></label> <label>{myDetails.name}</label>
                              </div>
                              <div className="form-group">
                                {myDetails.bio ? (
                                  <span><label htmlFor="bio"><h5>Bio:</h5> <label>{myDetails.bio}</label></label></span>
                                ) : (
                                  <>
                                    <label htmlFor="bio"><h5>Bio:</h5></label>
                                    <textarea rows="2" className="form-control" id="bio" name="bio" placeholder="Something about yourself"></textarea>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="col-md-4 text-center">
                              <img
                                alt="Profile_Picture"
                                src={selectedImage || (myDetails.profile_pic || 'images/empty_profile.png')}
                                id="profile-pic"
                                className="rounded-circle img-responsive mt-2"
                                width="128"
                                height="128"
                              />
                              {!myDetails.profile_pic && (
                                <>
                                  <label htmlFor="image" className="upload_img">Upload Image</label>
                                  <input className="disappear" type="file" accept="image/*" id="image" name="image" onChange={handleImageChange} />
                                </>
                              )}
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="inputemail"><h5>Email:</h5></label> <label>{myDetails.email}</label>
                          </div>
                          <div className="form-group">
                            <label htmlFor="inputnumber"><h5>Phone Number:</h5></label> <label>{myDetails.phone}</label>
                          </div>
                          <div className="form-group">
                            <label htmlFor="motive"><h5>What is your primary motive of being active on our website?</h5></label>
                            {myDetails.motive ? (
                              <label>{myDetails.motive}</label>
                            ) : (
                              <select id="motive" name="motive" className="form-control">
                                <option selected>Choose</option>
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

              {/* Password Tab */}
              <div className="tab-pane fade" id="password" role="tabpanel">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Password</h5>
                    <form action="/changePassword" method="post">
                      <div className="form-group">
                        <label htmlFor="inputPasswordCurrent">Current password</label>
                        <input type="password" className="form-control" id="inputPasswordCurrent" name="inputPasswordCurrent" />
                        <small><a href="#" style={{ color: '#936c4ac7' }}>Forgot your password?</a></small>
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

              {/* Log Out Tab */}
              <div className="tab-pane fade" id="logout" role="tabpanel">
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

              {/* Delete Account Tab */}
              <div className="tab-pane fade" id="delete" role="tabpanel">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Permanently delete your account</h5>
                    <p>Are you sure you want to permanently delete your account? <br /> This action cannot be undone.</p>
                    <button className="btn btn-danger" onClick={confirmDelete}>Delete My Account</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
