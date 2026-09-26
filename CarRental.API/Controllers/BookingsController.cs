using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using CarRental.API.DTOs;
using CarRental.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CarRental.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        /// <summary>
        /// Get reservations for the currently authenticated user.
        /// </summary>
        [HttpGet("my-bookings")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BookingDto>))]
        public async Task<IActionResult> GetMyBookings()
        {
            var userId = GetCurrentUserId();
            var bookings = await _bookingService.GetUserBookingsAsync(userId);
            return Ok(bookings);
        }

        /// <summary>
        /// Get all customer reservations across the system (Admin only).
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BookingDto>))]
        public async Task<IActionResult> GetAllBookings()
        {
            var bookings = await _bookingService.GetAllBookingsAsync();
            return Ok(bookings);
        }

        /// <summary>
        /// Create a new car reservation for the authenticated user.
        /// </summary>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(BookingDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var userId = GetCurrentUserId();
            var created = await _bookingService.CreateBookingAsync(userId, dto);
            return CreatedAtAction(nameof(GetMyBookings), null, created);
        }

        /// <summary>
        /// Update a booking status (e.g., Completed, Confirmed) (Admin only).
        /// </summary>
        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BookingDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] UpdateBookingStatusDto dto)
        {
            var updated = await _bookingService.UpdateBookingStatusAsync(id, dto);
            if (updated == null) return NotFound(new { message = $"Booking with ID {id} not found." });
            return Ok(updated);
        }

        /// <summary>
        /// Cancel a reservation (Allowed for booking owner or Admin).
        /// </summary>
        [HttpDelete("{id}/cancel")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CancelBooking(int id)
        {
            var userId = GetCurrentUserId();
            var isAdmin = User.IsInRole("Admin");
            var success = await _bookingService.CancelBookingAsync(id, userId, isAdmin);
            if (!success) return NotFound(new { message = $"Booking with ID {id} not found." });
            return Ok(new { message = "Booking cancelled successfully." });
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdClaim, out int userId))
            {
                return userId;
            }
            throw new UnauthorizedAccessException("User identity claim not found or invalid.");
        }
    }
}
