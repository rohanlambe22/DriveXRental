using System.Collections.Generic;
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
    public class CarsController : ControllerBase
    {
        private readonly ICarService _carService;

        public CarsController(ICarService carService)
        {
            _carService = carService;
        }

        /// <summary>
        /// Get list of cars with optional category, price, search, and availability filters.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<CarDto>))]
        public async Task<IActionResult> GetCars(
            [FromQuery] string? category,
            [FromQuery] string? search,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] bool? isAvailableOnly)
        {
            var cars = await _carService.GetCarsAsync(category, search, minPrice, maxPrice, isAvailableOnly);
            return Ok(cars);
        }

        /// <summary>
        /// Get car details by ID.
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CarDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCar(int id)
        {
            var car = await _carService.GetCarByIdAsync(id);
            if (car == null) return NotFound(new { message = $"Car with ID {id} not found." });
            return Ok(car);
        }

        /// <summary>
        /// Add a new vehicle to the fleet (Admin only).
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(CarDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> CreateCar([FromBody] CreateCarDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _carService.CreateCarAsync(dto);
            return CreatedAtAction(nameof(GetCar), new { id = created.Id }, created);
        }

        /// <summary>
        /// Update an existing car's details (Admin only).
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CarDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateCar(int id, [FromBody] UpdateCarDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var updated = await _carService.UpdateCarAsync(id, dto);
            if (updated == null) return NotFound(new { message = $"Car with ID {id} not found." });
            return Ok(updated);
        }

        /// <summary>
        /// Delete a car from the fleet (Admin only).
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteCar(int id)
        {
            var success = await _carService.DeleteCarAsync(id);
            if (!success) return NotFound(new { message = $"Car with ID {id} not found." });
            return NoContent();
        }

        /// <summary>
        /// Toggle car availability state (Admin only).
        /// </summary>
        [HttpPatch("{id}/toggle-availability")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ToggleAvailability(int id)
        {
            var success = await _carService.ToggleAvailabilityAsync(id);
            if (!success) return NotFound(new { message = $"Car with ID {id} not found." });
            return Ok(new { message = "Car availability updated successfully." });
        }
    }
}
