import React from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Users, Zap, CheckCircle, XCircle } from 'lucide-react';

export const CarCard = ({ car, onSelectBooking }) => {
  return (
    <div className="car-card">
      <div className="car-image-container">
        <img
          src={car.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80'}
          alt={`${car.make} ${car.model}`}
          className="car-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80';
          }}
        />
        <span className="car-category-pill">{car.category}</span>
        <span className={`availability-badge ${car.isAvailable ? 'available' : 'unavailable'}`}>
          {car.isAvailable ? (
            <>
              <CheckCircle size={14} /> Available
            </>
          ) : (
            <>
              <XCircle size={14} /> Booked
            </>
          )}
        </span>
      </div>

      <div className="car-card-body">
        <div className="car-header">
          <h3 className="car-title">{car.make} {car.model}</h3>
          <span className="car-year">{car.year}</span>
        </div>

        <p className="car-description">{car.description}</p>

        <div className="car-specs-grid">
          <div className="spec-item">
            <Users size={16} className="spec-icon" />
            <span>{car.seats} Seats</span>
          </div>
          <div className="spec-item">
            <Fuel size={16} className="spec-icon" />
            <span>{car.fuelType}</span>
          </div>
          <div className="spec-item">
            <Zap size={16} className="spec-icon" />
            <span>{car.transmission}</span>
          </div>
        </div>

        <div className="car-footer">
          <div className="car-price">
            <span className="price-amount">${car.dailyRate}</span>
            <span className="price-unit">/ day</span>
          </div>

          <div className="car-actions">
            <Link to={`/cars/${car.id}`} className="btn-secondary">
              Details
            </Link>
            <button
              onClick={() => onSelectBooking(car)}
              disabled={!car.isAvailable}
              className={`btn-primary ${!car.isAvailable ? 'disabled' : ''}`}
            >
              {car.isAvailable ? 'Rent Now' : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
