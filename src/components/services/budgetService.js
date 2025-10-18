// src/services/budgetService.js
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc
} from 'firebase/firestore';
import { db } from '../../firebase-config'; // Updated import path

export const budgetService = {
  async getBudgets(userId) {
    if (!userId) {
      console.error('No userId provided to getBudgets');
      throw new Error('User ID is required');
    }

    try {
      console.log('Fetching budgets for user:', userId);
      const budgetsRef = collection(db, 'budgets');
      const q = query(
        budgetsRef,
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(5)
      );
      
      const snapshot = await getDocs(q);
      const budgets = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched budgets:', budgets);
      return budgets;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw new Error(`Failed to fetch budgets: ${error.message}`);
    }
  },

  async saveBudget(userId, budgetData) {
    if (!userId) {
      console.error('No userId provided to saveBudget');
      throw new Error('User ID is required');
    }

    try {
      console.log('Attempting to save budget:', { userId, budgetData });
      
      // Check existing budgets count
      const existingBudgets = await this.getBudgets(userId);
      if (existingBudgets.length >= 5) {
        throw new Error('Maximum budget limit reached (5)');
      }

      // Create a new document reference
      const budgetsRef = collection(db, 'budgets');
      
      // Prepare the budget data
      const budget = {
        ...budgetData,
        userId,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add the document to Firestore
      const docRef = await addDoc(budgetsRef, budget);
      console.log('Budget saved successfully with ID:', docRef.id);

      // Return the saved budget with its ID
      return {
        id: docRef.id,
        ...budget
      };
    } catch (error) {
      console.error('Detailed save error:', error);
      throw new Error(`Failed to save budget: ${error.message}`);
    }
  },

  async deleteBudget(budgetId) {
    if (!budgetId) {
      console.error('No budgetId provided to deleteBudget');
      throw new Error('Budget ID is required');
    }

    try {
      console.log('Deleting budget:', budgetId);
      await deleteDoc(doc(db, 'budgets', budgetId));
      console.log('Budget deleted successfully');
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw new Error(`Failed to delete budget: ${error.message}`);
    }
  },

  async updateBudget(budgetId, updates) {
    if (!budgetId) {
      console.error('No budgetId provided to updateBudget');
      throw new Error('Budget ID is required');
    }

    try {
      console.log('Updating budget:', budgetId, 'Updates:', updates);
      const budget = {
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      const budgetRef = doc(db, 'budgets', budgetId);
      await setDoc(budgetRef, budget, { merge: true });
      console.log('Budget updated successfully');
      return budget;
    } catch (error) {
      console.error('Error updating budget:', error);
      throw new Error(`Failed to update budget: ${error.message}`);
    }
  }
};

export default budgetService;