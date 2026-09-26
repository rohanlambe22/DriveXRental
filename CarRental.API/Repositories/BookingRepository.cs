using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CarRental.API.Data;
using CarRental.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CarRental.API.Repositories
{
    public class BookingRepository : GenericRepository<Booking>, IBookingRepository
    {
        public BookingRepository(CarRentalDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Booking>> GetBookingsByUserIdAsync(int userId)
        {
            return await _dbSet.AsNoTracking()
                               .Include(b => b.Car)
                               .Include(b => b.User)
                               .Where(b => b.UserId == userId)
                               .OrderByDescending(b => b.CreatedAt)
                               .ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetAllBookingsWithDetailsAsync()
        {
            return await _dbSet.AsNoTracking()
                               .Include(b => b.Car)
                               .Include(b => b.User)
                               .OrderByDescending(b => b.CreatedAt)
                               .ToListAsync();
        }

        public async Task<Booking?> GetBookingWithDetailsAsync(int id)
        {
            return await _dbSet.Include(b => b.Car)
                               .Include(b => b.User)
                               .FirstOrDefaultAsync(b => b.Id == id);
        }
    }
}
