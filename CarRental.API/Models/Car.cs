using System;
using System.Collections.Generic;

namespace CarRental.API.Models
{
    public class Car
    {
        public int Id { get; set; }
        public string Make { get; set; } = string.Empty;       // e.g. Tesla, BMW
        public string Model { get; set; } = string.Empty;      // e.g. Model 3, 3 Series
        public int Year { get; set; }
        public string Category { get; set; } = string.Empty;   // Sedan, SUV, Electric, Luxury, Sports
        public decimal DailyRate { get; set; }
        public string FuelType { get; set; } = "Gasoline";     // Gasoline, Electric, Hybrid, Diesel
        public string Transmission { get; set; } = "Automatic"; // Automatic, Manual
        public int Seats { get; set; } = 5;
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsAvailable { get; set; } = true;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
