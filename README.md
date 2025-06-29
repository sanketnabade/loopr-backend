# Financial Dashboard Backend

A robust Node.js/Express backend API for a financial dashboard application built with TypeScript, MongoDB, and comprehensive security features.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with user registration and login
- **Transaction Management**: Complete CRUD operations for financial transactions
- **User Management**: User profiles with role-based access control
- **Security**: Helmet, CORS, rate limiting, and input validation
- **File Processing**: CSV import/export functionality for transactions
- **Database**: MongoDB with Mongoose ODM
- **TypeScript**: Full TypeScript support for better development experience
- **Development Tools**: Hot reloading with nodemon

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/financial-dashboard
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=30d
   
   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:5173
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
This starts the server with hot reloading using nodemon.

### Production Mode
```bash
npm start
```
This runs the compiled JavaScript from the `dist` folder.

The server will start on `http://localhost:5000` (or your specified PORT).

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Transaction Routes (`/api/transactions`)
- `GET /api/transactions` - Get all transactions (protected)
- `POST /api/transactions` - Create new transaction (protected)
- `GET /api/transactions/:id` - Get specific transaction (protected)
- `PUT /api/transactions/:id` - Update transaction (protected)
- `DELETE /api/transactions/:id` - Delete transaction (protected)

### User Routes (`/api/users`)
- Various user management endpoints (protected)

### Health Check
- `GET /api/health` - Health check endpoint

## 🏗️ Project Structure

```
src/
├── controllers/          # Route controllers
│   ├── authController.ts
│   └── transactionController.ts
├── middleware/           # Custom middleware
│   └── auth.ts
├── models/              # Database models
│   ├── User.ts
│   └── Transaction.ts
├── routes/              # Route definitions
│   ├── auth.ts
│   ├── transactions.ts
│   └── users.ts
├── utils/               # Utility functions
│   └── seedDatabase.ts
├── index.ts             # Main application file
└── test-index.ts        # Test server file
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Mongoose schema validation
- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication

## 💾 Database Models

### User Model
- Name, email, password
- Role-based access (user/admin)
- Avatar support
- Timestamps

### Transaction Model
- User reference
- Amount, type (income/expense)
- Category (revenue, expenses, investment, transfer, other)
- Status (completed, pending, failed)
- Description and reference fields
- Timestamps

## 🧪 Testing

```bash
npm test
```
Note: Test implementation is pending (currently returns placeholder).

## 📦 Build

```bash
npm run build
```
Compiles TypeScript to JavaScript in the `dist` folder.

## 🔧 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run build:js` - Build with JavaScript support
- `npm test` - Run tests

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/financial-dashboard |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | 30d |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Known Issues

- Test suite needs implementation
- Error handling could be enhanced
- API documentation could be more comprehensive

## 🚀 Future Enhancements

- [ ] Implement comprehensive test suite
- [ ] Add API documentation with Swagger
- [ ] Implement data analytics endpoints
- [ ] Add transaction categorization AI
- [ ] Implement real-time updates with WebSockets
- [ ] Add transaction notifications
- [ ] Implement transaction search and filtering
- [ ] Add data backup and restore functionality

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

---

Built with ❤️ using Node.js, Express, TypeScript, and MongoDB.
