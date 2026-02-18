import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Halaman Login Resepsionis</h2>
      
      <button onClick={() => navigate('/rooms')}>Login Sementara</button>
    </div>
  );
};

export default Login;