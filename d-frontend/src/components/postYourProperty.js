import React, { useState, useEffect } from 'react';
import '../css/postYourProperty.css'; // Assuming the CSS is in the same location


function PostYourProperty() {
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
    if (propertyType === 'residential' && adType === 'rent') path = '/residential_rent';
    else if (propertyType === 'residential' && adType === 'sale') path = '/residential_sale';
    else if (propertyType === 'residential' && adType === 'flatmates') path = '/residential_flatmates';
    else if (propertyType === 'commercial' && adType === 'rent') path = '/commercialRent';
    else if (propertyType === 'commercial' && adType === 'sale') path = '/commercial_sale';
    else if (propertyType === 'land' && adType === 'sale') path = '/plot_sale';
    else if (propertyType === 'land' && adType === 'development') path = '/plot_dev';

    if (path) {
      window.location.href = path;
    }
  };

  return (

    <div className="search-form">
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
