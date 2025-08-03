const { MongoClient } = require('mongodb');

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = 'mongodb://localhost:27017/voucher-redeem-merncp';

async function testVoucherCodes() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const cartitemhistoryCollection = db.collection('cartitemhistory');
    
    // Find all cartitemhistory records
    const allRecords = await cartitemhistoryCollection.find({}).toArray();
    
    console.log(`Total cartitemhistory records: ${allRecords.length}`);
    
    // Check for records with voucher codes
    const recordsWithVoucherCodes = allRecords.filter(record => record.voucherCode);
    const recordsWithoutVoucherCodes = allRecords.filter(record => !record.voucherCode);
    
    console.log(`Records with voucher codes: ${recordsWithVoucherCodes.length}`);
    console.log(`Records without voucher codes: ${recordsWithoutVoucherCodes.length}`);
    
    // Display sample records with voucher codes
    if (recordsWithVoucherCodes.length > 0) {
      console.log('\nSample records with voucher codes:');
      recordsWithVoucherCodes.slice(0, 5).forEach((record, index) => {
        console.log(`Record ${index + 1}:`, {
          _id: record._id,
          voucherCode: record.voucherCode,
          voucherId: record.voucherId,
          userId: record.userId,
          quantity: record.quantity,
          completedDate: record.completedDate
        });
      });
    }
    
    // Check for duplicate voucher codes
    const voucherCodes = recordsWithVoucherCodes.map(record => record.voucherCode);
    const uniqueVoucherCodes = new Set(voucherCodes);
    
    console.log(`\nVoucher code analysis:`);
    console.log(`Total voucher codes: ${voucherCodes.length}`);
    console.log(`Unique voucher codes: ${uniqueVoucherCodes.size}`);
    console.log(`Duplicate voucher codes: ${voucherCodes.length - uniqueVoucherCodes.size}`);
    
    if (voucherCodes.length !== uniqueVoucherCodes.size) {
      console.log('\nDuplicate voucher codes found:');
      const duplicates = voucherCodes.filter((code, index) => voucherCodes.indexOf(code) !== index);
      const uniqueDuplicates = [...new Set(duplicates)];
      uniqueDuplicates.forEach(duplicateCode => {
        const count = voucherCodes.filter(code => code === duplicateCode).length;
        console.log(`Code "${duplicateCode}" appears ${count} times`);
      });
    }
    
    // Check voucher code format
    console.log('\nVoucher code format analysis:');
    const validFormatCodes = voucherCodes.filter(code => {
      // Check if code matches expected format: timestamp-random12chars
      const pattern = /^[A-Z0-9]+-[A-Z0-9]{12}$/;
      return pattern.test(code);
    });
    
    console.log(`Valid format codes: ${validFormatCodes.length}`);
    console.log(`Invalid format codes: ${voucherCodes.length - validFormatCodes.length}`);
    
    if (validFormatCodes.length < voucherCodes.length) {
      console.log('\nInvalid format codes:');
      voucherCodes.filter(code => {
        const pattern = /^[A-Z0-9]+-[A-Z0-9]{12}$/;
        return !pattern.test(code);
      }).forEach(invalidCode => {
        console.log(`Invalid code: "${invalidCode}"`);
      });
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the test
testVoucherCodes(); 