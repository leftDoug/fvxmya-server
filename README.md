# FevexMeet API

> A comprehensive REST API for meeting management and organizational workflow automation

## Overview

FevexMeet API is a Node.js/Express-based backend service designed to streamline meeting management processes within organizations. The system provides comprehensive functionality for managing organizations, users, meetings, agendas, topics, agreements, and follow-up responses.

## Features

### Core Functionality
- **User Management**: Role-based access control with administrators and workers
- **Organization Management**: Multi-tenant support with organization hierarchies
- **Meeting Orchestration**: Complete meeting lifecycle management
- **Agenda Planning**: Structured agenda creation and topic management  
- **Agreement Tracking**: Post-meeting agreement assignment and monitoring
- **Response Collection**: Systematic follow-up response gathering

### Technical Features
- RESTful API design with comprehensive endpoint coverage
- JWT-based authentication with refresh token support
- PostgreSQL database with Sequelize ORM
- Comprehensive test suite with Jest and Supertest
- Interactive API documentation with Swagger UI
- CORS-enabled for frontend integration

## Tech Stack

- **Runtime**: Node.js (ES6 Modules)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Testing**: Jest + Supertest
- **Documentation**: Swagger (swagger-jsdoc + swagger-ui-express)
- **Development**: Nodemon for hot reloading

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fvxmya-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_NAME=fevexmeet_db
   DB_TEST_NAME=fevexmeet_test_db
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
   ```

4. **Database Setup**
   
   Create the PostgreSQL databases:
   ```sql
   CREATE DATABASE fevexmeet_db;
   CREATE DATABASE fevexmeet_test_db;
   ```

5. **Database Synchronization**
   
   Uncomment the appropriate sync lines in `src/index.js` to initialize tables:
   ```javascript
   // await sequelize.sync(); // For initial setup
   ```

## Usage

### Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000` with hot reloading enabled.

### Production Server
```bash
npm start
```

### API Documentation
Once the server is running, visit `http://localhost:3000/api-docs` for interactive Swagger documentation.

## Testing

### Run All Tests
```bash
npm test
```

### Test-Specific Commands
```bash
npm run test:watch      # Run tests in watch mode
npm run test:auth       # Run authentication tests
npm run test:users      # Run user management tests
npm run test:orgs       # Run organization tests
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout
- `POST /api/auth/change-password` - Password change

### Core Resources
- `GET|POST /api/users` - User management
- `GET|POST /api/organizations` - Organization management
- `GET|POST /api/meetings` - Meeting management
- `GET|POST /api/agendas` - Agenda management
- `GET|POST /api/topics` - Topic management
- `GET|POST /api/agreements` - Agreement tracking
- `GET|POST /api/responses` - Response collection

### Administrative
- `GET|POST /api/types-meetings` - Meeting type configuration

## Database Schema

### Core Models
- **User**: System users with role-based access
- **Organization**: Multi-tenant organizational structure
- **Meeting**: Central meeting entity
- **Agenda**: Meeting agenda templates
- **Topic**: Individual discussion topics
- **Agreement**: Post-meeting commitments
- **Response**: Follow-up response tracking
- **Token**: JWT refresh token management

### Key Relationships
- Organizations have leaders (Users) and multiple meeting types
- Meetings belong to organizations and have secretaries/participants
- Agreements are assigned to responsible users
- Complex many-to-many relationships through junction tables

## Project Structure

```
src/
├── controllers/     # Business logic handlers
├── models/         # Sequelize models and associations
├── routes/         # Express route definitions
├── middlewares/    # Authentication and validation
├── helpers/        # Utility functions (JWT, etc.)
├── db/            # Database configuration
├── tests/         # Test suites
├── app.js         # Express application setup
└── index.js       # Server entry point
```

## Development Guidelines

### Code Style
- ES6 modules throughout the codebase
- Async/await pattern for asynchronous operations
- Consistent error handling with try-catch blocks
- Standardized API response format

### Database Operations
- All model associations centralized in `src/models/associations.js`
- Transaction usage for critical operations
- Environment-specific database configuration

### Testing Standards
- Comprehensive test coverage with Jest
- HTTP endpoint testing with Supertest
- Database isolation between test runs
- Separate test database environment

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- JWT-based authentication with refresh tokens
- Password hashing with bcryptjs
- Input validation using express-validator
- CORS configuration for frontend integration
- Environment variable usage for sensitive data

## License

This project is licensed under the ISC License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for efficient meeting management**
