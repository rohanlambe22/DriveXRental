using System.Collections.Generic;
using System.Threading.Tasks;
using CarRental.API.DTOs;

namespace CarRental.API.Services
{
    public interface IBookingService
    {
        Task<IEnumerable<BookingDto>> GetUserBookingsAsync(int userId);
        Task<IEnumerable<BookingDto>> GetAllBookingsAsync();
        Task<BookingDto?> GetBookingByIdAsync(int id);
        Task<BookingDto> CreateBookingAsync(int userId, CreateBookingDto dto);
        Task<BookingDto?> UpdateBookingStatusAsync(int id, UpdateBookingStatusDto dto);
        Task<bool> CancelBookingAsync(int id, int userId, bool isAdmin);
    }
}
