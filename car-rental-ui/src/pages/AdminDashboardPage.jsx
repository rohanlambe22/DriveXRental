import React, { useState, useEffect } from 'react';
import { carService } from '../services/carService';
import { bookingService } from '../services/bookingService';
import { StatusBadge } from '../components/StatusBadge';
import { PlusCircle, Car, Calendar, Shield, Trash2, CheckCircle2, ToggleLeft, ToggleRight, X } from 'lucide-react';

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('fleet'); // 'fleet' or 'bookings'
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Car Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCar, setNewCar] = useState({
    make: '',
    model: '',
    year: 2024,
    category: 'Sedan',
    dailyRate: 75,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    seats: 5,
    imageUrl: '',
    description: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [carsData, bookingsData] = await Promise.all([
        carService.getCars(),
        bookingService.getAllBookings(),
      ]);
      setCars(carsData);
      setBookings(bookingsData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleAvailability = async (id) => {
    try {
      await carService.toggleAvailability(id);
      fetchData();
    } catch (err) {
      alert('Failed to toggle car availability.');
    }
  };

  const handleDeleteCar = async (id) => {
    if (!window.confirm('Are you sure you want to remove this vehicle from the fleet?')) return;
    try {
      await carService.deleteCar(id);
      fetchData();
    } catch (err) {
      alert('Failed to delete car.');
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await bookingService.updateBookingStatus(id, status);
      fetchData();
    } catch (err) {
      alert('Failed to update booking status.');
    }
  };

  const handleAddCarSubmit = async (e) => {
    e.preventDefault();
    try {
      await carService.createCar(newCar);
      setShowAddModal(false);
      setNewCar({
        make: '',
        model: '',
        year: 2024,
        category: 'Sedan',
        dailyRate: 75,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        seats: 5,
        imageUrl: '',
        description: '',
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add car.');
    }
  };

  return (
    <div className="container page-container">
      <div className="admin-header">
        <div>
          <h2><Shield className="admin-icon" /> Admin Fleet & Reservation Portal</h2>
          <p>Full control over fleet inventory, daily rates, and customer reservations</p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <PlusCircle size={18} /> Add New Vehicle
        </button>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'fleet' ? 'active' : ''}`}
          onClick={() => setActiveTab('fleet')}
        >
          <Car size={18} /> Fleet Inventory ({cars.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          <Calendar size={18} /> All Customer Bookings ({bookings.length})
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading admin telemetry...</div>
      ) : activeTab === 'fleet' ? (
        /* Fleet Table */
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Category</th>
                <th>Daily Rate</th>
                <th>Specs</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id}>
                  <td>
                    <div className="table-car-cell">
                      <img src={car.imageUrl} alt={car.model} className="table-thumb" />
                      <div>
                        <strong>{car.make} {car.model}</strong>
                        <div className="text-muted">{car.year}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="car-category-pill">{car.category}</span></td>
                  <td><strong className="price-highlight">${car.dailyRate}</strong> / day</td>
                  <td>{car.seats} Seats • {car.fuelType}</td>
                  <td>
                    <button
                      onClick={() => handleToggleAvailability(car.id)}
                      className={`btn-toggle ${car.isAvailable ? 'available' : 'unavailable'}`}
                    >
                      {car.isAvailable ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      <span>{car.isAvailable ? 'Available' : 'Booked'}</span>
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleDeleteCar(car.id)} className="btn-icon-danger" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* All Bookings Table */
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Renter</th>
                <th>Vehicle</th>
                <th>Dates</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Manage Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td>
                    <strong>{b.customerName}</strong>
                    <div className="text-muted">{b.customerEmail}</div>
                  </td>
                  <td>{b.carMake} {b.carModel}</td>
                  <td>
                    {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
                    <div className="text-muted">({b.totalDays} days)</div>
                  </td>
                  <td><strong>${b.totalPrice.toFixed(2)}</strong></td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>
                    <select
                      value={b.status}
                      onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                      className="form-select-sm"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add New Car Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>Add New Vehicle to Fleet</h2>
              <button onClick={() => setShowAddModal(false)} className="btn-close">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCarSubmit} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Make</label>
                  <input
                    type="text"
                    value={newCar.make}
                    onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
                    placeholder="e.g. Mercedes-Benz"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Model</label>
                  <input
                    type="text"
                    value={newCar.model}
                    onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                    placeholder="e.g. C-Class"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <input
                    type="number"
                    value={newCar.year}
                    onChange={(e) => setNewCar({ ...newCar, year: Number(e.target.value) })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={newCar.category}
                    onChange={(e) => setNewCar({ ...newCar, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Electric">Electric</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Daily Rate ($)</label>
                  <input
                    type="number"
                    value={newCar.dailyRate}
                    onChange={(e) => setNewCar({ ...newCar, dailyRate: Number(e.target.value) })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Fuel Type</label>
                  <select
                    value={newCar.fuelType}
                    onChange={(e) => setNewCar({ ...newCar, fuelType: e.target.value })}
                    className="form-select"
                  >
                    <option value="Gasoline">Gasoline</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  value={newCar.imageUrl}
                  onChange={(e) => setNewCar({ ...newCar, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={newCar.description}
                  onChange={(e) => setNewCar({ ...newCar, description: e.target.value })}
                  placeholder="Vehicle highlights and features..."
                  className="form-textarea"
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Vehicle to Fleet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
