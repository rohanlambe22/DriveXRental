# Stage 1: Build environment
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY ["CarRental.API/CarRental.API.csproj", "CarRental.API/"]
RUN dotnet restore "CarRental.API/CarRental.API.csproj"

# Copy full source and publish
COPY . .
WORKDIR "/src/CarRental.API"
RUN dotnet publish "CarRental.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Production Runtime environment
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Render passes PORT environment variable dynamically
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CarRental.API.dll"]