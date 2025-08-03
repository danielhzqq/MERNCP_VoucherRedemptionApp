const mongoose = require('mongoose');
require('dotenv').config();

// Load models
const categoryModel = require('./src/models/catergory.model');
const voucherModel = require('./src/models/voucher.model');
const userModel = require('./src/models/users.model');
const cartItemModel = require('./src/models/cartitems.model');
const cartItemHistoryModel = require('./src/models/cartitemhistory.model');

async function testDatabaseConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/voucher-redeem-merncp');
    console.log('✅ Connected to MongoDB successfully!');
    
    // Create a mock app object to register models
    const mockApp = {
      get: (key) => {
        if (key === 'mongooseClient') return mongoose;
        return null;
      }
    };
    
    // Register models
    const Category = categoryModel(mockApp);
    const Voucher = voucherModel(mockApp);
    const User = userModel(mockApp);
    const CartItem = cartItemModel(mockApp);
    const CartItemHistory = cartItemHistoryModel(mockApp);
    
    console.log('✅ Models registered successfully!');
    
    // Count documents in each collection
    const categoryCount = await Category.countDocuments();
    const voucherCount = await Voucher.countDocuments();
    const userCount = await User.countDocuments();
    const cartItemCount = await CartItem.countDocuments();
    const cartItemHistoryCount = await CartItemHistory.countDocuments();
    
    console.log('\n📊 Database Status:');
    console.log(`   Categories: ${categoryCount}`);
    console.log(`   Vouchers: ${voucherCount}`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Cart Items: ${cartItemCount}`);
    console.log(`   Cart Item History: ${cartItemHistoryCount}`);
    
    if (categoryCount === 0) {
      console.log('\n⚠️  Database appears to be empty. Run the application to initialize it.');
    } else {
      console.log('\n✅ Database is populated and ready!');
    }
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error testing database connection:', error);
    process.exit(1);
  }
}

testDatabaseConnection(); 