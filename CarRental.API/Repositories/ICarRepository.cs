using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CarRental.API.Models;

namespace CarRental.API.Repositories
{
    public interface ICarRepository : IGenericRepository<Car>
    {
        Task<IEnumerable<Car>> GetFilteredCarsAsync(string? category, string? search, decimal? minPrice, decimal? maxPrice, bool? isAvailableOnly);
        Task<bool> IsCarAvailableForDatesAsync(int carId, DateTime start, DateTime end, int? excludeBookingId = null);
    }
}
