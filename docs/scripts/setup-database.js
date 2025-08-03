#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔧 VoucherApp Database Setup Script\n');

// Check if we're in the right directory
const packageJsonPath = path.join(__dirname, 'nodejs-backend', 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: Please run this script from the project root directory');
  process.exit(1);
}

// Function to check if a port is in use
function checkPort(port) {
  return new Promise((resolve) => {
    const net = require('net');
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => resolve(false));
      server.close();
    });
    server.on('error', () => resolve(true));
  });
}

// Function to check if MongoDB is running
async function checkMongoDB() {
  console.log('🔍 Checking MongoDB connection...');
  
  try {
    const net = require('net');
    return new Promise((resolve) => {
      const client = new net.Socket();
      client.setTimeout(5000);
      
      client.on('connect', () => {
        console.log('✅ MongoDB is running on localhost:27017');
        client.destroy();
        resolve(true);
      });
      
      client.on('timeout', () => {
        console.log('❌ MongoDB connection timeout');
        client.destroy();
        resolve(false);
      });
      
      client.on('error', () => {
        console.log('❌ MongoDB is not running on localhost:27017');
        client.destroy();
        resolve(false);
      });
      
      client.connect(27017, 'localhost');
    });
  } catch (error) {
    console.log('❌ Error checking MongoDB:', error.message);
    return false;
  }
}

// Function to check if Docker is available
async function checkDocker() {
  return new Promise((resolve) => {
    const dockerProcess = spawn('docker', ['--version'], { stdio: 'pipe' });
    dockerProcess.on('close', (code) => {
      resolve(code === 0);
    });
  });
}

// Function to start MongoDB with Docker
async function startMongoDBWithDocker() {
  console.log('🐳 Starting MongoDB with Docker...');
  
  return new Promise((resolve, reject) => {
    const dockerProcess = spawn('docker-compose', ['up', '-d', 'db'], {
      cwd: __dirname,
      stdio: 'inherit'
    });
    
    dockerProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ MongoDB started successfully with Docker');
        resolve(true);
      } else {
        console.log('❌ Failed to start MongoDB with Docker');
        reject(new Error('Docker command failed'));
      }
    });
  });
}

// Function to install dependencies
async function installDependencies() {
  console.log('📦 Installing backend dependencies...');
  
  return new Promise((resolve, reject) => {
    const npmProcess = spawn('npm', ['install'], {
      cwd: path.join(__dirname, 'nodejs-backend'),
      stdio: 'inherit'
    });
    
    npmProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Backend dependencies installed');
        resolve(true);
      } else {
        console.log('❌ Failed to install backend dependencies');
        reject(new Error('npm install failed'));
      }
    });
  });
}

// Function to start the backend server
async function startBackend() {
  console.log('🚀 Starting backend server...');
  
  return new Promise((resolve, reject) => {
    const backendProcess = spawn('node', ['start-backend.js'], {
      cwd: __dirname,
      stdio: 'inherit',
      env: {
        ...process.env,
        MONGODB_URL: 'mongodb://localhost:27017/voucher-redeem-merncp',
        MAIL_MAILER: 'smtp',
        MAIL_HOST: 'smtp.mailtrap.io',
        MAIL_PORT: '2525',
        MAIL_USERNAME: 'test@example.com',
        MAIL_PASSWORD: 'password',
        MAIL_ENCRYPTION: 'tls'
      }
    });
    
    backendProcess.on('error', (error) => {
      console.error('❌ Failed to start backend:', error.message);
      reject(error);
    });
    
    // Give the server some time to start
    setTimeout(() => {
      console.log('✅ Backend server started successfully');
      resolve(true);
    }, 5000);
  });
}

// Main setup function
async function setupDatabase() {
  try {
    // Check if backend dependencies are installed
    const nodeModulesPath = path.join(__dirname, 'nodejs-backend', 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      console.log('📦 Backend dependencies not found, installing...');
      await installDependencies();
    }
    
    // Check if MongoDB is running
    const mongoRunning = await checkMongoDB();
    
    if (!mongoRunning) {
      console.log('\n📋 MongoDB Options:');
      console.log('1. Install MongoDB locally');
      console.log('2. Use Docker (if available)');
      console.log('3. Use MongoDB Atlas (cloud)');
      
      const dockerAvailable = await checkDocker();
      if (dockerAvailable) {
        console.log('\n🐳 Docker is available. Starting MongoDB with Docker...');
        await startMongoDBWithDocker();
        
        // Wait a bit for MongoDB to start
        console.log('⏳ Waiting for MongoDB to start...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        // Check again
        const mongoNowRunning = await checkMongoDB();
        if (!mongoNowRunning) {
          throw new Error('MongoDB failed to start with Docker');
        }
      } else {
        console.log('\n❌ Docker not available. Please install MongoDB manually:');
        console.log('   Windows: https://docs.mongodb.com/manual/installation/');
        console.log('   Or use MongoDB Atlas: https://www.mongodb.com/atlas');
        process.exit(1);
      }
    }
    
    // Check if backend port is available
    const port3030InUse = await checkPort(3030);
    if (port3030InUse) {
      console.log('⚠️  Port 3030 is already in use. Please stop any existing backend server.');
      process.exit(1);
    }
    
    // Start the backend server
    await startBackend();
    
    console.log('\n🎉 Setup Complete!');
    console.log('📊 MongoDB: Running on localhost:27017');
    console.log('🚀 Backend: Running on http://localhost:3030');
    console.log('🌐 Frontend: Start with "cd react-frontend && npm start"');
    console.log('🔗 Admin Portal: http://localhost:3000/admin/dashboard');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure you have Node.js installed');
    console.log('2. Install MongoDB or Docker');
    console.log('3. Check if ports 27017 and 3030 are available');
    process.exit(1);
  }
}

// Run the setup
setupDatabase(); 