import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import '../css/propDetList.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import EmptyProfile from '../images/empty_profile.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMapMarkerAlt, faCheck, faTag, faClock, faUser, faBuilding, faCalendar, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";


// Assuming that property, owner, and users are passed as props or fetched from an API
const ComRentViewProperty = () => {
  const localhost = localStorage.getItem('localhost');
  let navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const reportDescriptionRef = useRef(null);
  const commentInputRef = useRef(null);
  const token = localStorage.getItem('token');

  const property = JSON.parse(localStorage.getItem('property'));
  const owner = JSON.parse(localStorage.getItem('owner'));
  const reviews = JSON.parse(localStorage.getItem('reviews'));
  const users = JSON.parse(localStorage.getItem('users'));
  const client = JSON.parse(localStorage.getItem('client'));

  useEffect(() => {
    setMainImage(property.image[0]);
  }, []);

  const changeMainImage = (src) => {
    setMainImage(src);
  };

  const saveProperty = async (propId) => {
    try {
      const response = await axios.post(`https://${localhost}:5000/api/saveProperty`, {
        propId: propId
      },{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      if(response.data.message)
      {
        alert(response.data.message);
        navigate('/userProfile?tab=saved_properties');
      }
      else{
        alert(response.data.message2);
      }
      
    }
    catch(error)
    {
      console.log("Someting went Wrong");
      alert('Something went Wrong');
    }
  };

  const reportProperty = async (reportedPropertyId, report_description) => {
    try {
      const response = await axios.post(`https://${localhost}:5000/api/reportProperty`, {
        reportedPropertyId: reportedPropertyId,
        report_description: report_description
      },{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      if(response.data.message)
      {
        alert(response.data.message);
      }
      else{
        alert(response.data.message2);
      }
    }
    catch(error)
    {
      console.log("Someting went Wrong");
      alert('Something went Wrong');
    }
  };

  const reviewProperty = async (propertyId, comment_input) => {
    try {
      const response = await axios.post(`https://${localhost}:5000/api/reviewProperty`, {
        propertyId: propertyId,
        comment_input: comment_input
      },{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      if(response.data.message)
      {
        alert(response.data.message);
        localStorage.setItem('reviews', JSON.stringify(response.data.reviews));
        localStorage.setItem('users', JSON.stringify(response.data.users));
        window.location.reload();
      }
      else{
        alert(response.data.message2);
      }
    }
    catch(error)
    {
      console.log("Someting went Wrong");
      alert('Something went Wrong');
    }
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleStartCall = () => {
    navigate(`/videoCall/?roomId=${property._id}&ownerId=${owner._id}&callerName=${client.name}&callerId=${client._id}`);
  };

  return (
    <>
      <button className="back-button" onClick={() => navigate(-1)}><FontAwesomeIcon icon={faArrowLeft}/></button>
      {property && owner ? (
        <section className="view-property">
          <div className="details">
            <div className="thumb">
              <div className="big-image">
                <img src={mainImage} alt="" />
              </div>
              <div className="small-images">
                {property.image.map((img, index) => (
                  <img key={index} src={img} alt={img} onClick={() => changeMainImage(img)} />
                ))}
              </div>
            </div>
            <h3 className="name">Modern Flats and Apartments</h3>
            <p className="location">
              <FontAwesomeIcon icon={faMapMarkerAlt}/>
              <span>{`${property.landmark_street}, ${property.locality}, ${property.city}`}</span>
            </p>
            <div className="info">
              <p>
                <FontAwesomeIcon icon={faTag}/>
                <span>{property.Expected_rent}</span>
              </p>
              <p>
                <FontAwesomeIcon icon={faTag}/>
                <span>{property.Expected_deposit}</span>
              </p>
              <p>
                <FontAwesomeIcon icon={faUser}/>
                <span>{owner.name}</span>
              </p>
              <p>
                <FontAwesomeIcon icon={faBuilding}/>
                <span>{property.property_type}</span>
              </p>
            </div>

            <h3 className="title">Details</h3>
            <div className="flex">
              <div className="box">
                <p>
                  <i>Building Type :</i>
                  <span>{property.building_type}</span>
                </p>
                <p>
                  <i>Lease Period :</i>
                  <span>{property.lease} years</span>
                </p>
                <p>
                  <FontAwesomeIcon icon={faCalendar}/>
                  <i>Ready From:</i>
                  <span>{property.available_from.substring(0, 10)}</span>
                </p>
                <p>
                  <FontAwesomeIcon icon={faCalendar}/>
                  <i>Owner Availability: </i>
                  <span>{property.Availability}</span>
                </p>
                <p>
                  <FontAwesomeIcon icon={faClock}/>
                  <i>Availability Time: </i>
                  <span>{property.start_time + ' to ' + property.end_time}</span>
                </p>
              </div>
              <div className="box">
                <p>
                  <i>Built Up area :</i>
                  <span>{property.builtuparea} sqft</span>
                </p>
                <p>
                  <i>Carpet area :</i>
                  <span>{property.carpetarea} sqft</span>
                </p>
                <p>
                  <i>Age :</i>
                  <span>{property.age} years</span>
                </p>
                <p>
                  <i>Floor :</i>
                  <span>{property.floors}</span>
                </p>
                <p>
                  <i>Total Floors :</i>
                  <span>{property.totalfloor}</span>
                </p>
                <p>
                  <i>Furnished :</i>
                  <span>{property.furnish === 'full' && ('Fully Furnished')}{property.furnish === 'semi' && ('Semi Furnished')}{property.furnish === 'un' && ('Not Furnished')}</span>
                </p>
                <p>
                </p>
              </div>
            </div>

            <h3 className="title">Amenities</h3>
            <div className="flex">
              <div className="box">
                {property.security === "yes" ? (
                  <p>
                    <FontAwesomeIcon icon={faCheck}/>
                    <span>Gated Security: Yes</span>
                  </p>
                ) : (
                  <p>
                    <FontAwesomeIcon icon={faTimes}/>
                    <span>Gated Security: No</span>
                  </p>
                )}

                {property.water_storage === "yes" ? (
                  <p>
                    <FontAwesomeIcon icon={faCheck}/>
                    <span>Water Storage: Yes</span>
                  </p>
                ) : (
                  <p>
                    <FontAwesomeIcon icon={faTimes}/>
                    <span>Water Storage: No</span>
                  </p>
                )}

                {property.lift === "none" && (
                  <p><FontAwesomeIcon icon={faTimes}/><span>Lift: None</span></p>
                )}
                {property.lift === "personal" && (
                  <p><FontAwesomeIcon icon={faCheck}/><span>Lift: Personal</span></p>
                )}
                {property.lift === "common" && (
                  <p><FontAwesomeIcon icon={faCheck}/><span>Lift: Common</span></p>
                )}

                {property.powerbackup === "need" && (
                  <p><FontAwesomeIcon icon={faTimes}/><span>Power Backup: Need to Arrange</span></p>
                )}
                {property.powerbackup === "full" && (
                  <p><FontAwesomeIcon icon={faCheck}/><span>Power Backup: Full</span></p>
                )}
                {property.powerbackup === "partial" && (
                  <p><FontAwesomeIcon icon={faCheck}/><span>Power Backup: Partial</span></p>
                )}

                {property.wash === "none" && (
                  <p><FontAwesomeIcon icon={faTimes}/><span>No Washrooms</span></p>
                )}
                {property.lift === "private" && (
                  <p><FontAwesomeIcon icon={faCheck}/><span>Washrooms: Private</span></p>
                )}
                {property.lift === "shared" && (
                  <p><FontAwesomeIcon icon={faCheck}/><span>Washrooms: Shared</span></p>
                )}

                {property.parking === "yes" ? (
                  <p>
                    <FontAwesomeIcon icon={faCheck}/>
                    <span>Parking: Yes</span>
                  </p>
                ) : (
                  <p>
                    <FontAwesomeIcon icon={faTimes}/>
                    <span>Parking: No</span>
                  </p>
                )}


                {/* Additional conditions for other amenities */}
              </div>
            </div>

            <h3 className="title">Description</h3>
            <p className="description">{property.locality_description}</p>

            {/* Save Property button */}

            <input type="submit" value="Save Property" className="inline-btn" onClick={() => saveProperty(property._id)} />


            {/* Report Form with popup */}
            <form>
              <input
                type="button"
                value="Report"
                name="Report"
                className="inline-btn"
                onClick={openPopup}
              />
              {showPopup && (
                <div>
                  <div className="overlay" onClick={closePopup}></div>
                  <div className="popup">
                    <h2>Report Form</h2>
                    <label htmlFor="report_description">Description:</label>
                    <br />
                    <textarea id="report_description" name="report_description" rows="4" ref={reportDescriptionRef} />
                    <br />
                    <button type="submit" onClick={() => {closePopup(); reportProperty(property._id, reportDescriptionRef.current.value)}}>
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </section>
      ) : (
        <p>Sorry, we don't have any properties with your specifications.</p>
      )}

      {/* Reviews Section */}
      <section>
        <h1 className="heading">Client's Reviews</h1>
      </section>

      <div className="comment-container">
          <textarea
            id="comment_input"
            name="comment_input"
            placeholder="Type your comment here..."
            ref={commentInputRef}
          ></textarea>
          <button type="submit" id="submit-comment" onClick={() => reviewProperty(property._id, commentInputRef.current.value)}>
            Submit
          </button>

        {reviews && users ? (
          users.map((user, index) => (
            <div key={index} className="comment">
              <div className="profile-container">
                <img
                  src={user.profile_pic || EmptyProfile}
                  className="profile-photo"
                  alt="User"
                />
                <strong className="profile-name">{user.name}</strong>
              </div>
              <div className="commenter-text">
                <p>{reviews.comment_input[index]}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No reviews to show</p>
        )}
      </div>
      <div>
        {/* Render other property details */}
        <button onClick={handleStartCall}>Start Video Call with Owner</button>
      </div> 
    </>
  );
};

export default ComRentViewProperty;