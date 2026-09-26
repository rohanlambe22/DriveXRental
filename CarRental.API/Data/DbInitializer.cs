using System;
using System.Linq;
using CarRental.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CarRental.API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(CarRentalDbContext context)
        {
            // Ensure database is created
            context.Database.EnsureCreated();

            // Seed Users if empty
            if (!context.Users.Any())
            {
                var adminUser = new User
                {
                    FullName = "Admin User",
                    Email = "admin@carrental.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                };

                var customerUser = new User
                {
                    FullName = "John Doe",
                    Email = "john@example.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Customer@123"),
                    Role = "Customer",
                    CreatedAt = DateTime.UtcNow
                };

                context.Users.AddRange(adminUser, customerUser);
                context.SaveChanges();
            }

            // Seed Cars if empty
            if (!context.Cars.Any())
            {
                var cars = new[]
                {
                    new Car
                    {
                        Make = "Tesla",
                        Model = "Model 3 Long Range",
                        Year = 2024,
                        Category = "Electric",
                        DailyRate = 89.00m,
                        FuelType = "Electric",
                        Transmission = "Automatic",
                        Seats = 5,
                        ImageUrl = "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=80",
                        IsAvailable = true,
                        Description = "All-electric luxury sedan with Autopilot capabilities and ultra-smooth performance."
                    },
                    new Car
                    {
                        Make = "BMW",
                        Model = "3 Series 330i",
                        Year = 2023,
                        Category = "Luxury",
                        DailyRate = 95.00m,
                        FuelType = "Gasoline",
                        Transmission = "Automatic",
                        Seats = 5,
                        ImageUrl = "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80",
                        IsAvailable = true,
                        Description = "The iconic luxury sports sedan delivering exceptional handling, luxury interior, and power."
                    },
                    new Car
                    {
                        Make = "Ford",
                        Model = "Mustang GT Fastback",
                        Year = 2023,
                        Category = "Sports",
                        DailyRate = 110.00m,
                        FuelType = "Gasoline",
                        Transmission = "Automatic",
                        Seats = 4,
                        ImageUrl = "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=1000&q=80",
                        IsAvailable = true,
                        Description = "Legendary V8 muscle car providing thrilling roar, fast acceleration, and iconic styling."
                    },
                    new Car
                    {
                        Make = "Toyota",
                        Model = "RAV4 Hybrid AWD",
                        Year = 2024,
                        Category = "SUV",
                        DailyRate = 68.00m,
                        FuelType = "Hybrid",
                        Transmission = "Automatic",
                        Seats = 5,
                        ImageUrl = "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80",
                        IsAvailable = true,
                        Description = "Spacious, fuel-efficient SUV perfect for family trips, mountain outings, and city cruising."
                    },
                    new Car
                    {
                        Make = "Audi",
                        Model = "A6 Quattro",
                        Year = 2024,
                        Category = "Luxury",
                        DailyRate = 105.00m,
                        FuelType = "Gasoline",
                        Transmission = "Automatic",
                        Seats = 5,
                        ImageUrl = "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80",
                        IsAvailable = true,
                        Description = "Executive luxury sedan equipped with Quattro All-Wheel Drive and Virtual Cockpit."
                    },
                    new Car
                    {
                        Make = "Porsche",
                        Model = "Taycan 4S",
                        Year = 2024,
                        Category = "Sports",
                        DailyRate = 185.00m,
                        FuelType = "Electric",
                        Transmission = "Automatic",
                        Seats = 4,
                        ImageUrl = "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=80",
                        IsAvailable = true,
                        Description = "Pure electric sports car combining breathtaking acceleration with legendary Porsche dynamics."
                    },
                    new Car
                    {
                        Make = "Honda",
                        Model = "Civic Touring",
                        Year = 2023,
                        Category = "Sedan",
                        DailyRate = 52.00m,
                        FuelType = "Gasoline",
                        Transmission = "Automatic",
                        Seats = 5,
                        ImageUrl = "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1000&q=80",
                        IsAvailable = true,
                        Description = "Reliable, modern compact sedan with great fuel economy, Bose sound system, and Apple CarPlay."
                    }
                };

                context.Cars.AddRange(cars);
                context.SaveChanges();
            }

            // Seed initial sample booking for customer
            if (!context.Bookings.Any())
            {
                var customer = context.Users.FirstOrDefault(u => u.Role == "Customer");
                var car = context.Cars.FirstOrDefault(c => c.Make == "Tesla");

                if (customer != null && car != null)
                {
                    var booking = new Booking
                    {
                        UserId = customer.Id,
                        CarId = car.Id,
                        StartDate = DateTime.UtcNow.AddDays(2),
                        EndDate = DateTime.UtcNow.AddDays(5),
                        TotalPrice = car.DailyRate * 3,
                        Status = "Confirmed",
                        CreatedAt = DateTime.UtcNow
                    };

                    context.Bookings.Add(booking);
                    context.SaveChanges();
                }
            }
        }
    }
}
