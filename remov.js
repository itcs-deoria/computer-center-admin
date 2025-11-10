const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    const collection = mongoose.connection.db.collection('students');

    const indexes = await collection.indexes(); // ✅ fixed for new driver
    console.log('Current indexes:', indexes.map(i => i.name));

    // 🔹 Drop payment receipt index if exists
    const paymentIndex = indexes.find(i => i.name === 'payments.receiptNo_1');
    if (paymentIndex) {
      await collection.dropIndex('payments.receiptNo_1');
      console.log('🗑️  Dropped index: payments.receiptNo_1');
    } else {
      console.log('ℹ️  Index payments.receiptNo_1 not found');
    }

    // 🔹 Drop email index if exists
    const emailIndex = indexes.find(i => i.name === 'email_1');
    if (emailIndex) {
      await collection.dropIndex('email_1');
      console.log('🗑️  Dropped index: email_1');
    } else {
      console.log('ℹ️  Index email_1 not found');
    }

    console.log('✅ Done! No more duplicate key issue 🎉');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
