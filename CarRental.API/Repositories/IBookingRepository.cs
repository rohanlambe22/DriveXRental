using System.Collections.Generic;
using System.Threading.Tasks;
using CarRental.API.Models;

namespace CarRental.API.Repositories
{
    public interface IBookingRepository : IGenericRepository<Booking>
    {
        Task<IEnumerable<Booking>> GetBookingsByUserIdAsync(int userId);
        Task<IEnumerable<Booking>> GetAllBookingsWithDetailsAsync();
        Task<Booking?> GetBookingWithDetailsAsync(int id);
    }
}
