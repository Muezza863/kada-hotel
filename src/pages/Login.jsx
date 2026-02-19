// import React from 'react';
import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const navigate = useNavigate();
//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h2>Halaman Login Resepsionis</h2>
      
//       <button onClick={() => navigate('/rooms')}>Login Sementara</button>
//     </div>
//   );
// };

// export default Login;

// Import React dan hook useState untuk menyimpan data sementara
import React, { useState, useEffect } from "react";


function LoginPage() {
  // State untuk menyimpan input user
  const [username, setUsername] = useState(""); // menyimpan username yang diketik
  const [password, setPassword] = useState(""); // menyimpan password yang diketik
  const [error, setError] = useState("");       // menyimpan pesan error jika login gagal
  const [users, setUsers] = useState([]);       // menyimpan data user dari JSON online
  const navigate = useNavigate();

  // useEffect dipakai untuk mengambil data JSON saat komponen pertama kali muncul
  useEffect(() => {
    // Ganti URL di bawah dengan link JSON online kamu
    fetch("https://my-json-server.typicode.com/Muezza863/Kada-Hotel-Json/users")
      .then((response) => response.json()) // ubah response jadi format JSON
      .then((data) => setUsers(data))      // simpan data JSON ke state "users"
      .catch((err) => console.error("Gagal ambil data:", err));
  }, []); // [] artinya hanya dijalankan sekali saat komponen pertama kali render

  // Fungsi yang dijalankan saat tombol Login ditekan
  const handleLogin = (e) => {
    e.preventDefault(); // mencegah reload halaman default form

    // Cari user di data JSON online
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    // Jika ditemukan user dengan username & password yang cocok
    if (user) {
       navigate("/rooms");
      // TODO: arahkan ke halaman lain, misalnya dashboard

    } else {
      // Jika tidak cocok, tampilkan pesan error
      setError("Username atau password salah!");
    }
  };

  return (
    <div className="login-container">
      <h2>Hotel Check-in/Check-out</h2>
      {/* Form login */}
      <form onSubmit={handleLogin}>
        {/* Input username */}
        <input
          type="text"
          placeholder="Username"
          value={username} // nilai input diambil dari state
          onChange={(e) => setUsername(e.target.value)} // update state saat diketik
        />

        {/* Input password */}
        <input
          type="password"
          placeholder="Password"
          value={password} // nilai input diambil dari state
          onChange={(e) => setPassword(e.target.value)} // update state saat diketik
        />

        {/* Jika ada error, tampilkan pesan */}
        {error && <p className="error">{error}</p>}

        {/* Tombol login */}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;