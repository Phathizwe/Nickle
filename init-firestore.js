const admin = require('firebase-admin');
const serviceAccount = require('./path/to/your/serviceAccountKey.json'); // You'll need to download this from Firebase console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Create a sample document in each collection to initialize them
async function initializeCollections() {
  try {
    // Initialize goals collection
    await db.collection('goals').doc('sample-goal').set({
      name: 'Sample Goal',
      targetAmount: 10000,
      currentAmount: 0,
      targetDate: admin.firestore.Timestamp.fromDate(new Date('2023-12-31')),
      userId: 'sample-user',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('Goals collection initialized');

    // Initialize bills collection
    await db.collection('bills').doc('sample-bill').set({
      name: 'Sample Bill',
      amount: 1000,
      dueDate: admin.firestore.Timestamp.fromDate(new Date('2023-05-15')),
      paid: false,
      userId: 'sample-user',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('Bills collection initialized');

    // Initialize transactions collection
    await db.collection('transactions').doc('sample-transaction').set({
      description: 'Sample Transaction',
      amount: -500,
      date: admin.firestore.Timestamp.fromDate(new Date()),
      category: 'Food',
      userId: 'sample-user',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('Transactions collection initialized');

    console.log('All collections initialized successfully');
  } catch (error) {
    console.error('Error initializing collections:', error);
  } finally {
    process.exit();
  }
}

initializeCollections();
