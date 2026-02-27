from flask import Flask, jsonify, request
from flask_cors import CORS
from db import get_connection

app = Flask(__name__)
CORS(app)

# ══════════════════════════════════════════════════════
#  SUPPLIER
# ══════════════════════════════════════════════════════

@app.route('/api/suppliers', methods=['GET'])
def get_suppliers():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM supplier")
    data = cursor.fetchall()
    cursor.close(); conn.close()
    return jsonify(data)

@app.route('/api/suppliers', methods=['POST'])
def add_supplier():
    d = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO supplier (SupplierID, SupplierName, ContactNumber, Location)
        VALUES (%s, %s, %s, %s)
    """, (d['SupplierID'], d['SupplierName'], d['ContactNumber'], d['Location']))
    conn.commit(); cursor.close(); conn.close()
    return jsonify({'message': 'Supplier added'}), 201

@app.route('/api/suppliers/<sid>', methods=['PUT'])
def update_supplier(sid):
    d = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE supplier SET SupplierName=%s, ContactNumber=%s, Location=%s
        WHERE SupplierID=%s
    """, (d['SupplierName'], d['ContactNumber'], d['Location'], sid))
    conn.commit(); cursor.close(); conn.close()
    return jsonify({'message': 'Supplier updated'})

@app.route('/api/suppliers/<sid>', methods=['DELETE'])
def delete_supplier(sid):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM supplier WHERE SupplierID=%s", (sid,))
    conn.commit(); cursor.close(); conn.close()
    return jsonify({'message': 'Supplier deleted'})


# ══════════════════════════════════════════════════════
#  PRODUCT
# ══════════════════════════════════════════════════════

@app.route('/api/products', methods=['GET'])
def get_products():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM product")
    data = cursor.fetchall()
    cursor.close(); conn.close()
    return jsonify(data)

@app.route('/api/products', methods=['POST'])
def add_product():
    d = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO product (ProductID, ProductName, Category, UnitPrice, SupplierID)
        VALUES (%s, %s, %s, %s, %s)
    """, (d['ProductID'], d['ProductName'], d['Category'], d['UnitPrice'], d['SupplierID']))
    conn.commit(); cursor.close(); conn.close()
    return jsonify({'message': 'Product added'}), 201

@app.route('/api/products/<pid>', methods=['PUT'])
def update_product(pid):
    d = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE product SET ProductName=%s, Category=%s, UnitPrice=%s, SupplierID=%s
        WHERE ProductID=%s
    """, (d['ProductName'], d['Category'], d['UnitPrice'], d['SupplierID'], pid))
    conn.commit(); cursor.close(); conn.close()
    return jsonify({'message': 'Product updated'})

@app.route('/api/products/<pid>', methods=['DELETE'])
def delete_product(pid):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM product WHERE ProductID=%s", (pid,))
    conn.commit(); cursor.close(); conn.close()
    return jsonify({'message': 'Product deleted'})


# ══════════════════════════════════════════════════════
#  WAREHOUSE
# ══════════════════════════════════════════════════════

@app.route('/api/warehouses', methods=['GET'])
def get_warehouses():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM warehouse")
    data = cursor.fetchall()
    cursor.close(); conn.close()
    return jsonify(data)

@app.route('/api/warehouses', methods=['POST'])
def add_warehouse():
    d = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO warehouse (WarehouseID, WarehouseName, Location, Capacity)
        VALUES (%s, %s, %s, %s)
    """, (d['WarehouseID'], d['WarehouseName'], d['Location'], d['Capacity']))
    conn.commit(); cursor.close(); conn.close()
    return jsonify({'message': 'Warehouse added'}), 201

@app.route('/api/warehouses/<wid>', methods=['PUT'])
def update_warehouse(wid):
    d = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE warehouse SET WarehouseName=%s, Location=%s, Capacity=%s
        WHERE WarehouseID=%s
    """, (d['WarehouseName'], d['Location'], d['Capacity'], wid))
    conn.commit(); cursor.close(); conn.close()
    return jsonify({'message': 'Warehouse updated'})

@app.route('/api/warehouses/<wid>', methods=['DELETE'])
def delete_warehouse(wid):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM warehouse WHERE WarehouseID=%s", (wid,))
    conn.commit(); cursor.close(); conn.close()
    return jsonify({'message': 'Warehouse deleted'})


