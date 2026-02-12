
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
from dotenv import load_dotenv

load_dotenv()

# Parse the DATABASE_URL manually or just use the known parts directly is safer
# DATABASE_URL=postgresql+psycopg2://postgres:AcademyRootPassword@localhost:5432/project_backend_db

# Credentials from .env
DB_USER = "postgres"
DB_PASS = "AcademyRootPassword"
DB_HOST = "localhost"
DB_PORT = "5432"
TARGET_DB = "project_backend_db"

def create_database():
    try:
        # Connect to the default 'postgres' database to create the new one
        con = psycopg2.connect(
            dbname="postgres",
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST,
            port=DB_PORT
        )
        
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()
        
        # Check if database already exists
        cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{TARGET_DB}'")
        exists = cur.fetchone()
        
        if not exists:
            print(f"Database '{TARGET_DB}' does not exist. Creating...")
            cur.execute(f"CREATE DATABASE {TARGET_DB}")
            print(f"Database '{TARGET_DB}' created successfully!")
        else:
            print(f"Database '{TARGET_DB}' already exists.")
            
        cur.close()
        con.close()
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    create_database()
