import React, { useState, useEffect, useMemo } from 'react';
import { carService } from '../services/carService';
import { CarCard } from '../components/CarCard';
import { CarFilter } from '../components/CarFilter';
import { BookingModal } from '../components/BookingModal';
import { Car, ShieldCheck, Sparkles, Award } from 'lucide-react';

export const HomePage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(250);
  const [isAvailableOnly, setIsAvailableOnly] = useState(false);

  // Booking Modal State
  const [selectedCar, setSelectedCar] = useState(null);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await carService.getCars();
      setCars(data);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Failed to connect to Car Rental API. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = cars.map((c) => c.category);
    return Array.from(new Set(cats));
  }, [cars]);

  // Client-side Filter Logic (Demonstrating useMemo optimization)
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesSearch =
        search === '' ||
        car.make.toLowerCase().includes(search.toLowerCase()) ||
        car.model.toLowerCase().includes(search.toLowerCase()) ||
        car.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = category === 'All' || car.category.toLowerCase() === category.toLowerCase();
      const matchesPrice = car.dailyRate <= maxPrice;
      const matchesAvailability = !isAvailableOnly || car.isAvailable;

      return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
    });
  }, [cars, search, category, maxPrice, isAvailableOnly]);

  return (
    <div className="home-page">
      {/* Hero Header Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} /> Premium Fleet & Seamless Booking
          </div>
          <h1 className="hero-title">
            Rent Your Dream Vehicle <br />
            <span className="hero-highlight">For Any Journey</span>
          </h1>
          <p className="hero-subtitle">
            Explore our curated selection of electric, luxury, and sport vehicles. Clean, reliable, and instant online reservations.
          </p>

          <div className="hero-features">
            <div className="feature-pill">
              <ShieldCheck size={18} /> Full Insurance Included
            </div>
            <div className="feature-pill">
              <Award size={18} /> Best Rate Guarantee
            </div>
            <div className="feature-pill">
              <Car size={18} /> Instant Confirmation
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog & Filter Section */}
      <section className="catalog-section">
        <div className="container">
          <div className="section-header">
            <h2>Explore Our Fleet</h2>
            <p>Showing {filteredCars.length} available vehicles</p>
          </div>

          <CarFilter
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            categories={categories}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            isAvailableOnly={isAvailableOnly}
            setIsAvailableOnly={setIsAvailableOnly}
          />

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Fetching vehicle catalog from API...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={fetchCars} className="btn-primary">
                Retry Connection
              </button>
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="empty-state">
              <p>No vehicles match your current search criteria.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setCategory('All');
                  setMaxPrice(250);
                  setIsAvailableOnly(false);
                }}
                className="btn-secondary"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="cars-grid">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} onSelectBooking={(c) => setSelectedCar(c)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      {selectedCar && (
        <BookingModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
          onSuccess={fetchCars}
        />
      )}
    </div>
  );
};
