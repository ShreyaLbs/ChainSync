-- ============================================================
--  ChainSync - Supply Chain Management System
--  Database Schema (as per schema diagram)
-- ============================================================

DROP DATABASE IF EXISTS chainsync;
CREATE DATABASE chainsync;
USE chainsync;

-- ─────────────────────────────────────────────────────────────
-- TABLE 1: supplier
-- ─────────────────────────────────────────────────────────────
CREATE TABLE supplier (
    SupplierID      VARCHAR(10)     PRIMARY KEY,
    SupplierName    VARCHAR(100)    NOT NULL,
    ContactNumber   VARCHAR(20),
    Location        VARCHAR(150)
);

-- ─────────────────────────────────────────────────────────────
-- TABLE 2: product
-- ─────────────────────────────────────────────────────────────
CREATE TABLE product (
    ProductID       VARCHAR(10)     PRIMARY KEY,
    ProductName     VARCHAR(100)    NOT NULL,
    Category        VARCHAR(50),
    UnitPrice       DECIMAL(10,2)   NOT NULL,
    SupplierID      VARCHAR(10),
    FOREIGN KEY (SupplierID) REFERENCES supplier(SupplierID)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- TABLE 3: warehouse
-- ─────────────────────────────────────────────────────────────
CREATE TABLE warehouse (
    WarehouseID     VARCHAR(10)     PRIMARY KEY,
    WarehouseName   VARCHAR(100)    NOT NULL,
    Location        VARCHAR(150),
    Capacity        INT             NOT NULL
);

-- ─────────────────────────────────────────────────────────────
-- TABLE 4: inventory
-- ─────────────────────────────────────────────────────────────
CREATE TABLE inventory (
    InventoryID         VARCHAR(10)     PRIMARY KEY,
    QuantityAvailable   INT             DEFAULT 0,
    ProductID           VARCHAR(10)     NOT NULL,
    WarehouseID         VARCHAR(10)     NOT NULL,
    FOREIGN KEY (ProductID)   REFERENCES product(ProductID)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (WarehouseID) REFERENCES warehouse(WarehouseID)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- TABLE 5: customer
-- ─────────────────────────────────────────────────────────────
CREATE TABLE customer (
    CustomerID      VARCHAR(10)     PRIMARY KEY,
    CustomerName    VARCHAR(100)    NOT NULL,
    ContactNumber   VARCHAR(20),
    Address         VARCHAR(200)
);

-- ─────────────────────────────────────────────────────────────
-- TABLE 6: orders
-- ─────────────────────────────────────────────────────────────
CREATE TABLE orders (
    OrderID         VARCHAR(10)     PRIMARY KEY,
    OrderDate       DATE            NOT NULL,
    Bill            DECIMAL(10,2)   NOT NULL,
    CustomerID      VARCHAR(10)     NOT NULL,
    FOREIGN KEY (CustomerID) REFERENCES customer(CustomerID)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
--  SAMPLE DATA
-- ============================================================

INSERT INTO supplier VALUES
('S001', 'AgroTech Pvt Ltd',  '+91-9876543210', 'Mumbai, MH'),
('S002', 'GlobalParts Co.',   '+1-555-0198',    'New York, USA'),
('S003', 'NordLogistics AB',  '+46-70-123456',  'Stockholm, Sweden'),
('S004', 'ShineParts Inc.',   '+86-139-0000',   'Beijing, China'),
('S005', 'EcoWrap Solutions', '+91-9123456780', 'Bengaluru, KA');

INSERT INTO product VALUES
('P001', 'Industrial Motor A4',  'Machinery',     12500.00, 'S002'),
('P002', 'Organic Fertilizer X', 'Raw Materials',   850.00, 'S001'),
('P003', 'Cardboard Box L',      'Packaging',        45.00, 'S005'),
('P004', 'Control Unit PCB',     'Components',     3200.00, 'S004'),
('P005', 'Steel Rod 12mm',       'Raw Materials',   320.00, 'S001'),
('P006', 'Bubble Wrap Roll',     'Packaging',       180.00, 'S003');

INSERT INTO warehouse VALUES
('W001', 'Bengaluru Central', 'Bengaluru, KA', 10000),
('W002', 'Delhi North Hub',   'Delhi, DL',     15000),
('W003', 'Mumbai Port WH',    'Mumbai, MH',    20000),
('W004', 'Chennai South',     'Chennai, TN',    8000);

INSERT INTO inventory VALUES
('I001', 142,  'P001', 'W001'),
('I002',  23,  'P002', 'W002'),
('I003', 5400, 'P003', 'W003'),
('I004',  67,  'P004', 'W001'),
('I005', 890,  'P005', 'W004'),
('I006', 210,  'P006', 'W003');

INSERT INTO customer VALUES
('C001', 'Rahul Mehta',  '+91-9811234567', '12 Marine Drive, Mumbai, MH'),
('C002', 'Sneha Iyer',   '+91-9922345678', '45 Anna Nagar, Chennai, TN'),
('C003', 'Arjun Das',    '+91-9733456789', '78 Park Street, Kolkata, WB'),
('C004', 'Priya Nair',   '+91-9644567890', '23 MG Road, Bengaluru, KA'),
('C005', 'Vikram Singh', '+91-9555678901', '56 Connaught Place, Delhi, DL');

INSERT INTO orders VALUES
('ORD001', '2024-01-15', 62500.00, 'C001'),
('ORD002', '2024-01-20', 17000.00, 'C002'),
('ORD003', '2024-01-22', 32000.00, 'C003'),
('ORD004', '2024-01-23',  4500.00, 'C004'),
('ORD005', '2024-01-25', 16000.00, 'C005'),
('ORD006', '2024-01-28',  5400.00, 'C001');
