using System;

namespace CarRental.API.Models
{
    public class Booking
    {
        public int Id { get; set; }
        
        public int UserId { get; set; }
        public User? User { get; set; }

        public int CarId { get; set; }
        public Car? Car { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; } = "Confirmed"; // Pending, Confirmed, Completed, Cancelled
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
