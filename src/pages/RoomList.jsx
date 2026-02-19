import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRooms } from '../store/slice/roomSlice';
import '../styles/RoomList.css';

const RoomList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: rooms, loading, error, hasFetched } = useSelector((state) => state.rooms);
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchRooms());
    }
  }, [dispatch, hasFetched]);

  const getRoomImage = (category) => {
    switch (category?.toLowerCase()) {
      case "standard":
        return "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800";
      case "deluxe":
        return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800";
      case "superior":
        return "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800";
      default:
        return "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800";
    }
  };

  const filteredRooms = rooms.filter((room) => {
    return filterCategory === 'all' || room.category === filterCategory;
  });

  const categories = ['all', ...new Set(rooms.map(room => room.category))];

  if (loading && rooms.length === 0) return <div className="loading">Loading data kamar...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="roomlist-container">

      <div className="roomlist-header">
        <h1>
          Kada Hotel
          <span>Luxury Stay</span>
        </h1>
        <div className="hotel-info">⭐ 4.8 • 1,234 reviews</div>
      </div>

      {/* MODERN FILTER TAB */}
      <div className="filter-tabs">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-tab ${filterCategory === cat ? 'active' : ''}`}
            onClick={() => setFilterCategory(cat)}
          >
            {cat === 'all' ? 'Semua' : cat}
          </button>
        ))}
      </div>

      {filteredRooms.length === 0 ? (
        <div className="no-rooms">Tidak ada kamar dengan kategori tersebut.</div>
      ) : (
        <div className="room-grid">
          {filteredRooms.map((room, index) => {
            const isAvailable = room.status === 'available';
            const badgeClass = isAvailable ? 'status-available' : 'status-occupied';

            return (
              <div
                key={room.id}
                className="room-card fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className="room-image"
                  style={{ backgroundImage: `url(${getRoomImage(room.category)})` }}
                >
                  <span className="category-badge">{room.category}</span>
                </div>

                <div className="room-content">
                  <div className="room-header">
                    <h3>Kamar {room.roomNumber}</h3>
                    <span className={`status-badge ${badgeClass}`}>
                      {isAvailable ? 'Tersedia' : 'Terisi'}
                    </span>
                  </div>

                  <div className="room-detail">
                    <div>💰 Rp {room.pricePerNight?.toLocaleString('id-ID')}/malam</div>
                    <div>🛏️ {room.specs?.bedType}</div>
                    <div>📏 {room.specs?.size}</div>
                  </div>

                  <div className="facilities">
                    {room.specs?.facilities?.slice(0, 4).map((fac, index) => (
                      <span key={index} className="facility-tag">
                        {fac}
                      </span>
                    ))}
                  </div>

                  <div className="button-wrapper">
                    {room.currentBookingId ? (
                      <button
                        onClick={() => navigate(`/checkout/${room.currentBookingId}`)}
                        className="action-button checkout-button"
                      >
                        Check-out
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/checkin/${room.id}`)}
                        className="action-button checkin-button"
                      >
                        Check-in
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RoomList;
