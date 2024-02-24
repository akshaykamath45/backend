

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone https://github.com/akshaykamath45/backend/
   ```
2. **Install Dependencies:**
   ```
   npm install
   ```
3. **Setup Environment Variables:**
   - Create a .env file in the root directory
   - Add the following variables:
      ```
      MONGODB_URL="mongodb+srv://" (Your connection string)
      ```
   - For JWT_SECRET, set in config.js:
      ```
      module.exports = {
        JWT_SECRET: "jwt-secret",
      };
      ```
 4. **Start the server**:
      ```
      node index.js
      ```
 6. **End Points:**
    - User Routes (/user):
      - /signup - POST: User signup.
      - /signin - POST: User signin.
      - /:userId - GET: Retrieve a user by ID.
      - / - GET: Retrieve all users.
      - /:userId - PUT: Update a user by ID.
      - /:userId - DELETE: Delete a user by ID.
      - /points/:userId - POST: Update user points.
      - /points - GET: Retrieve users sorted by points order.

   - Job Routes (/job):
      - / - POST: Create a new job listing.
      - / - GET: Retrieve all job listings.
      - /:id - GET: Retrieve a job listing by ID.
      - /:id - PUT: Update a job listing by ID.
      - /:id - DELETE: Delete a job listing by ID.
      - /users/:id - POST: Add a user to the list of applicants for a job.

[View Complete API Documentation]( https://documenter.getpostman.com/view/24438498/2sA2rCV2WE)

  
