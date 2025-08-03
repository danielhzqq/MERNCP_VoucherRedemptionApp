#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Voucher Redemption Backend Server...\n');

// Check if MongoDB URL is set
const mongodbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/voucher-redeem-merncp';
console.log(`📊 MongoDB URL: ${mongodbUrl}`);

// Set environment variables if not already set
if (!process.env.MONGODB_URL) {
  process.env.MONGODB_URL = mongodbUrl;
}

// Required environment variables for the backend
const requiredEnvVars = {
  MONGODB_URL: mongodbUrl,
  MAIL_MAILER: process.env.MAIL_MAILER || 'smtp',
  MAIL_HOST: process.env.MAIL_HOST || 'smtp.mailtrap.io',
  MAIL_PORT: process.env.MAIL_PORT || '2525',
  MAIL_USERNAME: process.env.MAIL_USERNAME || 'test@example.com',
  MAIL_PASSWORD: process.env.MAIL_PASSWORD || 'password',
  MAIL_ENCRYPTION: process.env.MAIL_ENCRYPTION || 'tls'
};

// Set missing environment variables
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!process.env[key]) {
    process.env[key] = value;
    console.log(`🔧 Set ${key} = ${value}`);
  }
});

console.log('\n📋 Environment Variables Configured:');
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  console.log(`   ${key}: ${value}`);
});

console.log('\n🔄 Starting Node.js Backend Server...');

// Start the backend server
const backendProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'nodejs-backend'),
  stdio: 'inherit',
  env: process.env
});

backendProcess.on('error', (error) => {
  console.error('❌ Failed to start backend server:', error.message);
  console.log('\n💡 Troubleshooting Tips:');
  console.log('   1. Make sure MongoDB is running on localhost:27017');
  console.log('   2. Check if all dependencies are installed: npm install');
  console.log('   3. Verify the nodejs-backend directory exists');
  process.exit(1);
});

backendProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Backend server exited with code ${code}`);
    process.exit(code);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down backend server...');
  backendProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down backend server...');
  backendProcess.kill('SIGTERM');
}); 