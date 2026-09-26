using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CarRental.API.DTOs;
using CarRental.API.Models;
using CarRental.API.Repositories;

namespace CarRental.API.Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly ICarRepository _carRepository;

        public BookingService(IBookingRepository bookingRepository, ICarRepository carRepository)
        {
            _bookingRepository = bookingRepository;
            _carRepository = carRepository;
        }

        public async Task<IEnumerable<BookingDto>> GetUserBookingsAsync(int userId)
        {
            var bookings = await _bookingRepository.GetBookingsByUserIdAsync(userId);
            return bookings.Select(MapToDto);
        }

        public async Task<IEnumerable<BookingDto>> GetAllBookingsAsync()
        {
            var bookings = await _bookingRepository.GetAllBookingsWithDetailsAsync();
            return bookings.Select(MapToDto);
        }

        public async Task<BookingDto?> GetBookingByIdAsync(int id)
        {
            var booking = await _bookingRepository.GetBookingWithDetailsAsync(id);
            return booking == null ? null : MapToDto(booking);
        }

        public async Task<BookingDto> CreateBookingAsync(int userId, CreateBookingDto dto)
        {
            if (dto.EndDate <= dto.StartDate)
            {
                throw new InvalidOperationException("End date must be after start date.");
            }

            if (dto.StartDate.Date < DateTime.UtcNow.Date)
            {
                throw new InvalidOperationException("Start date cannot be in the past.");
            }

            var car = await _carRepository.GetByIdAsync(dto.CarId);
            if (car == null || !car.IsAvailable)
            {
                throw new InvalidOperationException("Car is not available for rental.");
            }

            // Check date conflict with existing active bookings
            var isAvailable = await _carRepository.IsCarAvailableForDatesAsync(dto.CarId, dto.StartDate, dto.EndDate);
            if (!isAvailable)
            {
                throw new InvalidOperationException("Car is already booked for the selected date range.");
            }

            var totalDays = Math.Max(1, (int)(dto.EndDate.Date - dto.StartDate.Date).TotalDays);
            var totalPrice = totalDays * car.DailyRate;

            var booking = new Booking
            {
                UserId = userId,
                CarId = dto.CarId,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                TotalPrice = totalPrice,
                Status = "Confirmed",
                CreatedAt = DateTime.UtcNow
            };

            await _bookingRepository.AddAsync(booking);
            await _bookingRepository.SaveChangesAsync();

            // Fetch populated details
            var createdBooking = await _bookingRepository.GetBookingWithDetailsAsync(booking.Id);
            return MapToDto(createdBooking!);
        }

        public async Task<BookingDto?> UpdateBookingStatusAsync(int id, UpdateBookingStatusDto dto)
        {
            var booking = await _bookingRepository.GetBookingWithDetailsAsync(id);
            if (booking == null) return null;

            booking.Status = dto.Status;
            _bookingRepository.Update(booking);
            await _bookingRepository.SaveChangesAsync();

            return MapToDto(booking);
        }

        public async Task<bool> CancelBookingAsync(int id, int userId, bool isAdmin)
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking == null) return false;

            // Only booking owner or Admin can cancel
            if (!isAdmin && booking.UserId != userId)
            {
                throw new UnauthorizedAccessException("You are not authorized to cancel this reservation.");
            }

            booking.Status = "Cancelled";
            _bookingRepository.Update(booking);
            await _bookingRepository.SaveChangesAsync();
            return true;
        }

        private static BookingDto MapToDto(Booking b)
        {
            var days = Math.Max(1, (int)(b.EndDate.Date - b.StartDate.Date).TotalDays);
            return new BookingDto
            {
                Id = b.Id,
                UserId = b.UserId,
                CustomerName = b.User?.FullName ?? "Unknown Renter",
                CustomerEmail = b.User?.Email ?? string.Empty,
                CarId = b.CarId,
                CarMake = b.Car?.Make ?? string.Empty,
                CarModel = b.Car?.Model ?? string.Empty,
                CarImageUrl = b.Car?.ImageUrl ?? string.Empty,
                DailyRate = b.Car?.DailyRate ?? 0,
                StartDate = b.StartDate,
                EndDate = b.EndDate,
                TotalDays = days,
                TotalPrice = b.TotalPrice,
                Status = b.Status,
                CreatedAt = b.CreatedAt
            };
        }
    }
}
