import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRooms } from '../store/slice/roomSlice';

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

  const filteredRooms = rooms.filter((room) => {
    return filterCategory === 'all' || room.category === filterCategory;
  });

  const categories = ['all', ...new Set(rooms.map(room => room.category))];

  if (loading && rooms.length === 0) return <div>Loading data kamar...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🏨 Daftar Kamar</h1>

      {/* Filter kategori */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="categoryFilter" style={{ marginRight: '10px' }}>Filter Kategori:</label>
        <select 
          id="categoryFilter"
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ padding: '5px', borderRadius: '4px' }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'Semua Kategori' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Grid kamar */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        {filteredRooms.map(room => {
          // Tentukan warna badge berdasarkan status (opsional, hanya visual)
          const isAvailable = room.status === 'available';
          const badgeStyle = {
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.8em',
            fontWeight: 'bold',
            backgroundColor: isAvailable ? '#d4edda' : '#f8d7da',
            color: isAvailable ? '#155724' : '#721c24'
          };

          return (
            <div key={room.id} style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '16px', 
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              backgroundColor: '#fff'
            }}>
              {/* Header dengan status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0 }}>Kamar {room.roomNumber}</h3>
                <span style={badgeStyle}>
                  {isAvailable ? 'Tersedia' : 'Terisi'}
                </span>
              </div>

              {/* Detail kamar */}
              <p><strong>Kategori:</strong> {room.category}</p>
              <p><strong>Harga:</strong> Rp {room.pricePerNight?.toLocaleString('id-ID')} / malam</p>
              <p><strong>Fasilitas:</strong> {room.specs?.facilities?.slice(0, 4).join(' · ')}</p>
              <p><strong>Tempat tidur:</strong> {room.specs?.bedType}</p>
              <p><strong>Ukuran:</strong> {room.specs?.size}</p>

              {/* Tombol berdasarkan keberadaan bookingId */}
              {room.currentBookingId ? (
                <button
                  onClick={() => navigate(`/checkout/${room.currentBookingId}`)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#ffc107',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '10px',
                    fontWeight: 'bold'
                  }}
                >
                  Check-out
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/checkin/${room.id}`)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '10px',
                    fontWeight: 'bold'
                  }}
                >
                  Check-in
                </button>
              )}
            </div>
          );
        })}
      </div>

      {filteredRooms.length === 0 && !loading && (
        <p style={{ textAlign: 'center', marginTop: '30px' }}>Tidak ada kamar dengan kategori tersebut.</p>
      )}
    </div>
  );
};

export default RoomList;