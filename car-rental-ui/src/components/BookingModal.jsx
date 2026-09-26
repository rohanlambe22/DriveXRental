import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import { X, Calendar, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

export const BookingModal = ({ car, onClose, onSuccess }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Get tomorrow's date string (YYYY-MM-DD)
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const getDayAfterTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(getTomorrowStr());
  const [endDate, setEndDate] = useState(getDayAfterTomorrowStr());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Calculate rental duration in days
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const totalDays = calculateDays();
  const totalPrice = totalDays * (car?.dailyRate || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (totalDays <= 0) {
      setError('Return date must be after pick-up date.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await bookingService.createBooking({
        carId: car.id,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });

      setSuccessMsg('Reservation confirmed successfully! Redirecting to My Bookings...');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
        navigate('/my-bookings');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!car) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2>Reserve {car.make} {car.model}</h2>
          <button onClick={onClose} className="btn-close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success">
              <CheckCircle size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="modal-car-summary">
            <img src={car.imageUrl} alt={car.model} className="modal-car-thumb" />
            <div>
              <h4>{car.make} {car.model} ({car.year})</h4>
              <p className="modal-car-rate">${car.dailyRate} / day • {car.category}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Calendar size={16} /> Pick-up Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Calendar size={16} /> Return Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="price-breakdown">
              <div className="breakdown-row">
                <span>Daily Rate:</span>
                <span>${car.dailyRate}</span>
              </div>
              <div className="breakdown-row">
                <span>Duration:</span>
                <span>{totalDays} {totalDays === 1 ? 'day' : 'days'}</span>
              </div>
              <div className="breakdown-total">
                <span>Total Cost:</span>
                <span className="total-amount">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || totalDays <= 0 || !!successMsg}
                className="btn-primary"
              >
                {submitting ? 'Confirming...' : 'Confirm Reservation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
