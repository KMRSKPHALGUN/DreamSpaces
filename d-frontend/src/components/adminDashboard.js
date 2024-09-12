import React, { useState } from "react";
import '../css/admin_dashboard.css'; // Adjust your CSS path as needed

function AdminDashboard({ users, properties, reports, owners }) {
  const [activeSection, setActiveSection] = useState("adminDashboard");

  // Function to show specific sections
  const showSection = (section) => {
    setActiveSection(section);
  };

  // Email validation function (example)
  const validateEmail = (email) => {
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return validRegex.test(email);
  };

  // Permissions form submit handler
  const handlePermissionSubmit = (event) => {
    event.preventDefault();
    // Handle permission logic
  };

  return (
    <div className="wrapper">
      <aside id="sidebar">
        <ul className="sidebar-nav">
          <li className="sidebar-item">
            <a href="/index" className="sidebar-link">
              <i className="lni lni-home"></i>
            </a>
          </li>
          <li className="sidebar-item" onClick={() => showSection("adminDashboard")}>
            <a href="#" className="sidebar-link">
              <i className="lni lni-dashboard"></i>
            </a>
          </li>
          <li className="sidebar-item" onClick={() => showSection("permissions")}>
            <a href="#" className="sidebar-link">
              <i className="lni lni-user"></i>
            </a>
          </li>
          <li className="sidebar-item" onClick={() => showSection("properties")}>
            <a href="#" className="sidebar-link">
              <i className="lni lni-agenda"></i>
            </a>
          </li>
          <li className="sidebar-item" onClick={() => showSection("reports")}>
            <a href="#" className="sidebar-link">
              <i className="lni lni-popup"></i>
            </a>
          </li>
        </ul>
      </aside>

      <div id="main">
        {/* Admin Dashboard Section */}
        {activeSection === "adminDashboard" && (
          <div className="content-section active" id="adminDashboard">
            <div className="mb-3">
              <h3 className="fw-bold fs-4 mb-3">Admin Dashboard</h3>
              <h3 className="fw-bold fs-4 my-3">User Statistics</h3>
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
                              <button onClick={() => console.log("Delete user", user.email)}>
                                <i className="lni lni-trash-can" style={{ fontSize: "24px" }}></i>
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
            <h3 className="fw-bold fs-4 mb-3">Permission Allotting</h3>
            <div className="row">
              <div className="col-12">
                <div className="card border-0">
                  <div className="card-body">
                    <form onSubmit={handlePermissionSubmit}>
                      <div className="mb-3">
                        <label htmlFor="useremail" className="form-label">
                          User email:
                        </label>
                        <input type="email" id="useremail" name="useremail" className="form-control" required />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="permissionType" className="form-label">Permission Type:</label>
                        <select id="permissionType" name="permissionType" className="form-select" required>
                          <option value="">Select Permission Type</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <button type="submit" className="btn">Assign Permission</button>
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
            <h3 className="fw-bold fs-4 mb-3">Properties</h3>
            {properties.length > 0 ? (
              properties.map((property, i) => (
                <div className="listings" key={i}>
                  <div className="box-container">
                    <div className="box">
                      <div className="admin">
                        <h3>Property Owner</h3>
                        <div>
                          <p>{owners[i].name}</p>
                          <span>{property.available_from}</span>
                        </div>
                      </div>
                      <div className="thumb">
                        <p className="total-images">
                          <i className="far fa-image"></i>
                          <span>{property.image.length}</span>
                        </p>
                        <img src={`/${property.image[0]}`} alt="Property" />
                      </div>
                      <h3 className="name">Modern Flats and Apartments</h3>
                      <p className="location">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{property.landmark_street}, {property.locality}, {property.city}</span>
                      </p>
                      <div className="flex">
                        <p><i className="fas fa-bed"></i><span>{property.bhk_type}</span></p>
                        <p><i className="fas fa-bath"></i><span>{property.bathrooms}</span></p>
                        <p><i className="fas fa-maximize"></i><span>{property.built_up_area} sqft</span></p>
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
            <h3 className="fw-bold fs-4 mb-3">Property Reports</h3>
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
