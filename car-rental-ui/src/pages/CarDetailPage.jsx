import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { carService } from '../services/carService';
import { BookingModal } from '../components/BookingModal';
import { ArrowLeft, Users, Fuel, Zap, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';

export const CarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const data = await carService.getCarById(id);
        setCar(data);
      } catch (err) {
        setError('Car details not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  if (loading) return <div className="loading-state">Loading vehicle specifications...</div>;
  if (error || !car) return <div className="error-state">{error || 'Car not found'}</div>;

  return (
    <div className="container page-container">
      <Link to="/" className="btn-back">
        <ArrowLeft size={18} /> Back to Fleet Catalog
      </Link>

      <div className="car-detail-wrapper">
        {/* Left Side: Car Image & Features */}
        <div className="detail-media">
          <img src={car.imageUrl} alt={`${car.make} ${car.model}`} className="detail-image" />
          <div className="feature-highlights">
            <div className="highlight-item">
              <ShieldCheck size={20} className="highlight-icon" />
              <div>
                <h5>Comprehensive Insurance</h5>
                <p>Fully covered against collision & theft</p>
              </div>
            </div>
            <div className="highlight-item">
              <CheckCircle2 size={20} className="highlight-icon" />
              <div>
                <h5>Free Cancellation</h5>
                <p>Up to 24 hours prior to pick-up</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Car Specs & Pricing */}
        <div className="detail-info">
          <div className="detail-header">
            <span className="car-category-pill">{car.category}</span>
            <h2>{car.make} {car.model} ({car.year})</h2>
            <p className="detail-description">{car.description}</p>
          </div>

          <div className="detail-specs">
            <h4>Vehicle Specifications</h4>
            <div className="specs-list">
              <div className="spec-row">
                <Users size={18} /> <span>Seating Capacity:</span> <strong>{car.seats} Passengers</strong>
              </div>
              <div className="spec-row">
                <Fuel size={18} /> <span>Fuel / Power:</span> <strong>{car.fuelType}</strong>
              </div>
              <div className="spec-row">
                <Zap size={18} /> <span>Transmission:</span> <strong>{car.transmission}</strong>
              </div>
              <div className="spec-row">
                <CheckCircle2 size={18} /> <span>Availability:</span>{' '}
                <strong className={car.isAvailable ? 'text-green' : 'text-red'}>
                  {car.isAvailable ? 'Available for Rent' : 'Currently Booked'}
                </strong>
              </div>
            </div>
          </div>

          <div className="detail-pricing-box">
            <div className="price-tag">
              <span className="price-amount">${car.dailyRate}</span>
              <span className="price-label">/ day</span>
            </div>
            <button
              onClick={() => setShowBookingModal(true)}
              disabled={!car.isAvailable}
              className={`btn-primary btn-large ${!car.isAvailable ? 'disabled' : ''}`}
            >
              {car.isAvailable ? 'Reserve This Vehicle' : 'Currently Unavailable'}
            </button>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          car={car}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => navigate('/my-bookings')}
        />
      )}
    </div>
  );
};
