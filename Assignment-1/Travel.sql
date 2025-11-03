CREATE TABLE Drivers (
	DriverId INT PRIMARY KEY,
	Name VARCHAR(100) NOT NULL,
	LicenseNumber VARCHAR(50) UNIQUE NOT NULL,
	Phone VARCHAR(15),
	ExperienceYears INT
);

CREATE TABLE Vehicles (
	VehicleId INT PRIMARY KEY,
	NumberPlate VARCHAR(20) UNIQUE NOT NULL,
	Type VARCHAR(50),
	Capacity DECIMAL(10,2),
	Status VARCHAR(20)
);

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
	FOREIGN KEY (DriverId) REFERENCES Drivers(DriverId),
);

INSERT INTO Drivers (DriverId, Name, LicenseNumber, Phone, ExperienceYears) VALUES
(1, 'John Doe', 'LIC123456', '555-1234', 5),
(2, 'Jane Smith', 'LIC654321', '555-5678', 8),
(3, 'Carlos Martinez', 'LIC789012', '555-9012', 3),
(4, 'Amara Johnson', 'LIC345678', '555-3456', 10),
(5, 'Liam Wong', 'LIC987654', '555-7890', 6);

INSERT INTO Vehicles (VehicleId, NumberPlate, Type, Capacity, Status) VALUES
(1, 'ABC-123', 'Truck', 5000.00, 'Available'),
(2, 'XYZ-789', 'Van', 1500.00, 'In Service'),
(3, 'DEF-456', 'SUV', 800.00, 'Available'),
(4, 'GHI-321', 'Mini Truck', 2000.00, 'Under Maintenance'),
(5, 'JKL-654', 'Truck', 6000.00, 'Available');

INSERT INTO Trips (TripId, VehicleId, DriverId, Source, Destination, StartTime, EndTime, Status) VALUES
(1, 1, 1, 'New York', 'Boston', '2025-10-01 08:00:00', '2025-10-01 12:00:00', 'Completed'),
(2, 2, 2, 'Chicago', 'Detroit', '2025-10-02 09:30:00', '2025-10-02 13:00:00', 'Completed'),
(3, 3, 3, 'Los Angeles', 'San Diego', '2025-10-05 07:00:00', '2025-10-05 10:00:00', 'Completed'),
(4, 4, 4, 'Houston', 'Dallas', '2025-10-08 06:30:00', '2025-10-08 09:45:00', 'Ongoing'),
(5, 5, 5, 'Seattle', 'Portland', '2025-10-10 10:00:00', NULL, 'Scheduled');


-- List trips assigned to each driver
SELECT 
	D.Name AS DriverName,
	T.TripId,
	T.Source,
	T.Destination,
	T.Status
FROM Drivers D
JOIN Trips T ON D.DriverId = T.DriverId
ORDER BY D.Name;


-- Find vehicles not assigned to any trip
SELECT 
	V.VehicleId,
	V.NumberPlate,
	V.Type,
	V.Status
FROM Vehicles V
LEFT JOIN Trips T ON V.VehicleId = T.VehicleId
WHERE T.VehicleId IS NULL;


--Show drivers with more than 2 trips
SELECT
	D.Name AS DriverName,
	COUNT(T.TripId) AS Totalrips
FROM Drivers D
JOIN Trips T ON D.DriverId = T.DriverId
GROUP BY D.Name
HAViNG COUNT(T.TripId) > 2;





