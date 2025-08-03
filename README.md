# 🎫 Voucher Redemption System - MERN Stack Application

A comprehensive voucher redemption and rewards management system built with the MERN stack (MongoDB, Express.js, React.js, Node.js) with additional Flutter mobile app support and AI-powered chat functionality.

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

The Voucher Redemption System is a full-stack web application that enables businesses to manage voucher codes, customer rewards, and redemption processes. The system includes separate interfaces for administrators and customers, with real-time updates, AI-powered customer support, and comprehensive reporting capabilities.

### Key Components:
- **Backend API**: Node.js/Express.js with Feathers.js framework
- **Frontend Web App**: React.js with PrimeReact UI components
- **Mobile App**: Flutter application for mobile access
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: Ollama-powered chat system
- **Real-time Updates**: WebSocket connections
- **PDF Generation**: Transaction and voucher reports

## ✨ Features

### 🔐 Authentication & User Management
- **Multi-role System**: Admin, Customer, and Staff roles
- **Secure Authentication**: JWT-based authentication
- **Role-based Access Control**: Different interfaces per user type
- **User Profile Management**: Account settings and preferences
- **Session Management**: Secure login/logout functionality

### 🎫 Voucher Management
- **Voucher Creation**: Admin can create and manage voucher codes
- **Unique Code Generation**: Automatic unique voucher code creation
- **Voucher Categories**: Organize vouchers by type and value
- **Expiration Management**: Set and track voucher expiration dates
- **Bulk Operations**: Import/export voucher codes
- **Image Support**: Attach images to vouchers

### 🛒 Shopping Cart & Redemption
- **Shopping Cart**: Add vouchers to cart for redemption
- **Real-time Cart Updates**: Live cart synchronization
- **Transaction History**: Complete redemption history
- **Points System**: Customer points tracking and management
- **Redemption Validation**: Prevent duplicate redemptions
- **Cart Persistence**: Cart data saved across sessions

### 👤 Customer Features
- **Customer Dashboard**: Personalized customer interface
- **Voucher Browsing**: Browse available vouchers
- **Account Management**: Update personal information
- **Points Tracking**: View and manage reward points
- **Redemption History**: View past redemptions
- **Profile Customization**: Personalize account settings

### 🔧 Admin Features
- **Admin Dashboard**: Comprehensive admin interface
- **User Management**: Manage all user accounts
- **Voucher Administration**: Create, edit, and delete vouchers
- **Analytics & Reports**: View system statistics
- **Customer Support**: Access customer information
- **System Configuration**: Manage system settings

### 🤖 AI Chat System
- **Intelligent Support**: AI-powered customer service
- **Multi-mode Chat**: Admin and customer modes
- **Context Awareness**: Maintains conversation context
- **Quick Responses**: Pre-configured answer templates
- **Integration**: Seamless integration with main application
- **Customizable**: Configurable AI responses

### 📄 Reporting & Analytics
- **PDF Generation**: Export reports in PDF format
- **Transaction Reports**: Detailed redemption reports
- **User Analytics**: User activity and engagement metrics
- **Voucher Performance**: Track voucher usage and effectiveness
- **Real-time Statistics**: Live dashboard updates

### 📱 Mobile Support
- **Flutter Mobile App**: Cross-platform mobile application
- **Responsive Design**: Mobile-optimized web interface
- **Offline Capabilities**: Basic offline functionality
- **Push Notifications**: Real-time mobile notifications

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v20.0.0+)
- **Framework**: Express.js with Feathers.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **Real-time**: Socket.io
- **File Upload**: Multer
- **Email**: Nodemailer
- **Caching**: Redis
- **Queue System**: Bull/BullMQ
- **AI Integration**: Ollama API

### Frontend
- **Framework**: React.js (v18.2.0)
- **UI Library**: PrimeReact (v10.8.3)
- **Styling**: Tailwind CSS (v3.4.13)
- **State Management**: Redux with @rematch/core
- **Routing**: React Router DOM (v6.15.0)
- **HTTP Client**: Axios
- **PDF Generation**: jsPDF
- **Charts**: Chart.js
- **Icons**: PrimeIcons

### Mobile
- **Framework**: Flutter
- **Language**: Dart
- **State Management**: Provider/Riverpod
- **HTTP Client**: Dio
- **Local Storage**: SharedPreferences

### DevOps & Tools
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git
- **Package Manager**: npm
- **Code Formatting**: Prettier
- **Linting**: ESLint
- **Testing**: Mocha, Jest
- **Documentation**: Markdown

