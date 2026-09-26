using System.ComponentModel.DataAnnotations;

namespace CarRental.API.DTOs
{
    public class CarDto
    {
        public int Id { get; set; }
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public string Category { get; set; } = string.Empty;
        public decimal DailyRate { get; set; }
        public string FuelType { get; set; } = string.Empty;
        public string Transmission { get; set; } = string.Empty;
        public int Seats { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
        public string Description { get; set; } = string.Empty;
    }

    public class CreateCarDto
    {
        [Required]
        public string Make { get; set; } = string.Empty;

        [Required]
        public string Model { get; set; } = string.Empty;

        [Range(1900, 2100)]
        public int Year { get; set; }

        [Required]
        public string Category { get; set; } = string.Empty;

        [Range(1, 10000)]
        public decimal DailyRate { get; set; }

        public string FuelType { get; set; } = "Gasoline";
        public string Transmission { get; set; } = "Automatic";
        
        [Range(1, 50)]
        public int Seats { get; set; } = 5;

        public string ImageUrl { get; set; } = string.Empty;
        public bool IsAvailable { get; set; } = true;
        public string Description { get; set; } = string.Empty;
    }

    public class UpdateCarDto
    {
        [Required]
        public string Make { get; set; } = string.Empty;

        [Required]
        public string Model { get; set; } = string.Empty;

        [Range(1900, 2100)]
        public int Year { get; set; }

        [Required]
        public string Category { get; set; } = string.Empty;

        [Range(1, 10000)]
        public decimal DailyRate { get; set; }

        public string FuelType { get; set; } = "Gasoline";
        public string Transmission { get; set; } = "Automatic";
        
        [Range(1, 50)]
        public int Seats { get; set; } = 5;

        public string ImageUrl { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}
