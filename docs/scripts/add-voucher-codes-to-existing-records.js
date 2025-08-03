const { MongoClient } = require('mongodb');
const { generateMultipleUniqueVoucherCodes } = require('./react-frontend/src/utils/voucherCodeGenerator.js');

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = 'mongodb://localhost:27017/voucher-redeem-merncp';

async function addVoucherCodesToExistingRecords() {
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
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
addVoucherCodesToExistingRecords(); 