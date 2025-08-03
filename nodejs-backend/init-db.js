const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Load models
const categoryModel = require('./src/models/catergory.model');
const voucherModel = require('./src/models/voucher.model');
const userModel = require('./src/models/users.model');
const cartItemModel = require('./src/models/cartitems.model');
const cartItemHistoryModel = require('./src/models/cartitemhistory.model');

// Sample data for categories
const sampleCategories = [
  { name: 'Travel' },
  { name: 'Dining' },
  { name: 'Electronics' },
  { name: 'Experiences' },
  { name: 'Fashion' },
  { name: 'Entertainment' },
  { name: 'Shopping' },
];

// Sample data for vouchers
const sampleVouchers = [
  {
    title: "Weekend Getaway Package",
    points: 75000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZQR8_1iqHyvPuug8nwb02iHeRHfmGFZkHklr3uFAmd0tKQtKL8PiTI3WGVzpnmZoqZntasEVCTlay8VPhlDjaa8ftsTCqbS02vMdxtmNZAupQIq9CidrfwyWCIxvyx7kz51KUsHoBeh_bF9amhwqmYvvnB_hLIHIUXdOmqKDAVnbfak5IN0OLB5n7qaz6YZnveEYRHAbvTB3rnOwoV9jeymZCRFXb7rBsmTyPcRfSzT7mlxlO_zXGQCfHpGuGeCX7Q83BLUiYKVA",
    description: "Escape for a luxurious weekend with premium hotel accommodations, spa treatments, and fine dining experiences.",
    termsAndCondition: "Valid for 12 months from date of redemption. Subject to availability. Cannot be combined with other offers. Non-transferable and non-refundable. Blackout dates may apply.",
    isLatest: true,
  },
  {
    title: "Fine Dining Experience",
    points: 25000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCejaRYSpJsq4C0fsVgelCNKzh07mRvrnMBH_M2KaAzU37aBigsvh9yn6GiVE1o0pc031WlbbeRThR_tRNDAofYeqpC7HjuXTru6GMeKMuOtd7cp6Fh2FQ6h6kJAx2EOOIXF7vuvy2qRCT5ReA1FejFfSE9j-pkis7W9W-9nmAy3MtV-EpXHJ7gPhu6eYbWJGx49g2TdLmhrIy2HIQSiBlSmApoXVLPVxulRqCRc-aDdTinMgIQ6eDRx5keRkVoEFtZgpgyNO3z5cs",
    description: "Enjoy an exquisite dining experience at a top-rated restaurant with a multi-course meal and wine pairing.",
    termsAndCondition: "Valid for 6 months from date of redemption. Reservation required. Subject to restaurant availability. Dress code may apply.",
    isLatest: true,
  },
  {
    title: "Latest Headphones",
    points: 15000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwUNJ7-SkDpu5p8SN6UzJwKGSfIkWM92NLRxpZyvYwnvNG8pMqMETci3EW_Y-aEbwoFdkN7NOR1FC1vZ8QwABUisttbj3qznKNkwydgYi_R6OawpXG5zzJM6rxm5hVegxiHxMVYVdC-VMOeCS86xUomM17xVUxLd_9ZytgIzl63p7up95WdIWqg_v0LfXa9GKxEQ8xAxxQWz-HDK64Oav1ml3H6e5e0jfZLfKqI-Y3ySUqHtDuWVaTOFAmFtcJgPOz_PnLVSWDfLA",
    description: "Get the latest wireless noise-canceling headphones with premium sound quality and long battery life.",
    termsAndCondition: "Valid for 3 months from date of redemption. While supplies last. Non-refundable. Warranty applies.",
    isLatest: true,
  },
  {
    title: "Adventure Package",
    points: 40000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCnE9uU9SlEa2YPGh6k31akLLzKga9jT7jcMj-0shCeFdtLLL_GiuoxIj4Qc4Pgkqoql8kjGC-tg2HMv2Q8PqF5IyytOGNtLHq4zbUT5mlQecTz3JlEtJv11yVdGz3SYuNKN0WAEpFD7NgSBEj5VNmG0QELM2-WHpIVWBfIE-G5tGkl1TNmjyfPhs5TdRizqxQG3fC9cdH91-WKCp-YS4JqhyJqwEMeqO0wd7obU_YZVPq4P2fEsObNdYbiB3ejtPzt0bCZUtsAjk",
    description: "Experience thrilling outdoor adventures including hiking, zip-lining, and rock climbing.",
    termsAndCondition: "Valid for 12 months from date of redemption. Weather dependent. Safety equipment provided. Age restrictions may apply.",
    isLatest: false,
  },
  {
    title: "Luxury Spa Day",
    points: 30000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDu-Tau83my1osArjo_FF1aCSLDg6UVN-hENyFrmQ9tq4_Sja2pZYvkAcTQSkhhqvVOYJOS23J2Y_l-VxAbh8AKTY6rL5VzSgPdMJXI8xfi9b780HgWIjqOe0EtXmhr8nA3EFbYBdqUhk74ltHnF0blLNoi5DQfFI29manz9bqWZWWWeE-lcIFP2iQi3FcH7pYN034EixwtIV4DkOsHRtsqLLRTlIlm2Y5z8h2VujXyEsPcRRj5-2-q-A6n2ZJu4wMrb8jvwyB8Aao",
    description: "Relax and rejuvenate with a full day of luxury spa treatments including massage, facial, and body treatments.",
    termsAndCondition: "Valid for 6 months from date of redemption. Appointment required. Subject to spa availability. 24-hour cancellation policy.",
    isLatest: true,
  },
];

