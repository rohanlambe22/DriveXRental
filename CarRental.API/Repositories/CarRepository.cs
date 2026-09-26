using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CarRental.API.Data;
using CarRental.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CarRental.API.Repositories
{
    public class CarRepository : GenericRepository<Car>, ICarRepository
    {
        public CarRepository(CarRentalDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Car>> GetFilteredCarsAsync(string? category, string? search, decimal? minPrice, decimal? maxPrice, bool? isAvailableOnly)
        {
            var query = _dbSet.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(category) && !category.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(c => c.Category.ToLower() == category.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchLower = search.Trim().ToLower();
                query = query.Where(c => c.Make.ToLower().Contains(searchLower) ||
                                         c.Model.ToLower().Contains(searchLower) ||
                                         c.Category.ToLower().Contains(searchLower) ||
                                         c.FuelType.ToLower().Contains(searchLower));
            }

            if (minPrice.HasValue)
            {
                query = query.Where(c => c.DailyRate >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(c => c.DailyRate <= maxPrice.Value);
            }

            if (isAvailableOnly.HasValue && isAvailableOnly.Value)
            {
                query = query.Where(c => c.IsAvailable);
            }

            var cars = await query.ToListAsync();
            return cars.OrderBy(c => c.DailyRate);
        }

        public async Task<bool> IsCarAvailableForDatesAsync(int carId, DateTime start, DateTime end, int? excludeBookingId = null)
        {
            var car = await _dbSet.FindAsync(carId);
            if (car == null || !car.IsAvailable) return false;

            // Check for overlapping bookings
            var overlappingQuery = _context.Bookings.Where(b => b.CarId == carId &&
                                                                b.Status != "Cancelled" &&
                                                                b.StartDate < end &&
                                                                b.EndDate > start);

            if (excludeBookingId.HasValue)
            {
                overlappingQuery = overlappingQuery.Where(b => b.Id != excludeBookingId.Value);
            }

            var hasOverlap = await overlappingQuery.AnyAsync();
            return !hasOverlap;
        }
    }
}
