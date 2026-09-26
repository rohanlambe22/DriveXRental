using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CarRental.API.DTOs;
using CarRental.API.Models;
using CarRental.API.Repositories;

namespace CarRental.API.Services
{
    public class CarService : ICarService
    {
        private readonly ICarRepository _carRepository;

        public CarService(ICarRepository carRepository)
        {
            _carRepository = carRepository;
        }

        public async Task<IEnumerable<CarDto>> GetCarsAsync(string? category, string? search, decimal? minPrice, decimal? maxPrice, bool? isAvailableOnly)
        {
            var cars = await _carRepository.GetFilteredCarsAsync(category, search, minPrice, maxPrice, isAvailableOnly);
            return cars.Select(MapToDto);
        }

        public async Task<CarDto?> GetCarByIdAsync(int id)
        {
            var car = await _carRepository.GetByIdAsync(id);
            return car == null ? null : MapToDto(car);
        }

        public async Task<CarDto> CreateCarAsync(CreateCarDto dto)
        {
            var car = new Car
            {
                Make = dto.Make,
                Model = dto.Model,
                Year = dto.Year,
                Category = dto.Category,
                DailyRate = dto.DailyRate,
                FuelType = dto.FuelType,
                Transmission = dto.Transmission,
                Seats = dto.Seats,
                ImageUrl = string.IsNullOrWhiteSpace(dto.ImageUrl)
                    ? "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80"
                    : dto.ImageUrl,
                IsAvailable = dto.IsAvailable,
                Description = dto.Description,
                CreatedAt = DateTime.UtcNow
            };

            await _carRepository.AddAsync(car);
            await _carRepository.SaveChangesAsync();

            return MapToDto(car);
        }

        public async Task<CarDto?> UpdateCarAsync(int id, UpdateCarDto dto)
        {
            var car = await _carRepository.GetByIdAsync(id);
            if (car == null) return null;

            car.Make = dto.Make;
            car.Model = dto.Model;
            car.Year = dto.Year;
            car.Category = dto.Category;
            car.DailyRate = dto.DailyRate;
            car.FuelType = dto.FuelType;
            car.Transmission = dto.Transmission;
            car.Seats = dto.Seats;
            car.ImageUrl = dto.ImageUrl;
            car.IsAvailable = dto.IsAvailable;
            car.Description = dto.Description;

            _carRepository.Update(car);
            await _carRepository.SaveChangesAsync();

            return MapToDto(car);
        }

        public async Task<bool> DeleteCarAsync(int id)
        {
            var car = await _carRepository.GetByIdAsync(id);
            if (car == null) return false;

            _carRepository.Delete(car);
            await _carRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleAvailabilityAsync(int id)
        {
            var car = await _carRepository.GetByIdAsync(id);
            if (car == null) return false;

            car.IsAvailable = !car.IsAvailable;
            _carRepository.Update(car);
            await _carRepository.SaveChangesAsync();
            return true;
        }

        private static CarDto MapToDto(Car car)
        {
            return new CarDto
            {
                Id = car.Id,
                Make = car.Make,
                Model = car.Model,
                Year = car.Year,
                Category = car.Category,
                DailyRate = car.DailyRate,
                FuelType = car.FuelType,
                Transmission = car.Transmission,
                Seats = car.Seats,
                ImageUrl = car.ImageUrl,
                IsAvailable = car.IsAvailable,
                Description = car.Description
            };
        }
    }
}