// Sample data for users
const sampleUsers = [
  {
    email: "john.doe@example.com",
    username: "johndoe",
    phoneNumber: "+1 (555) 123-4567",
    password: "password123",
    profileImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIbNg18nVN0zfD56mBuRPLGIvQCsNh6eYYeHqcARSFbGal4mNFkL2TApbK95ChG1QN3Iti1sRUa-S5-7Q_3aTOzH6tfdcLUqch1CJfxZ4sYJZxka-UAGSG8ijXfcrlD0GrOjOzg3Hpqa32_8h1MxXeKi02FfRLOCMHRSzh8S-cctjjRLRJKJA1g3fEh9z0GEgPXgYDXTmGVgbFGxqiiGa3APBdzGIFepppDnwNk-wG8KCVVNAriFu9N0OsB0AAzNo8M_njbRq9LIU",
    isActive: true,
    points: 125000,
    address: "123 Main Street, Anytown, USA 12345",
    aboutMe: "Passionate about travel and trying new experiences.",
  },
  {
    email: "jane.smith@example.com",
    username: "janesmith",
    phoneNumber: "+1 (555) 987-6543",
    password: "password123",
    profileImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIbNg18nVN0zfD56mBuRPLGIvQCsNh6eYYeHqcARSFbGal4mNFkL2TApbK95ChG1QN3Iti1sRUa-S5-7Q_3aTOzH6tfdcLUqch1CJfxZ4sYJZxka-UAGSG8ijXfcrlD0GrOjOzg3Hpqa32_8h1MxXeKi02FfRLOCMHRSzh8S-cctjjRLRJKJA1g3fEh9z0GEgPXgYDXTmGVgbFGxqiiGa3APBdzGIFepppDnwNk-wG8KCVVNAriFu9N0OsB0AAzNo8M_njbRq9LIU",
    isActive: true,
    points: 85000,
    address: "456 Oak Avenue, Somewhere, USA 54321",
    aboutMe: "Food enthusiast and adventure seeker.",
  },
];

async function initializeDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
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
    
    // Clear existing data
    await Category.deleteMany({});
    await Voucher.deleteMany({});
    await User.deleteMany({});
    await CartItem.deleteMany({});
    await CartItemHistory.deleteMany({});
    
    console.log('✅ Cleared existing data');
    
    // Create categories
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log(`✅ Created ${createdCategories.length} categories`);
    
    // Create vouchers with category references
    const vouchersWithCategories = sampleVouchers.map((voucher, index) => ({
      ...voucher,
      categoryId: createdCategories[index % createdCategories.length]._id,
      createdBy: null, // Will be set when we create users
      updatedBy: null,
    }));
    
    const createdVouchers = await Voucher.insertMany(vouchersWithCategories);
    console.log(`✅ Created ${createdVouchers.length} vouchers`);
    
    // Hash passwords and create users
    const usersWithHashedPasswords = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
        createdBy: null,
        updatedBy: null,
      }))
    );
    
    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ Created ${createdUsers.length} users`);
    
    // Update vouchers with user references
    await Voucher.updateMany(
      {},
      { 
        createdBy: createdUsers[0]._id,
        updatedBy: createdUsers[0]._id
      }
    );
    
    // Create some sample cart items
    const sampleCartItems = [
      {
        voucherId: createdVouchers[0]._id,
        userId: createdUsers[0]._id,
        quantity: 2,
        createdBy: createdUsers[0]._id,
        updatedBy: createdUsers[0]._id,
      },
      {
        voucherId: createdVouchers[1]._id,
        userId: createdUsers[0]._id,
        quantity: 1,
        createdBy: createdUsers[0]._id,
        updatedBy: createdUsers[0]._id,
      },
    ];
    
    await CartItem.insertMany(sampleCartItems);
    console.log('✅ Created sample cart items');
    
    // Create some sample cart item history
    const sampleCartItemHistory = [
      {
        voucherId: createdVouchers[2]._id,
        userId: createdUsers[0]._id,
        quantity: 1,
        completedDate: new Date(),
        createdBy: createdUsers[0]._id,
        updatedBy: createdUsers[0]._id,
      },
      {
        voucherId: createdVouchers[3]._id,
        userId: createdUsers[1]._id,
        quantity: 1,
        completedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        createdBy: createdUsers[1]._id,
        updatedBy: createdUsers[1]._id,
      },
    ];
    
    await CartItemHistory.insertMany(sampleCartItemHistory);
    console.log('✅ Created sample cart item history');
    
    console.log('🎉 Database initialization completed successfully!');
    console.log('\n📊 Database Summary:');
    console.log(`   Categories: ${createdCategories.length}`);
    console.log(`   Vouchers: ${createdVouchers.length}`);
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Cart Items: ${sampleCartItems.length}`);
    console.log(`   Cart Item History: ${sampleCartItemHistory.length}`);
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase(); 