import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import 'font-awesome/css/font-awesome.min.css';
import LandingPage from './components/landingPage';
import Login from './components/login';
import Signup from './components/signup';
import AdminDashboard from './components/adminDashboard';
import AdminLogin from './components/adminLogin';
import HomePage from './components/homePage';
import PostYourProperty from './components/postYourProperty';
import ResidentialRent from './components/residentialRent';
import CommercialRent from './components/commercialRent';
import CommercialSale from './components/commercialSale';
import UserProfile from './components/userDetails';
import PropertyListings from './components/propertyListings';
import ComRentViewProperty from './components/propDetComRent';
import { PrivateRoute, AdminPrivateRoute } from './components/privateRoute';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function App() {
  // useEffect(() => {
  //   // Remove token from local storage when window is closed
  //   window.onbeforeunload = function() {
  //     localStorage.removeItem('token');
  //   };

  //   // Cleanup on component unmount
  //   return () => {
  //     window.onbeforeunload = null;  // Ensure no memory leaks
  //   };
  // }, []);  // Empty dependency array ensures this runs once on mount
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/adminLogin' element={<AdminLogin/>}></Route>
        <Route path='/admin' element={<AdminPrivateRoute/>}>
          <Route path='/admin' element={<AdminDashboard/>}> </Route>
        </Route>
        <Route path='/home' element={<PrivateRoute/>}>
          <Route path='/home' element={<HomePage/>}></Route>
        </Route>
        <Route path='/postYourProperty' element={<PrivateRoute/>}>
          <Route path='/postYourProperty' element={<PostYourProperty/>}></Route>
        </Route>
        <Route path='/residentialRent' element={<PrivateRoute/>}>
          <Route path='/residentialRent' element={<ResidentialRent/>}></Route>
        </Route>
        <Route path='/commercialRent' element={<PrivateRoute/>}>
          <Route path='/commercialRent' element={<CommercialRent/>}></Route>
        </Route>
        <Route path='/commercialSale' element={<PrivateRoute/>}>
          <Route path='/commercialSale' element={<CommercialSale/>}></Route>
        </Route>
        <Route path='/userProfile' element={<PrivateRoute/>}>
          <Route path='/userProfile' element={<UserProfile/>}></Route>
        </Route>
        <Route path='/property_listings' element={<PrivateRoute/>}>
          <Route path='/property_listings' element={<PropertyListings/>}></Route>
        </Route>
        <Route path='/comRentViewProperty' element={<PrivateRoute/>}>
          <Route path='/comRentViewProperty' element={<ComRentViewProperty/>}></Route>
        </Route>
        
        
      </Routes>
    </Router>
  );
}

export default App;
