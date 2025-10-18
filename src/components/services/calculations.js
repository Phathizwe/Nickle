import { 
    collection, 
    addDoc, 
    getDocs, 
    getDoc,
    doc, 
    query, 
    where,
    orderBy,
    limit,
    serverTimestamp,
    updateDoc,
    deleteDoc
  } from 'firebase/firestore';
  import { db } from '../../lib/firebase';
  
  export const saveCalculation = async (userId, type, data, name = '') => {
    try {
      const calculationData = {
        userId,
        type,
        name: name || `${type} calculation - ${new Date().toLocaleString()}`,
        data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
  
      const docRef = await addDoc(collection(db, 'calculations'), calculationData);
      return docRef.id;
    } catch (error) {
      console.error('Error saving calculation:', error);
      throw error;
    }
  };
  
  export const getCalculations = async (userId, type = null, limitCount = 50) => {
    try {
      let q = query(
        collection(db, 'calculations'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
  
      if (type) {
        q = query(q, where('type', '==', type));
      }
  
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
    } catch (error) {
      console.error('Error getting calculations:', error);
      throw error;
    }
  };
  
  export const getCalculation = async (id) => {
    try {
      const docRef = doc(db, 'calculations', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting calculation:', error);
      throw error;
    }
  };
  
  export const updateCalculation = async (id, data) => {
    try {
      const docRef = doc(db, 'calculations', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating calculation:', error);
      throw error;
    }
  };
  
  export const deleteCalculation = async (id) => {
    try {
      await deleteDoc(doc(db, 'calculations', id));
    } catch (error) {
      console.error('Error deleting calculation:', error);
      throw error;
    }
  };