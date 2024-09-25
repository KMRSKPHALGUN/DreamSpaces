import React, { useState, useEffect } from "react";
import '../css/admin_dashboard.css'; // Adjust your CSS path as needed
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faDashboard, faUser, faBuilding, faBug, faTrashCan, faImage, faBed, faBath, faMapMarkerAlt, faMaximize } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("adminDashboard");
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [owners, setOwners] = useState([]);
  const [reports, setReports] = useState([]);
  const [makeAdmin, setMakeAdmin] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDetails = async() => {
      try{
        const response = await axios.get('http://localhost:5000/api/adminDashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.users);
        setProperties(response.data.properties);
        setOwners(response.data.owners);
        setReports(response.data.reports);
        if(response.data.error)
        {
          alert(response.data.error);
        }
      }
      catch(error)
      {
        console.log("Someting went wrong");
        alert("Someting went wrong");
      }
    };

    fetchDetails();

  }, []);

  // Email validation function (example)
  const validateEmail = (email) => {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return validRegex.test(email);
  };

  const handleMakeAdmin = async () => {
    try{
      const response = await axios.post('http://localhost:5000/api/makeAdmin', {
        useremail: makeAdmin
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(response.data.message)
      {
        alert(response.data.message);
        setMakeAdmin('');
        window.location.reload();
      }
      else if(response.data.error)
      {
        alert(response.data.error);
      }
    }
    catch(error)
    {
      console.log("Someting went wrong");
        alert("Someting went wrong");
    }
  };

  const handleDeleteUser = async (email) => {
    try{
      const response = await axios.post('http://localhost:5000/api/deleteUser', {
        u_email: email
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(response.data.message)
      {
        alert(response.data.message);
        window.location.reload();
      }
      else if(response.data.error)
      {
        alert(response.data.error);
      }
    }
    catch(error)
    {
      console.log("Someting went wrong");
        alert("Someting went wrong");
    }
  };

  return (
    <div className="wrapper">
      <aside id="sidebar">
        <ul className="sidebar-nav">
          <li className="sidebar-item">
            <a href="/" className="sidebar-link">
              <FontAwesomeIcon icon={faHome}/>
            </a>
          </li>
          <li className="sidebar-item" onClick={() => {setActiveSection("adminDashboard"); console.log(activeSection);}}>
            <a href="#" className="sidebar-link">
              <FontAwesomeIcon icon={faDashboard}/>
            </a>
          </li>
          <li className="sidebar-item" onClick={() => {setActiveSection("permissions"); console.log(activeSection);}}>
            <a href="#permissions" className="sidebar-link">
              <FontAwesomeIcon icon={faUser}/>
            </a>
          </li>
          <li className="sidebar-item" onClick={() => {setActiveSection("properties"); console.log(activeSection);}}>
            <a href="#properties" className="sidebar-link">
              <FontAwesomeIcon icon={faBuilding}/>
            </a>
          </li>
          <li className="sidebar-item" onClick={() => {setActiveSection("reports"); console.log(activeSection);}}>
            <a href="#reports" className="sidebar-link">
              <FontAwesomeIcon icon={faBug}/>
            </a>
          </li>
        </ul>
      </aside>

      <div id="main">
        {/* Admin Dashboard Section */}
        {activeSection === "adminDashboard" && (
          <div className="content-section active" id="adminDashboard">
            <div className="mb-3">
              <h3 className="fw-bold fs-4 m-5">Admin Dashboard</h3>
              <h3 className="fw-bold fs-4 m-5">User Statistics</h3>
              {users && users.length > 0 ? (
                <div className="row">
                  <div className="col-12">
                    <table className="table table-striped">
                      <thead>
                        <tr className="highlight">
                          <th scope="col">Serial No.</th>
                          <th scope="col">Name</th>
                          <th scope="col">Buyer/Seller</th>
                          <th scope="col">Email ID</th>
                          <th scope="col">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, i) => (
                          <tr key={i}>
                            <th scope="row">{i + 1}</th>
                            <td>{user.name}</td>
                            <td>
                              {user.savedProperties.length > 0 && user.postedProperties.length > 0
                                ? "Both"
                                : user.savedProperties.length > 0
                                ? "Buyer"
                                : user.postedProperties.length > 0
                                ? "Seller"
                                : "No Activity"}
                            </td>
                            <td>{user.email}</td>
                            <td>
                              <button onClick={() => handleDeleteUser(user.email)}>
                                <FontAwesomeIcon icon={faTrashCan} style={{ fontSize: "24px" }} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p>No users found</p>
              )}
            </div>
          </div>
        )}

        {/* Permissions Section */}
        {activeSection === "permissions" && (
          <div className="content-section" id="permissions">
            <h3 className="fw-bold fs-4 m-5">Want to make an User Admin?</h3>
            <div className="row">
              <div className="col-12">
                <div className="card border-0">
                  <div className="admin-card-body">
                    <form>
                      <div className="m-5">
                        <label htmlFor="useremail" className="form-label">
                          Enter User Email:
                        </label>
                        <input type="email" id="useremail" name="useremail" className="form-control" value={makeAdmin} onChange={(e) => setMakeAdmin(e.target.value)} required />
                      </div>
                      {/* <div className="mb-3">
                        <label htmlFor="permissionType" className="form-label">Permission Type:</label>
                        <select id="permissionType" name="permissionType" className="form-select" required>
                          <option value="">Select Permission Type</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div> */}
                      <button type="submit" className="btn-make-admin" onClick={handleMakeAdmin}>Make Admin</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Properties Section */}
        {activeSection === "properties" && properties && (
          <div className="content-section" id="properties">
            <h3 className="fw-bold fs-4 m-5">Properties</h3>
            {properties.length > 0 ? (
              properties.map((property, i) => (
                <div className="listings" key={i}>
                  <div className="box-container">
                    <div className="box">
                      <div className="admin">
                        <h3>{owners[i].name.charAt(0)}</h3>
                        <div>
                          <p>{owners[i].name}</p>
                          <span>{property.available_from}</span>
                        </div>
                      </div>
                      <div className="thumb">
                        <p className="total-images">
                          <FontAwesomeIcon icon={faImage}/>
                          <span>{property.image.length}</span>
                        </p>
                        <img src={`/${property.image[0]}`} alt="Property" />
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
                        <textarea name="object_id" style={{ display: "none" }}>{property._id}</textarea>
                        <button className="btn" type="submit">View Property</button>
                      </form>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No properties available.</p>
            )}
          </div>
        )}

        {/* Reports Section */}
        {activeSection === "reports" && (
          <div className="content-section" id="reports">
            <h3 className="fw-bold fs-4 m-5">Property Reports</h3>
            <div className="row">
              <div className="col-12">
                <div className="list-group">
                  {reports.length > 0 ? (
                    reports.map((report, i) => (
                      <div className="list-group-item" key={i}>
                        <h5 className="mb-1">{report.issue}</h5>
                        <p className="mb-1">Property Reported: {report.reportedPropertyId}</p>
                        <p className="mb-1">Reported by: {report.reportedUserId}</p>
                        <p className="mb-1">Date: {report.date}</p>
                        <p className="mb-1">Description: {report.description}</p>
                      </div>
                    ))
                  ) : (
                    <p>No property reports available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;