using CarRental.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CarRental.API.Data
{
    public class CarRentalDbContext : DbContext
    {
        public CarRentalDbContext(DbContextOptions<CarRentalDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Car> Cars => Set<Car>();
        public DbSet<Booking> Bookings => Set<Booking>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.Email).IsRequired().HasMaxLength(150);
                entity.Property(u => u.FullName).IsRequired().HasMaxLength(100);
            });

            // Car configuration
            modelBuilder.Entity<Car>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Make).IsRequired().HasMaxLength(50);
                entity.Property(c => c.Model).IsRequired().HasMaxLength(50);
                entity.Property(c => c.DailyRate).HasPrecision(18, 2);
            });

            // Booking configuration & relationships
            modelBuilder.Entity<Booking>(entity =>
            {
                entity.HasKey(b => b.Id);
                entity.Property(b => b.TotalPrice).HasPrecision(18, 2);

                entity.HasOne(b => b.User)
                      .WithMany(u => u.Bookings)
                      .HasForeignKey(b => b.UserId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(b => b.Car)
                      .WithMany(c => c.Bookings)
                      .HasForeignKey(b => b.CarId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
