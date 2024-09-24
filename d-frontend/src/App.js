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
import CommercialRent from './components/commercialRent';
import UserProfile from './components/userDetails';
import PropertyListings from './components/propertyListings';
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
        <Route path='/admin' element={<AdminDashboard/>}></Route>
        <Route path='/home' element={<HomePage/>}></Route>
        <Route path='/postYourProperty' element={<PostYourProperty/>}></Route>
        <Route path='/commercialRent' element={<CommercialRent/>}></Route>
        <Route path='/userProfile' element={<UserProfile/>}></Route>
        <Route path='/property_listings' element={<PropertyListings/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
