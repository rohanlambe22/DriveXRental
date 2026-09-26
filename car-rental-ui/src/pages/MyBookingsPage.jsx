import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { StatusBadge } from '../components/StatusBadge';
import { Calendar, DollarSign, Car, AlertCircle, Trash2 } from 'lucide-react';

export const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to fetch your reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    try {
      setCancellingId(id);
      await bookingService.cancelBooking(id);
      await fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel reservation.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="container page-container">
      <div className="page-header">
        <h2>My Reservations</h2>
        <p>Track your active rental bookings and order history</p>
      </div>

      {loading ? (
        <div className="loading-state">Loading your reservations...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <Car size={48} className="empty-icon" />
          <h3>No Reservations Found</h3>
          <p>You haven't rented any vehicles yet. Explore our fleet to get started!</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((b) => (
            <div key={b.id} className="booking-card">
              <div className="booking-card-media">
                <img
                  src={b.carImageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80'}
                  alt={`${b.carMake} ${b.carModel}`}
                  className="booking-car-img"
                />
              </div>

              <div className="booking-card-content">
                <div className="booking-title-row">
                  <h3>{b.carMake} {b.carModel}</h3>
                  <StatusBadge status={b.status} />
                </div>

                <div className="booking-meta-grid">
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>Pick-up: <strong>{new Date(b.startDate).toLocaleDateString()}</strong></span>
                  </div>
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>Return: <strong>{new Date(b.endDate).toLocaleDateString()}</strong></span>
                  </div>
                  <div className="meta-item">
                    <Car size={16} />
                    <span>Duration: <strong>{b.totalDays} {b.totalDays === 1 ? 'day' : 'days'}</strong></span>
                  </div>
                  <div className="meta-item">
                    <DollarSign size={16} />
                    <span>Total Cost: <strong className="price-highlight">${b.totalPrice.toFixed(2)}</strong></span>
                  </div>
                </div>
              </div>

              <div className="booking-card-actions">
                {b.status?.toLowerCase() !== 'cancelled' && (
                  <button
                    onClick={() => handleCancelBooking(b.id)}
                    disabled={cancellingId === b.id}
                    className="btn-danger-outline"
                  >
                    <Trash2 size={16} />
                    <span>{cancellingId === b.id ? 'Cancelling...' : 'Cancel Reservation'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
