import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LandingPage from './components/landingPage';
import Login from './components/login';
import Signup from './components/signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