## 🏗️ Architecture

```
voucher-redeem-merncp-a9b115/
├── 📁 nodejs-backend/          # Backend API Server
│   ├── 📁 src/
│   │   ├── 📁 models/          # Database models
│   │   ├── 📁 services/        # Business logic
│   │   ├── 📁 routes/          # API routes
│   │   ├── 📁 middleware/      # Custom middleware
│   │   └── 📁 utils/           # Utility functions
│   ├── 📁 config/              # Configuration files
│   └── 📁 test/                # Backend tests
├── 📁 react-frontend/          # React Web Application
│   ├── 📁 src/
│   │   ├── 📁 components/      # React components
│   │   ├── 📁 services/        # API services
│   │   ├── 📁 context/         # React context
│   │   ├── 📁 utils/           # Utility functions
│   │   └── 📁 css/             # Stylesheets
│   └── 📁 public/              # Static assets
├── 📁 flutter-dart/            # Flutter Mobile App
│   ├── 📁 lib/
│   │   ├── 📁 screens/         # App screens
│   │   ├── 📁 components/      # UI components
│   │   ├── 📁 services/        # API services
│   │   └── 📁 utils/           # Utility functions
│   └── 📁 assets/              # App assets
├── 📁 docs/                    # Documentation Hub
│   ├── 📁 guides/              # Feature guides (50+ files)
│   ├── 📁 scripts/             # Utility scripts (10+ files)
│   └── 📁 tests/               # Test files
├── 📄 docker-compose.yaml      # Docker configuration
└── 📄 README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v20.0.0 or higher)
- npm (v10.0.0 or higher)
- MongoDB (v5.0.13 or higher)
- Docker & Docker Compose (optional)

### Using Docker (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd voucher-redeem-merncp-a9b115

# Start all services with Docker Compose
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3030
# MongoDB: localhost:27017
```

### Manual Installation
```bash
# Clone the repository
git clone <repository-url>
cd voucher-redeem-merncp-a9b115

# Install backend dependencies
cd nodejs-backend
npm install

# Install frontend dependencies
cd ../react-frontend
npm install

# Start MongoDB (if not running)
mongod

# Start backend server
cd ../nodejs-backend
npm run dev

# Start frontend development server
cd ../react-frontend
npm start
```

## ⚙️ Installation

### 1. Backend Setup

```bash
cd nodejs-backend

# Install dependencies
npm install

# Copy environment file
cp .env_example .env

# Configure environment variables
# Edit .env file with your settings

# Initialize database
npm run setup

# Start development server
npm run dev
```

### 2. Frontend Setup

```bash
cd react-frontend

# Install dependencies
npm install

# Copy environment file
cp .env_example .env

# Configure environment variables
# Edit .env file with your settings

# Start development server
npm start
```

### 3. Mobile App Setup

```bash
cd flutter-dart

# Install Flutter dependencies
flutter pub get

# Run on connected device or emulator
flutter run
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
MONGODB_URL=mongodb://localhost:27017/voucher-redeem-merncp

# Server
PORT=3030
NODE_ENV=development

# Authentication
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d

# AI Integration
OLLAMA_BASE_URL=http://localhost:11434
AI_MODEL=qwen2.5:7b

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Redis (optional)
REDIS_URL=redis://localhost:6379
```

#### Frontend (.env)
```env
# API Configuration
REACT_APP_API_URL=http://localhost:3030
REACT_APP_WS_URL=ws://localhost:3030

# App Configuration
REACT_APP_APP_NAME=Voucher Redemption System
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_AI_CHAT=true
REACT_APP_ENABLE_PDF_EXPORT=true
```

### Database Setup

```bash
# Connect to MongoDB
mongosh

# Create database
use voucher-redeem-merncp

# Create admin user
db.users.insertOne({
  email: "admin@example.com",
  password: "$2a$10$...", // bcrypt hashed password
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```

## 📖 Usage

### Admin Interface

1. **Login**: Access admin panel at `/admin`
2. **Dashboard**: View system overview and statistics
3. **User Management**: Manage customer accounts
4. **Voucher Management**: Create and manage vouchers
5. **Reports**: Generate and export reports
6. **Settings**: Configure system parameters

### Customer Interface

1. **Registration/Login**: Create account or login
2. **Browse Vouchers**: View available vouchers
3. **Add to Cart**: Select vouchers for redemption
4. **Checkout**: Complete redemption process
5. **Account**: Manage profile and view history
6. **Support**: Access AI chat support

### AI Chat System

