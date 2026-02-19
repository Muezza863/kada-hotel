import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CheckIn = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    identityNumber: '',
    gender: '',
    phoneNumber: '',
    estimatedDays: 1,
    note: ''
  });

  // ================= FETCH ROOM =================
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(
          `https://69953a6ab081bc23e9c25d37.mockapi.io/api/rooms/${roomId}`
        );
        const data = await res.json();
        setRoom(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  // ================= HANDLE FORM =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ================= GENERATE BOOKING ID =================
  const generateBookingId = async () => {
  try {
    // 1. AMBIL DATA DARI SERVER (Ganti URL sesuai API Anda)
    const response = await fetch('https://69953a6ab081bc23e9c25d37.mockapi.io/api/activeBookings');
    const data = await response.json();

    // 2. LOGIKA JIKA DATA MASIH KOSONG
    if (!data || data.length === 0) {
      return "1";
    }

    // 3. AMBIL DATA TERAKHIR
    // Mengambil elemen paling belakang dari array
    const lastBooking = data[data.length - 1];

    // 5. TAMBAHKAN 1
    const nextNumber = parseInt(lastBooking.id) + 1;         // Hasil: 16

    return nextNumber;

  } catch (error) {
    console.error("Gagal membuat ID baru:", error);
    return "BK-ERROR"; // Fallback jika server mati
  }
};

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!formData.fullName || !formData.identityNumber || !formData.gender) {
      alert("Please fill required fields");
      return;
    }

    if (room.status === "occupied") {
      alert("Room already occupied!");
      return;
    }

    const bookingId = await generateBookingId();

    const newBooking = {
      roomId: room.id,
      customer: {
        fullName: formData.fullName,
        identityNumber: formData.identityNumber,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber
      },
      estimatedDays: Number(formData.estimatedDays),
      note: formData.note,
      checkInDate: new Date().toISOString()
    };

    try {
      // 1️⃣ POST Active Booking
      await fetch(
        `https://69953a6ab081bc23e9c25d37.mockapi.io/api/activeBookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newBooking)
        }
      );

      // 2️⃣ UPDATE ROOM STATUS
      await fetch(
        `https://69953a6ab081bc23e9c25d37.mockapi.io/api/rooms/${room.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...room,
            status: "occupied",
            currentBookingId: bookingId
          })
        }
      );

      alert("Check-in berhasil!");
      navigate("/rooms");

    } catch (err) {
      console.error("Check-in gagal:", err);
      alert("Terjadi kesalahan saat check-in.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!room) return <div>Room Not Found</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      
      <h2>Check-In Process - Room {room.roomNumber}</h2>

      {/* ROOM DETAIL */}
      <div style={cardStyle}>
        <h3>Room Detail</h3>
        <p><b>Room Number:</b> {room.roomNumber}</p>
        <p><b>Category:</b> {room.category}</p>
        <p><b>Status:</b> {room.status}</p>
        <p><b>Bed Type:</b> {room.specs?.bedType}</p>
        <p><b>Size:</b> {room.specs?.size}</p>

        <p><b>Facilities:</b></p>
        <ul>
          {room.specs?.facilities?.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </div>

      {/* GUEST FORM */}
      <div style={cardStyle}>
        <h3>Guest Information</h3>

        {[
          { label: "Full Name", name: "fullName" },
          { label: "Identity Number", name: "identityNumber" },
          { label: "Phone Number", name: "phoneNumber" }
        ].map(field => (
          <div style={formRow} key={field.name}>
            <label style={labelStyle}>{field.label}</label>
            <input
              style={inputStyle}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
            />
          </div>
        ))}

        <div style={formRow}>
          <label style={labelStyle}>Gender</label>
          <select
            style={inputStyle}
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        <div style={formRow}>
          <label style={labelStyle}>Stay (Days)</label>
          <input
            type="number"
            min="1"
            style={inputStyle}
            name="estimatedDays"
            value={formData.estimatedDays}
            onChange={handleChange}
          />
        </div>

        <div style={formRow}>
          <label style={labelStyle}>Note</label>
          <textarea
            style={inputStyle}
            name="note"
            value={formData.note}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* SUMMARY */}
      <div style={cardStyle}>
        <h3>Stay Summary</h3>
        <p>
          Guest will stay for <b>{formData.estimatedDays}</b> day(s)
        </p>
      </div>

      {/* BUTTON */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button style={confirmBtn} onClick={handleSubmit}>
          Confirm Check In
        </button>

        <button style={cancelBtn} onClick={() => navigate('/rooms')}>
          Cancel
        </button>
      </div>

    </div>
  );
};

// STYLES
const cardStyle = {
  border: '1px solid #ccc',
  padding: '20px',
  marginBottom: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const formRow = {
  display: 'flex',
  marginBottom: '12px',
  alignItems: 'center'
};

const labelStyle = {
  width: '160px',
  fontWeight: 'bold'
};

const inputStyle = {
  flex: 1,
  padding: '8px'
};

const confirmBtn = {
  padding: '10px 20px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

const cancelBtn = {
  padding: '10px 20px',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default CheckIn;
