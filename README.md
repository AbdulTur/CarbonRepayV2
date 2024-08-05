# CarbonRepayV2

This project is a web application for calculating carbon emissions and managing vehicles and distances. It consists of a backend server built with Node.js, Express, and MongoDB, and a frontend client built with React and Bootstrap.

## Link: https://carbonrepay-bb68f998cf59.herokuapp.com/

## Tech Stack

- **Backend:**

  - Node.js
  - Express
  - MongoDB

- **Frontend:**
  - React
  - Bootstrap

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have the following software installed on your machine:

- Node.js
- npm (Node package manager)
- MongoDB Atlas account

### Installing

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/CarbonRepayV2.git
   cd CarbonRepayV2

   ```

2. **Install backend dependencies:**

   ```bash
   cd backend
   npm install

   ```

3. **Install backend dependencies:**

   ```bash
   cd ../frontend
   npm install
   ```

### Setting Up Environment Variables

1. **Create a .env file in the backend directory:**

   ```bash
    MONGO_URI=your_mongo_db_connection_string
    PORT=5000

   ```

2. **Create a .env file in the frontend directory:**

   ```bash
   REACT_APP_API_BASE_URL=BACKEND_PORT
   ```

### Running the Application

1. **Run the backend server:**

   ```bash
    cd backend
    npm install
    npm start

   ```

2. **Run the frontend client:**

   ```bash
   cd frontend
   npm install
   npm start
   ```

### Built With

    Node.js Express MongoDB React Bootstrap