1. **Customer Mode**: Get help with vouchers and redemption
2. **Admin Mode**: Access customer information and support tools
3. **Quick Responses**: Use pre-configured answer templates
4. **Context Awareness**: Maintains conversation history

## 🔌 API Documentation

### Authentication Endpoints

```http
POST /authentication
POST /authentication/logout
POST /users
GET /users/:id
PATCH /users/:id
DELETE /users/:id
```

### Voucher Endpoints

```http
GET /vouchers
POST /vouchers
GET /vouchers/:id
PATCH /vouchers/:id
DELETE /vouchers/:id
```

### Cart Endpoints

```http
GET /cartitems
POST /cartitems
PATCH /cartitems/:id
DELETE /cartitems/:id
```

### Transaction Endpoints

```http
GET /cartitemhistory
POST /cartitemhistory
GET /cartitemhistory/:id
```

### AI Chat Endpoints

```http
POST /ai-chat
GET /ai-chat/history
DELETE /ai-chat/history
```

## 🛠️ Development

### Code Structure

#### Backend Development
```bash
cd nodejs-backend

# Run in development mode
npm run dev

# Run tests
npm test

# Format code
npm run format

# Lint code
npm run lint
```

#### Frontend Development
```bash
cd react-frontend

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Format code
npm run format
```

### Adding New Features

1. **Backend**: Add models, services, and routes
2. **Frontend**: Create components and integrate with API
3. **Documentation**: Update guides and API documentation
4. **Testing**: Add unit and integration tests

### Code Style Guidelines

- **Backend**: Follow ESLint configuration
- **Frontend**: Use Prettier for formatting
- **Documentation**: Use Markdown with clear structure
- **Commits**: Use conventional commit messages

## 🧪 Testing

### Backend Testing
```bash
cd nodejs-backend

# Run all tests
npm test

# Run specific test file
npm test -- test/services/voucher.test.js

# Run with coverage
npm run test:coverage
```

### Frontend Testing
```bash
cd react-frontend

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

### Integration Testing
```bash
# Run API integration tests
cd nodejs-backend
npm run test:integration

# Run end-to-end tests
npm run test:e2e
```

## 🚀 Deployment

### Production Build

#### Backend Deployment
```bash
cd nodejs-backend

# Build for production
npm run build

# Start production server
npm start

# Using PM2
pm2 start ecosystem.config.js
```

#### Frontend Deployment
```bash
cd react-frontend

# Build for production
npm run build

# Serve static files
npx serve -s build -l 3000
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.prod.yaml up -d

# Scale services
docker-compose up -d --scale api=3
```

### Environment-Specific Builds
```bash
# Development
npm run build:dev

# Staging
npm run build:stg

# Production
npm run build:prod
```

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check connection string
echo $MONGODB_URL
```

#### Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :3000
netstat -tulpn | grep :3030

# Kill process using port
kill -9 <PID>
```

#### AI Chat Issues
```bash
# Check Ollama status
curl http://localhost:11434/api/tags

# Restart Ollama
sudo systemctl restart ollama

# Check model availability
ollama list
```

### Debug Mode

#### Backend Debug
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check logs
tail -f logs/app.log
```

#### Frontend Debug
```bash
# Enable React DevTools
# Install React Developer Tools browser extension

# Enable Redux DevTools
# Install Redux DevTools browser extension
```

### Performance Issues

#### Database Optimization
```bash
# Create indexes
db.vouchers.createIndex({ "code": 1 })
db.users.createIndex({ "email": 1 })

# Check query performance
db.vouchers.find().explain("executionStats")
```

#### Frontend Optimization
```bash
# Analyze bundle size
npm run build -- --analyze

# Check for memory leaks
# Use React DevTools Profiler
```

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Document** your changes
6. **Submit** a pull request

### Code Review Process

1. **Automated Tests**: All tests must pass
2. **Code Quality**: Linting and formatting checks
3. **Documentation**: Update relevant documentation
4. **Manual Review**: Code review by maintainers

### Contribution Guidelines

- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation
- Ensure backward compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

### Documentation
- **Guides**: Check `docs/guides/` for detailed guides
- **API Reference**: See API documentation above
- **Troubleshooting**: Review troubleshooting section

### Community
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join GitHub Discussions
- **Wiki**: Check project wiki for additional resources

### Contact
- **Email**: danielhzq@gmail.com
- **GitHub**: [Project Repository](https://github.com/your-username/voucher-redeem-merncp)

---

**Built with ❤️ using the MERN Stack**

*Last updated: December 2024* 