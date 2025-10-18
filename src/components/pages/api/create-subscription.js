// src/components/pages/api/create-subscription.js
import { db, auth } from '../../../firebase-config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, paymentResult } = req.body;
    
    // Verify user
    const user = auth.currentUser;
    if (!user || user.uid !== userId) {
      throw new Error('Unauthorized');
    }

    // Create subscription record
    const subscriptionRef = doc(db, 'subscriptions', userId);
    const subscriptionData = {
      userId,
      status: 'trialing',
      createdAt: serverTimestamp(),
      trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      amount: 4999,
      currency: 'ZAR',
      plan: 'premium',
      provider: 'yoco',
      paymentId: paymentResult.id,
      cardToken: paymentResult.cardToken,
      lastPaymentDate: serverTimestamp()
    };

    await setDoc(subscriptionRef, subscriptionData);

    res.status(200).json({ 
      subscriptionId: subscriptionRef.id,
      status: 'trialing'
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ 
      error: 'Error creating subscription',
      message: error.message 
    });
  }
}