# ══════════════════════════════════════════════════════
#  INVENTORY
# ══════════════════════════════════════════════════════

@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM inventory")
    data = cursor.fetchall()
    cursor.close(); conn.close()
    return jsonify(data)

@app.route('/api/inventory', methods=['POST'])
def add_inventory():
    d = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO inventory (InventoryID, QuantityAvailable, ProductID, WarehouseID)
        VALUES (%s, %s, %s, %s)
    """, (d['InventoryID'], d['QuantityAvailable'], d['ProductID'], d['WarehouseID']))
    conn.commit(); cursor.close(); conn.close()
    return jsonify({'message': 'Inventory added'}), 201

@app.route('/api/inventory/<iid>', methods=['PUT'])
def update_inventory(iid):
    d = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE inventory SET QuantityAvailable=%s, ProductID=%s, WarehouseID=%s
        WHERE InventoryID=%s
    """, (d['QuantityAvailable'], d['ProductID'], d['WarehouseID'], iid))
    conn.commit(); cursor.close(); conn.close()
    return jsonify({'message': 'Inventory updated'})

@app.route('/api/inventory/<iid>', methods=['DELETE'])
def delete_inventory(iid):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM inventory WHERE InventoryID=%s", (iid,))
    conn.commit(); cursor.close(); conn.close()
    return jsonify({'message': 'Inventory deleted'})


# ══════════════════════════════════════════════════════
#  CUSTOMER
# ══════════════════════════════════════════════════════

@app.route('/api/customers', methods=['GET'])
def get_customers():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM customer")
    data = cursor.fetchall()
    cursor.close(); conn.close()
    return jsonify(data)

@app.route('/api/customers', methods=['POST'])
def add_customer():
    d = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO customer (CustomerID, CustomerName, ContactNumber, Address)
        VALUES (%s, %s, %s, %s)
    """, (d['CustomerID'], d['CustomerName'], d['ContactNumber'], d['Address']))
    conn.commit(); cursor.close(); conn.close()
    return jsonify({'message': 'Customer added'}), 201

@app.route('/api/customers/<cid>', methods=['PUT'])
def update_customer(cid):
    d = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE customer SET CustomerName=%s, ContactNumber=%s, Address=%s
        WHERE CustomerID=%s
    """, (d['CustomerName'], d['ContactNumber'], d['Address'], cid))
    conn.commit(); cursor.close(); conn.close()
    return jsonify({'message': 'Customer updated'})

@app.route('/api/customers/<cid>', methods=['DELETE'])
def delete_customer(cid):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM customer WHERE CustomerID=%s", (cid,))
    conn.commit(); cursor.close(); conn.close()
    return jsonify({'message': 'Customer deleted'})


# ══════════════════════════════════════════════════════
#  ORDERS (now includes ProductID)
# ══════════════════════════════════════════════════════

@app.route('/api/orders', methods=['GET'])
def get_orders():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM orders")
    data = cursor.fetchall()
    for row in data:
        if row.get('OrderDate'):
            row['OrderDate'] = str(row['OrderDate'])
    cursor.close(); conn.close()
    return jsonify(data)

@app.route('/api/orders', methods=['POST'])
def add_order():
    d = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO orders (OrderID, OrderDate, Bill, CustomerID, ProductID)
        VALUES (%s, %s, %s, %s, %s)
    """, (d['OrderID'], d['OrderDate'], d['Bill'], d['CustomerID'], d['ProductID']))
    conn.commit(); cursor.close(); conn.close()
    return jsonify({'message': 'Order added'}), 201

@app.route('/api/orders/<oid>', methods=['PUT'])
def update_order(oid):
    d = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE orders SET OrderDate=%s, Bill=%s, CustomerID=%s, ProductID=%s
        WHERE OrderID=%s
    """, (d['OrderDate'], d['Bill'], d['CustomerID'], d['ProductID'], oid))
    conn.commit(); cursor.close(); conn.close()
    return jsonify({'message': 'Order updated'})

@app.route('/api/orders/<oid>', methods=['DELETE'])
def delete_order(oid):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM orders WHERE OrderID=%s", (oid,))
    conn.commit(); cursor.close(); conn.close()
    return jsonify({'message': 'Order deleted'})


# ══════════════════════════════════════════════════════
#  RUN
# ══════════════════════════════════════════════════════
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
    
    