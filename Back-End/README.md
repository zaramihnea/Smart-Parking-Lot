For more details and latest information visit https://docs.google.com/document/d/1_M8Usq3-MyN-l-pRvk7xeSiL49jh1QvwwT96yEMkmfs/view

# Smart Parking Lot

Smart Parking Lot is a Spring Boot application designed to simplify the process of finding and managing parking spots. This project utilizes PostgreSQL for database management and integrates with the Stripe API for payment processing.

## Features (May be outdated)

- User authentication and authorization with JWT
- CRUD operations on parking lots and parking spots
- Real-time availability checks for parking spots
- Payment processing using Stripe API

## Getting Started

### Prerequisites

- PostgreSQL: [Download and install PostgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
- Java: Ensure Java 11 or newer is installed on your system

### Installation

1. **Install PostgreSQL:**
   - Install PostgreSQL with a superuser password of your choice.
   - Add the PostgreSQL bin folder to your PATH environment variables.

2. **Set up the database:**
   ```bash
   psql -U postgres
   # Enter the chosen superuser password when prompted
   CREATE DATABASE smart_parking_lot;
   CREATE USER smart WITH PASSWORD 'smart';
   ALTER ROLE smart WITH SUPERUSER;
   GRANT ALL PRIVILEGES ON DATABASE smart_parking_lot TO smart;
   GRANT ALL PRIVILEGES ON DATABASE smart_parking_lot TO postgres;
   ```

3. **Run the server**

## Usage (May be outdated)

- **User Registration:**
  POST to `http://localhost:8081/user` with a JSON payload containing user details.

- **User Login:**
  POST to `http://localhost:8081/user/login` with credentials to receive a JWT token.

- **Access Protected Resources:**
  Use the JWT token to access private user resources by including it in the Authorization header.

- **Finding Parking:**
  GET from `http://localhost:8081/parking_lot/search` with parameters for location and radius to find nearby parking lots.

- **Check Available Spots:**
  GET from `http://localhost:8081/parking_lot/available-spots-search` with time and location parameters to find available parking spots.



## License

[MIT](https://choosealicense.com/licenses/mit/)