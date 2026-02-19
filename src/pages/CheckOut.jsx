import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCheckOutData, processCheckOut, resetCheckOutState } from '../store/slice/checkOutSlice'
import '../styles/CheckOut.css'



const CheckOut = () => {
    const { bookingId } = useParams() // Fetch booking details using bookingId
    const navigate = useNavigate() // Navigate to other pages
    const dispatch = useDispatch() // Dispatch actions

    const { bookingData, roomData, equipmentData, isLoading, error, success } = useSelector(state => state.checkOut)

    const [demagedItems, setDemagedItems] = useState([])


    useEffect(() => {
        dispatch(fetchCheckOutData(bookingId))

        return () => {
            dispatch(resetCheckOutState())
        }
    }, [dispatch, bookingId]) 

   const handleCheckBoxChange = (equipmentId) => {
    setDemagedItems(prevDemagedItems => {
        if (prevDemagedItems.includes(equipmentId)) {
            return prevDemagedItems.filter(id => id !== equipmentId)
        } else {
            return [...prevDemagedItems, equipmentId]
        }
    })
   }

   const calculateStayDuration = (checkInDateString) => {
    if (!checkInDateString) return 0;
    
    const checkInDate = new Date(checkInDateString);
    const currentDate = new Date();
    checkInDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(currentDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 1 : diffDays;
  };

  const actualDays = bookingData ? calculateStayDuration(bookingData.checkInDate) : 0;

   const basePrice = (actualDays || 0) * (roomData?.pricePerNight || 0)

   const penaltyFee = demagedItems.reduce((total, equipmentId) => {
    const equipment = equipmentData.find(item => item.id === equipmentId)
    return total + (equipment?.penaltyPrice || 0)
   }, 0)

   const totalAmount = basePrice + penaltyFee

    const handleCheckOutProcess = async () => {
        // Confirm before processing check-out
        const isConfirmed = window.confirm("Apakah Anda yakin ingin menyelesaikan check-out ini?");
        if (!isConfirmed) return;

        try {
            // Delete booking
        await fetch(`https://69953a6ab081bc23e9c25d37.mockapi.io/api/activeBookings/${bookingId}`, {
            method: 'DELETE',
        });
        // Update room status
        await fetch(`https://69953a6ab081bc23e9c25d37.mockapi.io/api/rooms/${bookingData.roomId}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            status: "available",
            currentBookingId: null
            }),
        });
        
        // Show success message
        alert(`Check-out berhasil! Total pembayaran: Rp ${totalAmount.toLocaleString('id-ID')}`);
        navigate('/rooms');

        } catch (err) {
            // Show error message
        console.error("Gagal memproses check-out:", err);
        alert("Terjadi kesalahan jaringan saat memproses check-out.");
        }
    };

   const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; 
  };

   if (isLoading) return <div>Loading...</div>
   if (error) return <div>Error: {error.message}</div>
   if (!bookingData || !roomData) return <div>Booking not found</div>


  return (
    <div className="checkout-page">
        <div className="checkout-container">
            {/* Header */}
            <div className="header-section">
                {/* <button className="back-button" onClick={() => navigate('/rooms')}>
                    <i className=""></i> Back to Room List
                </button> */}
                <h1 className="page-title">Check-Out Process - Room {roomData.roomNumber}</h1>
                <p className="page-subtitle">Review charges and complete check-out process</p>
            </div>

            {/* Layout */}
            <div className="layout-grid">
                {/* Left Column */}
                <div className="left-column">
                    {/* Booking Details */}
                    <div className="card">
                        <div className="card-title">Booking Details</div>
                        <div className="guest-grid">
                            <div>
                                <label className="guest-label">Guest Name</label>
                                <p className="guest-value">{bookingData.customer.fullName}</p>
                            </div>
                            <div>
                                <label className="guest-label">Room Number</label>
                                <p className="guest-value">{roomData.roomNumber}</p>
                            </div>
                            <div>
                                <label className="guest-label">Check-in Date</label>
                                <p className="guest-value">{formatDate(bookingData.checkInDate)}</p>
                            </div>
                            <div>
                                <label className="guest-label">Stay Duration</label>
                                <p className="guest-value">{actualDays} {actualDays === 1 ? 'Night' : 'Nights'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Damages Checklist */}
                    <div className="card">
                        <h3 className="card-title card-title-red">Additional Charges / Damages</h3>
                        <p className="card-subtitle">Check any items that apply for extra charges</p>
                        <div className="damages-list">
                            {Array.isArray(equipmentData) && equipmentData.map(equipment => (
                                <label key={equipment.id} className={`damage-item ${demagedItems.includes(equipment.id) ? 'checked' : ''}`}>
                                    <div className="damage-item-left">
                                        <input type="checkbox" className="damage-checkbox" value={equipment.id} checked={demagedItems.includes(equipment.id)} onChange={() => handleCheckBoxChange(equipment.id)} />
                                        <span className="damage-name">{equipment.itemName}</span>
                                    </div>
                                    <span className="damage-price">Rp. {equipment.penaltyPrice.toLocaleString('id-ID')}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="right-column">
                    {/* Payment Details */}
                    <div className="card sticky-card">
                        <div className="card-title" style={{ marginBottom: '24px' }}>Payment Details</div>
                        <div className="payment-details">
                            <div className="payment-row">
                                <span>Room Rate (x{actualDays})</span>
                                <span className="payment-row-value">Rp. {basePrice.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="payment-row payment-row-red">
                                <span>Penalty Fee</span>
                                <span className="payment-row-value">Rp. {penaltyFee.toLocaleString('id-ID')}</span>
                            </div>
                            
                            <hr className="payment-divider"></hr>

                            <div className="total-section">
                                <div className="total-label">Total <br />Due</div>
                                <div className="total-right">
                                    <div className="total-amount">Rp. {totalAmount.toLocaleString('id-ID')}</div>
                                    <div className="total-includes">Includes all taxes</div>
                                </div>
                            </div>
                            <div className="action-buttons">
                                <button className="btn-process" onClick={handleCheckOutProcess}>
                                    <i className=""></i> Process Check-Out
                                </button>
                                <button className="btn-cancel" onClick={() => navigate('/rooms')}>
                                    <i className=""></i> Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>


    // <div className="checkout-container" style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
    //     <h2>Check-Out Process - Room {room.roomNumber}</h2>
        
    //     <div claseName="card" style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>
    //         <h3>Booking Details</h3>
    //         <p>Guest Name: {booking.guestName}</p>
    //         <p>Check-in Date: {booking.checkInDate}</p>
    //         <p>Check-out Date: {booking.checkOutDate}</p>
    //         <p>Base Price: Rp. {basePrice.toLocaleString('id-ID')}</p>
    //     </div>

    //     <div className="card" style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
    //     <h3>Equipment Condition Checklist</h3>
    //     <p style={{ fontSize: '14px', color: '#666' }}>*Checklist if the equipment is lost or damaged</p>
        
    //     <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
    //       {Array.isArray(equipmentList) && equipmentList.map(equipment => (
    //         <label key={equipment.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    //           <input 
    //             type="checkbox" 
    //             value={equipment.id}
    //             checked={demagedItems.includes(equipment.id)}
    //             onChange={() => handleCheckBoxChange(equipment.id)}
    //           />
    //           <span>{equipment.itemName}</span>
    //           <span style={{ color: 'red', marginLeft: 'auto' }}>
    //             (+ Rp {equipment.penaltyPrice.toLocaleString('id-ID')})
    //           </span>
    //         </label>
    //       ))}
    //     </div>
    //   </div>

    //     <div className="card" style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>
    //         <h3>Summary</h3>
    //         <p>Base Price: Rp. {basePrice.toLocaleString('id-ID')}</p>
    //         <p>Penalty Fee: Rp. {penaltyFee.toLocaleString('id-ID')}</p>
    //         <p>Total Amount: Rp. {totalAmount.toLocaleString('id-ID')}</p>
    //     </div>

    //     <button onClick={handleCheckOutProcess} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Check-Out</button> 
        

    // </div>
  )
}

export default CheckOut;