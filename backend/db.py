import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="Shreya@2026",  # replace with your MySQL root password
        database="chainsync"
    )
