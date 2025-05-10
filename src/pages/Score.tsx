
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useOpenAI } from '../contexts/OpenAIContext';
import { calculateFinancialScore } from '../services/openai';
import { saveFinancialScore } from '../lib/dataRepository';
import FinancialScoreForm from '../components/score/FinancialScoreForm';
import ScoreResult from '../components/score/ScoreResult';
import ScoreInfo from '../components/score/ScoreInfo';
import { toast } from 'sonner';

const Score = () => {
  const { currentUser } = useAuth();
  const { apiKey, isKeySet } = useOpenAI();
  
  const [loading, setLoading] = useState(false);
  const [scoreResult, setScoreResult] = useState<any>(null);
  
  const handleSubmitScore = async (
    income: number,
    expenses: number,
    savings: number,
    debt: number,
    investments: number,
    emergencyFund: number
  ) => {
    try {
      setLoading(true);
      const score = await calculateFinancialScore(
        income,
        expenses,
        savings,
        debt,
        investments,
        emergencyFund,
        apiKey
      );
      
      if (score) {
        // Add user inputs for reference
        score.user_inputs = {
          income,
          expenses,
          savings,
          debt,
          investments,
          emergencyFund
        };
        
        setScoreResult(score);
        
        // Save to Firestore if user is logged in
        if (currentUser) {
          await saveFinancialScore(currentUser.uid, score);
        }
      }
    } catch (error) {
      console.error('Error calculating financial score:', error);
      toast.error("Failed to calculate financial score");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6">Financial Health Score Calculator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {!scoreResult ? (
          <FinancialScoreForm 
            onSubmit={handleSubmitScore}
            isKeySet={isKeySet}
            loading={loading}
          />
        ) : (
          <ScoreResult 
            scoreResult={scoreResult} 
            onCalculateAgain={() => setScoreResult(null)} 
          />
        )}
        
        <ScoreInfo />
      </div>
    </div>
  );
};

export default Score;
