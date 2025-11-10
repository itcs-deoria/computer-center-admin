const mongoose = require('mongoose');
require('dotenv').config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const collection = mongoose.connection.db.collection('students');
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(i => i.name));

    // Drop bad index on payments.receiptNo if it exists
    const badIndex = indexes.find(i => i.name === 'payments.receiptNo_1');
    if (badIndex) {
      await collection.dropIndex('payments.receiptNo_1');
      console.log('🗑️ Dropped index: payments.receiptNo_1');
    } else {
      console.log('ℹ️ No bad index found');
    }

    // Drop any unique email index (optional cleanup)
    const emailIndex = indexes.find(i => i.name === 'email_1');
    if (emailIndex) {
      await collection.dropIndex('email_1');
      console.log('🗑️ Dropped index: email_1');
    }

    console.log('✅ All clean! You can now add students without errors.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
})();
