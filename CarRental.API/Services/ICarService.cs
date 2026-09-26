using System.Collections.Generic;
using System.Threading.Tasks;
using CarRental.API.DTOs;

namespace CarRental.API.Services
{
    public interface ICarService
    {
        Task<IEnumerable<CarDto>> GetCarsAsync(string? category, string? search, decimal? minPrice, decimal? maxPrice, bool? isAvailableOnly);
        Task<CarDto?> GetCarByIdAsync(int id);
        Task<CarDto> CreateCarAsync(CreateCarDto dto);
        Task<CarDto?> UpdateCarAsync(int id, UpdateCarDto dto);
        Task<bool> DeleteCarAsync(int id);
        Task<bool> ToggleAvailabilityAsync(int id);
    }
}
