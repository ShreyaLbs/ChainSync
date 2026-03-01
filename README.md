# ⬡ ChainSync — Supply Chain Management System

<div align="center">

![ChainSync Banner](https://img.shields.io/badge/ChainSync-Supply%20Chain%20Management-6c3fd5?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTV6TTIgMTdsOSA1IDktNW0tOS01bDkgNSA5LTUiLz48L3N2Zz4=)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://chain-sync-nine.vercel.app)
[![Database](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://railway.app)
[![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Backend](https://img.shields.io/badge/API-Flask-000000?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com)

**A full-stack supply chain management system built for a DBMS project.**  
Manage suppliers, products, warehouses, inventory, customers, and orders — all in real time.

</div>

---

## 🌐 Live Links

| Service | URL |
|--------|-----|
| 🖥️ Frontend (Vercel) | https://chain-sync-nine.vercel.app |
| 🗄️ Database | Railway MySQL (cloud-hosted) |

---

## 📸 Preview

> Login with `admin` / `admin123` to explore the full dashboard.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Recharts, CSS Glass UI |
| **Backend** | Python, Flask, Flask-CORS |
| **Database** | MySQL (hosted on Railway) |
| **Deployment** | Vercel (frontend), Railway (backend + DB) |

---

## 🗂️ Project Structure

```
ChainSync/
├── backend/
│   ├── app.py          # Flask API routes
│   ├── db.py           # MySQL connection
│   ├── requirements.txt
│   └── Procfile        # Railway deployment config
└── frontend/
    ├── src/
    │   └── App.js      # Main React application
    └── package.json
```

---

## 🗄️ Database Schema

ChainSync uses a **relational MySQL database** with 6 tables:

### Tables

| Table | Description |
|-------|-------------|
| `supplier` | Stores supplier details |
| `product` | Product catalog linked to suppliers |
| `warehouse` | Warehouse locations and capacity |
| `inventory` | Stock levels per product per warehouse |
| `customer` | Customer information |
| `orders` | Orders placed by customers for products |

### Relationships

```
supplier ──< product ──< inventory >── warehouse
                │
              orders >── customer
```

- A **Supplier** supplies many **Products**
- A **Product** can be stored in multiple **Warehouses** via **Inventory**
- A **Customer** can place multiple **Orders**
- Each **Order** is linked to a **Product** and a **Customer**

---

## ⚙️ API Endpoints

### Suppliers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/suppliers` | Get all suppliers |
| POST | `/api/suppliers` | Add a supplier |
| PUT | `/api/suppliers/:id` | Update a supplier |
| DELETE | `/api/suppliers/:id` | Delete a supplier |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| POST | `/api/products` | Add a product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get all orders |
| POST | `/api/orders` | Place an order |
| PUT | `/api/orders/:id` | Update an order |
| DELETE | `/api/orders/:id` | Delete an order |

> Same pattern applies for `/api/warehouses`, `/api/inventory`, `/api/customers`

---

## 🚀 Features

- 🔐 **Login System** — Simple admin authentication
- 📊 **Live Dashboard** — Real-time stats, bar charts, pie charts
- 🏭 **Supplier Management** — Full CRUD
- 📦 **Product Catalog** — Card-based UI with category filters
- 🏗️ **Warehouse Tracking** — Capacity and utilization progress bars
- 📋 **Inventory Management** — Stock levels with color-coded alerts
- 👥 **Customer Management** — Profile cards with contact info
- 🛒 **Order Management** — Full order history with product linking
- 🎨 **Glassmorphism UI** — Dark theme with gradient accents and 3D hover effects

---

## 🛠️ Local Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```

Make sure to set your MySQL connection details in `backend/db.py`.

---

## 👩‍💻 About

**ChainSync** was built as a DBMS (Database Management Systems) project to demonstrate:
- Relational database design and normalization
- RESTful API development with Flask
- Full-stack integration with React
- Cloud deployment with Railway and Vercel

> Built with 💜 as a college DBMS project.

---

## 📄 Login Credentials (Demo)

```
Username: admin
Password: admin123
```
