import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="gondola.proxy.rlwy.net",
        port=54476,
        user="root",
        password="sWVAKcHhEtJpdamyTFYruoEleyhxBtcP",
        database="railway"
    )
