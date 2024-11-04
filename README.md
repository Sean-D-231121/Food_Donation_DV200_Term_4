![Logo Image](path_to_your_logo.png)

# FoodShare Connect

FoodShare Connect is a web application designed to facilitate food donations by connecting donors with recipients through volunteer delivery services. The platform aims to reduce food waste and help those in need by creating an efficient donation management system.

### Built With
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)

## How To Install

1. Clone the repository:
git clone [repository-url]
Install dependencies for both frontend and backend:

# Set up environment variables: 
Create a .env file in the Backend directory with:

MONGO_URI=your_mongodb_connection_string
PORT=5001
# Install dependencies for both frontend and backend:

cd food_donation_frontend
npm install

cd ../Backend
npm install
# In Backend directory
npm start

# In food_donation_frontend directory
npm start

## Features

### User Roles
- Donor
- Recipient
- Volunteer

### Donation Management
- Real-time donation tracking
- Monthly and yearly donation goals
- Top donors and volunteers recognition
- Donation status updates

### User Experience
- Profile management
- Statistical analysis of donations

## UI Design
- Login Page
[Add login page screenshot]

- Home Dashboard
[Add dashboard screenshot]

- Profile Page
[Add profile page screenshot]

- Donation Management
[Add donation management screenshot]

## Development Process
### Key Highlights
- Multi-role system for comprehensive donation ecosystem
- Live tracking and goal-setting to encourage participation
- Recognition system to motivate top contributors
- Detailed analytics for insights into donation patterns

## Challenges and Future Roadmap

### 🛠 Development Challenges

- **Role Management:** 
- Implementing a robust system for multiple user roles and permissions

- **Real-Time Updates:** 
- Ensuring seamless real-time status updates across the platform

- **Media Handling:** 
- Efficient management of image uploads and secure storage

- **Matching Algorithm:** 
- Developing an intelligent system for optimal donation-recipient matching

### Future Implementations

1. **Enhanced Communication**
- Integrated chat system for direct user interaction
- Email notification system for important updates

2. **Platform Expansion**
- Mobile application for on-the-go access
- Social media integration for wider reach and easier sharing


3. **User security**
   - add JWT and bcrypt to make user authentication
   - The user will only be logged in for around an hour

4. **Logistics Optimization**
- [ ] Integration with mapping services for streamlined delivery routes

## Database Schema

### Users Collection

| Field    | Type     | Description                    |
|----------|----------|--------------------------------|
| userid   | Number   | Unique identifier for the user |
| name     | String   | User's full name               |
| email    | String   | User's email address           |
| phone    | String   | User's contact number          |
| password | String   | Hashed password                |
| role     | String   | User role (Donor/Recipient/Volunteer) |
| image    | String   | URL or path to user's profile image |

### Donations Collection

| Field         | Type     | Description                    |
|---------------|----------|--------------------------------|
| donationid    | Number   | Unique identifier for the donation |
| donorID       | Number   | ID of the user making the donation |
| recipientID   | Number   | ID of the recipient            |
| volunteerID   | Number   | ID of the assigned volunteer   |
| amountDonated | Number   | Quantity or value of the donation |
| status        | String   | Current status of the donation |
| dateDonated   | Date     | Timestamp of the donation      |

### 🔗 Relationships

- Each donation in the Donations Collection is linked to:
- A donor in the Users Collection via `donorID`
- A recipient in the Users Collection via `recipientID`
- A volunteer in the Users Collection via `volunteerID`

### 📝 Notes

- The `role` field in the Users Collection determines the user's permissions and access levels within the application.
- The `status` field in the Donations Collection can be used to track the lifecycle of a donation (e.g., pending, in transit, delivered).

## 🌐 API Endpoints

### 👥 User Routes

| Method | Endpoint                | Description                      |
|--------|-------------------------|----------------------------------|
| POST   | `/api/users/register`   | Register a new user              |
| POST   | `/api/users/signin`     | Sign in an existing user         |
| GET    | `/api/users/:userid`    | Retrieve user details by user ID |
| PUT    | `/api/users/:userid`    | Update user details by user ID   |

### 🎁 Donation Routes

| Method | Endpoint                                  | Description                                |
|--------|-------------------------------------------|--------------------------------------------|
| GET    | `/api/donations`                          | Get all donations                          |
| POST   | `/api/donations/create`                   | Create a new donation                      |
| GET    | `/api/donations/donor/:donorID`           | Get donations made by a specific donor     |
| PATCH  | `/api/donations/status/:donationid`       | Update the status of a specific donation   |
| GET    | `/api/donations/monthlyTotals`            | Get total donation amounts per month       |
| GET    | `/api/donations/top-donors`               | Get top donors of the current month        |
| GET    | `/api/donations/top-volunteers`           | Get top volunteers of the current month    |

### 📜 Notes
- The `:userid`, `:donorID`, and `:donationid` parameters should be replaced with actual values when making requests.
- Ensure that appropriate authentication and authorization measures are in place for sensitive endpoints.

### Acknowlegdements
- Tsungai Katsuro for teaching me how to deploy and create a Mern stack application
- React Chartjs for allowing for seamless and responsive 
## License
MIT © [Sean Dubbelman]
 
