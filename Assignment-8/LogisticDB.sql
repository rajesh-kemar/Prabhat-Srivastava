-- ===========================
--  DRIVER TABLE (15 RECORDS)
-- ===========================
INSERT INTO Drivers (Name, Phone, DrivingLicense, ExperienceYears, IsAvailable) VALUES
('Ramesh Kumar', '9876543210', 'DL10001', 5, 1),
('Suresh Yadav', '9876543211', 'DL10002', 8, 0),
('Mukesh Singh', '9876543212', 'DL10003', 3, 1),
('Amit Verma', '9876543213', 'DL10004', 10, 1),
('Rajesh Gupta', '9876543214', 'DL10005', 6, 1),
('Vikram Sharma', '9876543215', 'DL10006', 4, 0),
('Deepak Mishra', '9876543216', 'DL10007', 7, 1),
('Nitin Chauhan', '9876543217', 'DL10008', 2, 1),
('Anil Tiwari', '9876543218', 'DL10009', 9, 1),
('Manoj Patel', '9876543219', 'DL10010', 5, 0),
('Pankaj Rai', '9876543220', 'DL10011', 6, 1),
('Rohit Singh', '9876543221', 'DL10012', 3, 1),
('Harish Mehta', '9876543222', 'DL10013', 8, 1),
('Sanjay Das', '9876543223', 'DL10014', 4, 1),
('Naresh Pal', '9876543224', 'DL10015', 5, 1);

-- ===========================
--  USER TABLE (16 RECORDS)
--  (15 Drivers + 1 Dispatcher)
-- ===========================
INSERT INTO [Users] (Username, Password, Role) VALUES
('Ramesh Kumar', 'ramesh@123', 'Driver'),
('Suresh Yadav', 'suresh@123', 'Driver'),
('Mukesh Singh', 'mukesh@123', 'Driver'),
('Amit Verma', 'amit@123', 'Driver'),
('Rajesh Gupta', 'rajesh@123', 'Driver'),
('Vikram Sharma', 'vikram@123', 'Driver'),
('Deepak Mishra', 'deepak@123', 'Driver'),
('Nitin Chauhan', 'nitin@123', 'Driver'),
('Anil Tiwari', 'anil@123', 'Driver'),
('Manoj Patel', 'manoj@123', 'Driver'),
('Pankaj Rai', 'pankaj@123', 'Driver'),
('Rohit Singh', 'rohit@123', 'Driver'),
('Harish Mehta', 'harish@123', 'Driver'),
('Sanjay Das', 'sanjay@123', 'Driver'),
('Naresh Pal', 'naresh@123', 'Driver'),
('Admin Dispatcher', 'admin@123', 'Dispatcher');  -- One dispatcher

-- ===========================
--  VEHICLE TABLE (15 RECORDS)
-- ===========================
INSERT INTO Vehicles (NumberPlate, Type, Capacity, Source, Destination, IsAvailable) VALUES
('UP70AB1001', 'Truck', 10, 'Prayagraj', 'Varanasi', 1),
('UP70AB1002', 'Mini Truck', 6, 'Lucknow', 'Kanpur', 0),
('UP70AB1003', 'Van', 8, 'Prayagraj', 'Mirzapur', 1),
('UP70AB1004', 'Truck', 12, 'Kanpur', 'Delhi', 0),
('UP70AB1005', 'Tempo', 4, 'Lucknow', 'Ayodhya', 1),
('UP70AB1006', 'Mini Truck', 6, 'Bareilly', 'Moradabad', 1),
('UP70AB1007', 'Truck', 15, 'Varanasi', 'Patna', 1),
('UP70AB1008', 'Tempo', 5, 'Noida', 'Ghaziabad', 1),
('UP70AB1009', 'Truck', 14, 'Agra', 'Mathura', 1),
('UP70AB1010', 'Mini Truck', 7, 'Lucknow', 'Sitapur', 0),
('UP70AB1011', 'Van', 8, 'Prayagraj', 'Lucknow', 1),
('UP70AB1012', 'Truck', 10, 'Kanpur', 'Jhansi', 1),
('UP70AB1013', 'Truck', 12, 'Varanasi', 'Allahabad', 1),
('UP70AB1014', 'Tempo', 4, 'Gorakhpur', 'Deoria', 1),
('UP70AB1015', 'Mini Truck', 6, 'Noida', 'Delhi', 1);

-- ===========================
--  TRIP TABLE (ONLY AVAILABLE DRIVER & VEHICLE)
-- ===========================
-- Available Drivers (IsAvailable = 1): 1, 3, 4, 5, 7, 8, 9, 11, 12, 13, 14, 15
-- Available Vehicles (IsAvailable = 1): 1, 3, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15

INSERT INTO Trips (DriverId, VehicleId, StartTime, EndTime, Source, Destination) VALUES
(1, 1, GETDATE(), NULL, 'Prayagraj', 'Varanasi'),
(3, 3, GETDATE(), DATEADD(HOUR, 3, GETDATE()), 'Prayagraj', 'Mirzapur'),
(4, 5, GETDATE(), NULL, 'Lucknow', 'Ayodhya'),
(5, 6, GETDATE(), DATEADD(HOUR, 4, GETDATE()), 'Bareilly', 'Moradabad'),
(7, 7, GETDATE(), NULL, 'Varanasi', 'Patna'),
(8, 8, GETDATE(), NULL, 'Noida', 'Ghaziabad'),
(9, 9, GETDATE(), DATEADD(HOUR, 5, GETDATE()), 'Agra', 'Mathura'),
(11, 11, GETDATE(), NULL, 'Prayagraj', 'Lucknow'),
(12, 12, GETDATE(), DATEADD(HOUR, 6, GETDATE()), 'Kanpur', 'Jhansi'),
(13, 13, GETDATE(), NULL, 'Varanasi', 'Allahabad'),
(14, 14, GETDATE(), NULL, 'Gorakhpur', 'Deoria'),
(15, 15, GETDATE(), DATEADD(HOUR, 4, GETDATE()), 'Noida', 'Delhi');
   c   