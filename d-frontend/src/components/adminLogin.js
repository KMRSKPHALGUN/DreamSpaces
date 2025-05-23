import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../css/admin_login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const AdminLogin = () => {
  const localhost = localStorage.getItem('localhost');
  let navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
        const response = await axios.post(`https://dreamspaces.onrender.com/api/adminLogin`,{
            email: adminEmail,
            password: adminPassword
        });
        localStorage.setItem('token', response.data.token);
        alert(response.data.message);
        navigate('/admin');
    }
    catch(error)
    {
        console.log("Someting went wrong");
        alert("Someting went wrong");
    }

    // Optionally, clear the form after submission
    setAdminEmail('');
    setAdminPassword('');
  };

  return (
    <>
      
      <div
        className="modal fade show d-block"
        id="adminLoginModal"
        tabIndex="-1"
        aria-labelledby="adminLoginModalLabel"
        aria-hidden="true"
      >
        <button className="back-button" onClick={() => navigate(-1)}><FontAwesomeIcon icon={faArrowLeft}/></button>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="adminLoginModalLabel">
                Admin Login
              </h5>
            </div>
            <div className="modal-body">
              {/* Admin Login Form */}
              <form>
                <div className="mb-3">
                  <label htmlFor="adminEmail" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="adminEmail"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="adminPassword" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="adminPassword"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-admin btn-primary" onClick={handleSubmit}>
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
