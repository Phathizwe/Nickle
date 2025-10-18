// src/components/pages/api/yoco-webhook.js
import { db } from '../../../firebase-config';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const event = req.body;
    const { metadata, success } = event;
    
    if (!metadata?.subscriptionId) {
      throw new Error('No subscription ID in metadata');
    }

    const subscriptionRef = doc(db, 'subscriptions', metadata.subscriptionId);
    
    if (success) {
      await updateDoc(subscriptionRef, {
        status: 'active',
        lastPaymentDate: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      await updateDoc(subscriptionRef, {
        status: 'payment_failed',
        lastPaymentAttempt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: error.message });
  }
}