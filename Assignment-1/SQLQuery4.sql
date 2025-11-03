-- DROP TABLES if they already exist (optional, for clean re-run)
DROP TABLE IF EXISTS Trips;
DROP TABLE IF EXISTS Vehicles;
DROP TABLE IF EXISTS Drivers;

-- CREATE TABLE: Drivers
CREATE TABLE Drivers (
    DriverId INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    LicenseNumber VARCHAR(50) UNIQUE NOT NULL,
    Phone VARCHAR(15),
    ExperienceYears INT
);

-- CREATE TABLE: Vehicles
CREATE TABLE Vehicles (
    VehicleId INT PRIMARY KEY,
    NumberPlate VARCHAR(20) UNIQUE NOT NULL,
    Type VARCHAR(50),
    Capacity DECIMAL(10,2),
    Status VARCHAR(20)
);

-- CREATE TABLE: Trips
CREATE TABLE Trips (
    TripId INT PRIMARY KEY,
    VehicleId INT,
    DriverId INT,
    Source VARCHAR(100),
    Destination VARCHAR(100),
    StartTime DATETIME,
    EndTime DATETIME,
    Status VARCHAR(20),
    FOREIGN KEY (VehicleId) REFERENCES Vehicles(VehicleId),
    FOREIGN KEY (DriverId) REFERENCES Drivers(DriverId)
);

-- INSERT DATA INTO Drivers
INSERT INTO Drivers (DriverId, Name, LicenseNumber, Phone, ExperienceYears) VALUES
(1, 'Alice Johnson', 'LIC1001', '555-1111', 7),
(2, 'Bob Smith', 'LIC1002', '555-2222', 4),
(3, 'Charlie Davis', 'LIC1003', '555-3333', 6);

-- INSERT DATA INTO Vehicles
INSERT INTO Vehicles (VehicleId, NumberPlate, Type, Capacity, Status) VALUES
(1, 'CAR-001', 'Sedan', 5.00, 'Available'),
(2, 'VAN-002', 'Van', 12.00, 'Available'),
(3, 'TRK-003', 'Truck', 2000.00, 'Available'),
(4, 'SUV-004', 'SUV', 7.00, 'Available');  -- Not assigned to any trip

-- INSERT DATA INTO Trips
INSERT INTO Trips (TripId, VehicleId, DriverId, Source, Destination, StartTime, EndTime, Status) VALUES
(1, 1, 1, 'CityA', 'CityB', '2025-10-01 08:00:00', '2025-10-01 10:00:00', 'Completed'),
(2, 2, 1, 'CityC', 'CityD', '2025-10-02 09:00:00', '2025-10-02 12:00:00', 'Completed'),
(3, 2, 1, 'CityE', 'CityF', '2025-10-03 07:00:00', '2025-10-03 09:00:00', 'Completed'),
(4, 3, 2, 'CityG', 'CityH', '2025-10-04 10:00:00', '2025-10-04 13:00:00', 'Ongoing');

-- ===============================
-- QUERIES
-- ===============================

-- 1. List trips assigned to each driver
SELECT 
    D.Name AS DriverName,
    T.TripId,
    T.Source,
    T.Destination,
    T.Status
FROM Drivers D
JOIN Trips T ON D.DriverId = T.DriverId
ORDER BY D.Name;

-- 2. Find vehicles not assigned to any trip
SELECT 
    V.VehicleId,
    V.NumberPlate,
    V.Type,
    V.Status
FROM Vehicles V
LEFT JOIN Trips T ON V.VehicleId = T.VehicleId
WHERE T.VehicleId IS NULL;

-- 3. Show drivers with more than 2 trips
SELECT
    D.Name AS DriverName,
    COUNT(T.TripId) AS TotalTrips
FROM Drivers D
JOIN Trips T ON D.DriverId = T.DriverId
GROUP BY D.Name
HAVING COUNT(T.TripId) > 2;
