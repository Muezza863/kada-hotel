import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CheckIn.css'; // Import CSS file

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
      const response = await fetch('https://69953a6ab081bc23e9c25d37.mockapi.io/api/activeBookings');
      const data = await response.json();

      if (!data || data.length === 0) {
        return "1";
      }

      const lastBooking = data[data.length - 1];
      const nextNumber = parseInt(lastBooking.id) + 1;
      return nextNumber.toString();

    } catch (error) {
      console.error("Gagal membuat ID baru:", error);
      return "ERROR";
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
      id: bookingId,
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

  if (loading) return <div className="checkin-loading">Loading room details...</div>;
  if (error) return <div className="checkin-error">Error: {error.message}</div>;
  if (!room) return <div className="room-not-found">Room Not Found</div>;

  return (
    <div className="checkin-page">
      <div className="checkin-container">
        
        {/* Header Section */}
        <div className="checkin-header">
          <h1 className="checkin-title">
            Check-In Process - Room {room.roomNumber}
          </h1>
          <p className="checkin-subtitle">
            Complete guest information to proceed with check-in
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="checkin-grid">
          
          {/* Left Column - Room Details & Form */}
          <div className="checkin-left">
            
            {/* Room Details Card */}
            <div className="checkin-card">
              <h3 className="checkin-card-title">Room Details</h3>
              
              <div className="room-details-grid">
                <div className="room-detail-item">
                  <span className="room-detail-label">Room Number</span>
                  <span className="room-detail-value">{room.roomNumber}</span>
                </div>
                <div className="room-detail-item">
                  <span className="room-detail-label">Category</span>
                  <span className="room-detail-value">{room.category}</span>
                </div>
                <div className="room-detail-item">
                  <span className="room-detail-label">Status</span>
                  <span className="room-detail-value" style={{ 
                    color: room.status === 'available' ? '#10b981' : '#ef4444',
                    textTransform: 'capitalize'
                  }}>
                    {room.status}
                  </span>
                </div>
                <div className="room-detail-item">
                  <span className="room-detail-label">Bed Type</span>
                  <span className="room-detail-value">{room.specs?.bedType}</span>
                </div>
                <div className="room-detail-item">
                  <span className="room-detail-label">Size</span>
                  <span className="room-detail-value">{room.specs?.size}</span>
                </div>
              </div>

              <div>
                <span className="room-detail-label">Facilities</span>
                <ul className="facilities-list">
                  {room.specs?.facilities?.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Guest Information Form */}
            <div className="checkin-card">
              <h3 className="checkin-card-title">Guest Information</h3>
              
              <div className="checkin-form">
                {/* Full Name */}
                <div className="form-group">
                  <label className="required">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter guest full name"
                  />
                </div>

                {/* Two column layout for Identity and Phone */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="required">Identity Number</label>
                    <input
                      type="text"
                      name="identityNumber"
                      value={formData.identityNumber}
                      onChange={handleChange}
                      placeholder="KTP/Passport"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="08xxxx"
                    />
                  </div>
                </div>

                {/* Two column layout for Gender and Days */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="required">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select gender</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Stay Duration (Days)</label>
                    <input
                      type="number"
                      min="1"
                      name="estimatedDays"
                      value={formData.estimatedDays}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Note */}
                <div className="form-group">
                  <label>Note (Optional)</label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Any special requests or notes..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="checkin-right">
            <div className="checkin-sticky">
              
              {/* Summary Card */}
              <div className="summary-card">
                <h3 className="summary-title">Stay Summary</h3>
                <p className="summary-content">
                  {formData.estimatedDays} {formData.estimatedDays === 1 ? 'Day' : 'Days'}
                </p>
                <p className="summary-note">
                  Guest will stay for {formData.estimatedDays} night(s)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="checkin-actions">
                <button 
                  className="btn-confirm" 
                  onClick={handleSubmit}
                >
                  Confirm Check In
                </button>

                <button 
                  className="btn-cancel" 
                  onClick={() => navigate('/rooms')}
                >
                  Cancel
                </button>
              </div>

              {/* Additional Info */}
              <p style={{ 
                fontSize: '12px', 
                color: '#9ca3af', 
                marginTop: '16px',
                textAlign: 'center'
              }}>
                By confirming, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;