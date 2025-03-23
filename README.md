# EmployeeTasker

EmployeeTasker is a comprehensive employee management system that helps organizations manage employees, their profiles, tasks, and projects efficiently. This web application streamlines workforce management with an intuitive interface and robust features.

## Features

- **User Authentication**: Secure login and registration system with role-based access control
- **Employee Profiles**: Complete employee profiles with personal information and profile image upload
- **Task Management**: Create, assign, track, and update tasks
- **Department Organization**: Manage employees by departments
- **Dashboard**: Visual representation of employee performance and task status
- **Real-time Updates**: Get notified about task assignments and updates

## Tech Stack

### Frontend
- **React.js**: Frontend library for building the user interface
- **Axios**: HTTP client for API requests
- **Tailwind CSS**: Utility-first CSS framework for styling

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for storing application data
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT (JSON Web Tokens)**: For secure authentication
- **Multer**: Middleware for handling multipart/form-data (file uploads)
- **Cloudinary**: Cloud storage for image uploads
- **Streamifier**: Utility for converting buffers to streams

## Installation

1. Clone the repository
```bash
git clone https://github.com/Chirag-Chhugani/EmployeeTasker.git
cd EmployeeTasker
```

2. Install dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Run the application
```bash
# Run backend and frontend concurrently
npm run dev

# Run backend only
npm run server

# Run frontend only
npm run client
```

## Demo Credentials

### Client/Employee
- **Email**: jaggu@gmail.com
- **Password**: jaggu

### Admin
- **Email**: ashu@gmail.com
- **Password**: ashu

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Authenticate a user

### Employee
- `GET /api/employee/profile`: Get employee profile
- `POST /api/employee/upload-image`: Upload employee profile image

### Tasks
- `GET /api/tasks`: Get all tasks
- `POST /api/tasks`: Create a new task
- `PUT /api/tasks/:id`: Update a task
- `DELETE /api/tasks/:id`: Delete a task

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.