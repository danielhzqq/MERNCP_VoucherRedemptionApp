const { MongoClient } = require('mongodb');

// Generate a unique voucher code
const generateUniqueVoucherCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  // Generate a 12-character code for better uniqueness
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Add timestamp prefix for additional uniqueness
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${timestamp}-${result}`;
};

// Generate multiple unique voucher codes
const generateMultipleUniqueVoucherCodes = (count) => {
  const codes = [];
  for (let i = 0; i < count; i++) {
    codes.push(generateUniqueVoucherCode());
  }
  return codes;
};

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = 'mongodb://localhost:27017/voucher-redeem-merncp';

async function runVoucherCodeMigration() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const cartitemhistoryCollection = db.collection('cartitemhistory');
    
    // Find all records that don't have a voucherCode
    const recordsWithoutVoucherCode = await cartitemhistoryCollection.find({
      voucherCode: { $exists: false }
    }).toArray();
    
    console.log(`Found ${recordsWithoutVoucherCode.length} records without voucher codes`);
    
    if (recordsWithoutVoucherCode.length === 0) {
      console.log('All records already have voucher codes. No migration needed.');
      return;
    }
    
    // Generate unique voucher codes for all records
    const voucherCodes = generateMultipleUniqueVoucherCodes(recordsWithoutVoucherCode.length);
    
    console.log('Generated voucher codes:', voucherCodes);
    
    // Update each record with a unique voucher code
    for (let i = 0; i < recordsWithoutVoucherCode.length; i++) {
      const record = recordsWithoutVoucherCode[i];
      const voucherCode = voucherCodes[i];
      
      await cartitemhistoryCollection.updateOne(
        { _id: record._id },
        { $set: { voucherCode: voucherCode } }
      );
      
      console.log(`Updated record ${record._id} with voucher code: ${voucherCode}`);
    }
    
    console.log('Migration completed successfully!');
    
    // Verify the migration
    const recordsStillWithoutVoucherCode = await cartitemhistoryCollection.find({
      voucherCode: { $exists: false }
    }).toArray();
    
    console.log(`Records still without voucher codes: ${recordsStillWithoutVoucherCode.length}`);
    
    // Show some updated records
    const updatedRecords = await cartitemhistoryCollection.find({
      voucherCode: { $exists: true }
    }).limit(5).toArray();
    
    console.log('\nSample updated records:');
    updatedRecords.forEach((record, index) => {
      console.log(`Record ${index + 1}:`, {
        _id: record._id,
        voucherCode: record.voucherCode,
        voucherId: record.voucherId,
        quantity: record.quantity
      });
    });
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
runVoucherCodeMigration(); 