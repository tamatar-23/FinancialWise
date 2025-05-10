import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useOpenAI } from '../contexts/OpenAIContext';
import { calculateFinancialScore } from '../services/openai';
import { saveFinancialScore } from '../lib/dataRepository';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

const Score = () => {
  const { currentUser } = useAuth();
  const { apiKey, isKeySet } = useOpenAI();
  const navigate = useNavigate();
  
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [savings, setSavings] = useState<number>(0);
  const [debt, setDebt] = useState<number>(0);
  const [investments, setInvestments] = useState<number>(0);
  const [emergencyFund, setEmergencyFund] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [scoreResult, setScoreResult] = useState<any>(null);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isKeySet) {
      toast.error("AI service is currently unavailable");
      return;
    }
    
    if (income <= 0) {
      toast.error("Income must be greater than zero");
      return;
    }
    
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
  
  // Get score category color
  const getScoreColor = (category: string) => {
    switch (category) {
      case 'Poor': return 'text-score-poor';
      case 'Fair': return 'text-score-fair';
      case 'Good': return 'text-score-good';
      case 'Excellent': return 'text-score-excellent';
      default: return '';
    }
  };
  
  // Get score background gradient
  const getScoreGradient = (category: string) => {
    switch (category) {
      case 'Poor': return 'bg-gradient-to-r from-score-poor/30 to-score-poor/10';
      case 'Fair': return 'bg-gradient-to-r from-score-fair/30 to-score-fair/10';
      case 'Good': return 'bg-gradient-to-r from-score-good/30 to-score-good/10';
      case 'Excellent': return 'bg-gradient-to-r from-score-excellent/30 to-score-excellent/10';
      default: return 'bg-secondary';
    }
  };
  
  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6">Financial Health Score Calculator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {!scoreResult ? (
          <Card>
            <CardHeader>
              <CardTitle>Calculate Your Financial Score</CardTitle>
              <CardDescription>
                Enter your financial details to assess your overall financial health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="income">Monthly Income ($)</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="0.00"
                    value={income || ''}
                    onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expenses">Monthly Expenses ($)</Label>
                  <Input
                    id="expenses"
                    type="number"
                    placeholder="0.00"
                    value={expenses || ''}
                    onChange={(e) => setExpenses(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="savings">Monthly Savings ($)</Label>
                  <Input
                    id="savings"
                    type="number"
                    placeholder="0.00"
                    value={savings || ''}
                    onChange={(e) => setSavings(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="debt">Total Debt ($)</Label>
                  <Input
                    id="debt"
                    type="number"
                    placeholder="0.00"
                    value={debt || ''}
                    onChange={(e) => setDebt(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="investments">Total Investments ($)</Label>
                  <Input
                    id="investments"
                    type="number"
                    placeholder="0.00"
                    value={investments || ''}
                    onChange={(e) => setInvestments(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergency">Emergency Fund ($)</Label>
                  <Input
                    id="emergency"
                    type="number"
                    placeholder="0.00"
                    value={emergencyFund || ''}
                    onChange={(e) => setEmergencyFund(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full mt-4" disabled={loading || !isKeySet}>
                  {loading ? 'Calculating Score...' : 'Calculate Financial Score'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className={getScoreGradient(scoreResult.category)}>
              <CardTitle>Your Financial Health Score</CardTitle>
              <CardDescription>
                Assessment of your overall financial health
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center">
                  <div className="relative">
                    <svg className="w-36 h-36">
                      <circle
                        cx="68"
                        cy="68"
                        r="60"
                        fill="none"
                        stroke="#e6e6e6"
                        strokeWidth="12"
                      />
                      <circle
                        cx="68"
                        cy="68"
                        r="60"
                        fill="none"
                        stroke={
                          scoreResult.category === 'Poor' ? '#FF6B6B' :
                          scoreResult.category === 'Fair' ? '#FFA500' :
                          scoreResult.category === 'Good' ? '#4ECDC4' : '#3A86FF'
                        }
                        strokeWidth="12"
                        strokeDasharray={`${(scoreResult.score / 100) * 377} 377`}
                        strokeLinecap="round"
                        transform="rotate(-90 68 68)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-4xl font-bold">{scoreResult.score}</span>
                      <span className={`text-lg font-medium ${getScoreColor(scoreResult.category)}`}>
                        {scoreResult.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Component Scores</h3>
                  <div className="space-y-2">
                    {Object.entries(scoreResult.breakdown).map(([key, value]: [string, any]) => {
                      const label = key.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ');
                      
                      return (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between items-center text-sm">
                            <span>{label}</span>
                            <span className="font-medium">{value}/100</span>
                          </div>
                          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-primary" 
                              style={{ width: `${value}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Financial Strengths</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {scoreResult.analysis.strengths.map((strength: string, index: number) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Areas to Improve</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {scoreResult.analysis.weaknesses.map((weakness: string, index: number) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {scoreResult.recommendations.map((recommendation: string, index: number) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={() => setScoreResult(null)} 
                className="w-full sm:w-auto"
              >
                Calculate Again
              </Button>
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="w-full sm:w-auto"
              >
                View Dashboard
              </Button>
            </CardFooter>
          </Card>
        )}
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Understanding Your Financial Health Score</CardTitle>
              <CardDescription>Learn how your score is calculated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">How It Works</h3>
                <p className="text-sm">
                  Your Financial Health Score is calculated using a proprietary algorithm that assesses various aspects of your financial situation. The score ranges from 0 to 100, with higher scores indicating better financial health.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-score-poor/10 rounded-md">
                  <p className="font-medium text-score-poor">Poor (0-25)</p>
                  <p className="text-sm mt-1">
                    High debt, minimal savings, no emergency fund
                  </p>
                </div>
                
                <div className="p-3 bg-score-fair/10 rounded-md">
                  <p className="font-medium text-score-fair">Fair (26-50)</p>
                  <p className="text-sm mt-1">
                    Managing debts, small savings, some planning
                  </p>
                </div>
                
                <div className="p-3 bg-score-good/10 rounded-md">
                  <p className="font-medium text-score-good">Good (51-75)</p>
                  <p className="text-sm mt-1">
                    Controlled debt, healthy savings, emergency fund
                  </p>
                </div>
                
                <div className="p-3 bg-score-excellent/10 rounded-md">
                  <p className="font-medium text-score-excellent">Excellent (76-100)</p>
                  <p className="text-sm mt-1">
                    Low debt, robust savings, diversified investments
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Score Components</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Savings Score: Evaluates your savings habits relative to income</li>
                  <li>Debt Score: Measures your debt burden compared to income</li>
                  <li>Emergency Fund Score: Assesses if you have adequate emergency savings</li>
                  <li>Investment Score: Reviews your investment strategy and portfolio</li>
                  <li>Expense Ratio Score: Examines your expense-to-income ratio</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tips to Improve Your Score</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <div className="bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">1</div>
                  <div>
                    <p className="font-medium">Build an Emergency Fund</p>
                    <p className="text-sm text-muted-foreground">Aim for 3-6 months of essential expenses.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">2</div>
                  <div>
                    <p className="font-medium">Reduce High-Interest Debt</p>
                    <p className="text-sm text-muted-foreground">Focus on paying down credit cards and personal loans first.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">3</div>
                  <div>
                    <p className="font-medium">Increase Savings Rate</p>
                    <p className="text-sm text-muted-foreground">Try to save at least 20% of your income.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">4</div>
                  <div>
                    <p className="font-medium">Diversify Investments</p>
                    <p className="text-sm text-muted-foreground">Spread your investments across different asset classes.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">5</div>
                  <div>
                    <p className="font-medium">Optimize Expenses</p>
                    <p className="text-sm text-muted-foreground">Review and reduce unnecessary spending regularly.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Score;
