import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoomList = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '20px' }}>
      <h2>Daftar Kamar</h2>
      {/* Tombol sementara untuk tes navigasi */}
      <button onClick={() => navigate('/checkin/RM-101')}>Simulasi Cek-in Kamar 101</button>
      <br /><br />
      <button onClick={() => navigate('/checkout/BK-001')}>Simulasi Cek-out Booking BK-001</button>
    </div>
  );
};

export default RoomList;