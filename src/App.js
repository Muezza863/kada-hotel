import logo from './logo.svg';
import './App.css';
import { Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import RoomList from './pages/RoomList';
import CheckIn from './pages/CheckIn';
import CheckOut from './pages/CheckOut';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/rooms" element={<RoomList />} />
        <Route path="/checkin/:roomId" element={<CheckIn />} />
        <Route path="/checkout/:bookingId" element={<CheckOut />} />
      </Routes>
  );
}

export default App;
