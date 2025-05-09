
import { db } from './firebase';
import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { toast } from "sonner";

// Save budget data
export const saveBudgetData = async (userId: string, budgetData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'budgets'), {
      userId,
      ...budgetData,
      createdAt: new Date()
    });
    toast.success("Budget saved successfully");
    return docRef.id;
  } catch (error) {
    console.error("Error saving budget:", error);
    toast.error("Failed to save budget data");
    throw error;
  }
};

// Save investment strategy
export const saveInvestmentStrategy = async (userId: string, strategyData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'investmentStrategies'), {
      userId,
      ...strategyData,
      createdAt: new Date()
    });
    toast.success("Investment strategy saved successfully");
    return docRef.id;
  } catch (error) {
    console.error("Error saving investment strategy:", error);
    toast.error("Failed to save investment strategy");
    throw error;
  }
};

// Save financial health score
export const saveFinancialScore = async (userId: string, scoreData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'financialScores'), {
      userId,
      ...scoreData,
      createdAt: new Date()
    });
    toast.success("Financial score saved successfully");
    return docRef.id;
  } catch (error) {
    console.error("Error saving financial score:", error);
    toast.error("Failed to save financial score");
    throw error;
  }
};

// Get user's latest budget
export const getLatestBudget = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'budgets'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    // Find the most recent budget
    let latestBudget = null;
    let latestDate = new Date(0); // Initialize with oldest possible date
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const budgetDate = data.createdAt.toDate();
      
      if (budgetDate > latestDate) {
        latestDate = budgetDate;
        latestBudget = {
          id: doc.id,
          ...data
        };
      }
    });
    
    return latestBudget;
  } catch (error) {
    console.error("Error getting latest budget:", error);
    toast.error("Failed to retrieve budget data");
    throw error;
  }
};

// Get user's latest investment strategy
export const getLatestInvestmentStrategy = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'investmentStrategies'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    // Find the most recent strategy
    let latestStrategy = null;
    let latestDate = new Date(0);
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const strategyDate = data.createdAt.toDate();
      
      if (strategyDate > latestDate) {
        latestDate = strategyDate;
        latestStrategy = {
          id: doc.id,
          ...data
        };
      }
    });
    
    return latestStrategy;
  } catch (error) {
    console.error("Error getting latest investment strategy:", error);
    toast.error("Failed to retrieve investment strategy");
    throw error;
  }
};

// Get user's latest financial score
export const getLatestFinancialScore = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'financialScores'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    // Find the most recent score
    let latestScore = null;
    let latestDate = new Date(0);
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const scoreDate = data.createdAt.toDate();
      
      if (scoreDate > latestDate) {
        latestDate = scoreDate;
        latestScore = {
          id: doc.id,
          ...data
        };
      }
    });
    
    return latestScore;
  } catch (error) {
    console.error("Error getting latest financial score:", error);
    toast.error("Failed to retrieve financial score");
    throw error;
  }
};
