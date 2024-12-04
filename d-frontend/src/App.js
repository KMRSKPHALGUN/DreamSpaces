import { useLocation, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import { VideoCall } from './components/videoCall';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { setLocalhost } from './redux/reducer';
import { store } from './redux/store';

function App() {
  const localhost = useSelector((state) => state.lh.localhost);
  const location = useLocation();
  const dispatch = useDispatch();

  const handleSetLocalhost = (localhost) => {
    console.log(localhost);
    dispatch(setLocalhost(localhost));
    console.log("complete dispatch");
  };

  return (
    <>
      <Provider store={store}>
          {!location.pathname.startsWith("/videoCall") && <VideoCall />}
          <Routes>
            <Route path="/" element={<LandingPage onSetLocalhost={handleSetLocalhost} />}></Route>
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
            <Route path="/videoCall" element={<VideoCall/>}></Route>
          </Routes>
      </Provider>
    </>
  );
}

export default App;
