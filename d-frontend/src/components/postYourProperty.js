import React, { useState, useEffect } from 'react';
import '../css/postYourProperty.css'; // Assuming the CSS is in the same location
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function PostYourProperty() {
  let navigate = useNavigate();
  const [propertyType, setPropertyType] = useState('');
  const [adTypeOptions, setAdTypeOptions] = useState([]);
  const [adType, setAdType] = useState('');

  useEffect(() => {
    const options = [];
    switch (propertyType) {
      case 'residential':
        options.push({ text: 'Rent', value: 'rent' });
        options.push({ text: 'Sale', value: 'sale' });
        options.push({ text: 'Flatmates', value: 'flatmates' });
        break;
      case 'commercial':
        options.push({ text: 'Rent', value: 'rent' });
        options.push({ text: 'Sale', value: 'sale' });
        break;
      case 'land':
        options.push({ text: 'Sale', value: 'sale' });
        options.push({ text: 'Development', value: 'development' });
        break;
      default:
        options.push({ text: 'Select Property Ad Type', value: '' });
        break;
    }
    setAdTypeOptions(options);
  }, [propertyType]);

  const handlePostAd = () => {
    let path = '';
    if (propertyType === 'residential' && adType === 'rent') path = '/residentialRent';
    else if (propertyType === 'residential' && adType === 'sale') path = '/residentialRent';
    else if (propertyType === 'residential' && adType === 'flatmates') path = '/residentialRent';
    else if (propertyType === 'commercial' && adType === 'rent') path = '/commercialRent';
    else if (propertyType === 'commercial' && adType === 'sale') path = '/commercialSale';
    else if (propertyType === 'land' && adType === 'sale') path = '/commercialSale';
    else if (propertyType === 'land' && adType === 'development') path = '/commercialSale';

    if (path) {
      navigate(path);
    }
  };

  return (

    <div className="search-form-post">
        <button className="back-button" onClick={() => navigate(-1)}><FontAwesomeIcon icon={faArrowLeft}/></button>
        <select id="property-type" name="property-type" value={propertyType} onChange={e => setPropertyType(e.target.value)}>
          <option value="">Property Type</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="land">Land/Plot</option>
        </select>
        <select id="ad-type" name="ad-type" value={adType} onChange={e => setAdType(e.target.value)}>
          <option value="">Select Property Ad Type</option>
          {adTypeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
        <button id="post-ad-button" type="button" onClick={handlePostAd}>
          Start Posting Your Ad For FREE
        </button>
    </div>

  );
}

export default PostYourProperty;
