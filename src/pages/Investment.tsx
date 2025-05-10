import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useOpenAI } from '../contexts/OpenAIContext';
import { generateInvestmentStrategy } from '../services/openai';
import { saveInvestmentStrategy } from '../lib/dataRepository';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Investment = () => {
  const { currentUser } = useAuth();
  const { apiKey, isKeySet } = useOpenAI();
  const navigate = useNavigate();
  
  const [income, setIncome] = useState<number>(0);
  const [savingsAmount, setSavingsAmount] = useState<number>(0);
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(false);
  const [investmentStrategy, setInvestmentStrategy] = useState<any>(null);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isKeySet) {
      toast.error("OpenAI API key not configured. Please contact the administrator.");
      return;
    }
    
    if (income <= 0) {
      toast.error("Income must be greater than zero");
      return;
    }
    
    if (savingsAmount <= 0) {
      toast.error("Monthly savings amount must be greater than zero");
      return;
    }
    
    if (savingsAmount > income) {
      toast.error("Savings amount cannot exceed income");
      return;
    }
    
    try {
      setLoading(true);
      const strategy = await generateInvestmentStrategy(income, savingsAmount, riskTolerance, apiKey);
      
      if (strategy) {
        // Add user inputs for reference
        strategy.user_income = income;
        strategy.user_savings = savingsAmount;
        strategy.user_risk_tolerance = riskTolerance;
        
        setInvestmentStrategy(strategy);
        
        // Save to Firestore if user is logged in
        if (currentUser) {
          await saveInvestmentStrategy(currentUser.uid, strategy);
        }
      }
    } catch (error) {
      console.error('Error generating investment strategy:', error);
      toast.error("Failed to generate investment strategy");
    } finally {
      setLoading(false);
    }
  };
  
  // Determine color based on risk tolerance
  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'text-risk-low';
      case 'medium': return 'text-risk-medium';
      case 'high': return 'text-risk-high';
      default: return '';
    }
  };
  
  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6">Investment Strategy Planner</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Your Investment Strategy</CardTitle>
            <CardDescription>
              Plan your investments based on your financial goals and risk tolerance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="savings">Monthly Amount Available for Savings/Investment ($)</Label>
                <Input
                  id="savings"
                  type="number"
                  placeholder="0.00"
                  value={savingsAmount || ''}
                  onChange={(e) => setSavingsAmount(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="space-y-3">
                <Label>Risk Tolerance</Label>
                <RadioGroup 
                  value={riskTolerance} 
                  onValueChange={(value) => setRiskTolerance(value as 'low' | 'medium' | 'high')}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low-risk" />
                    <Label htmlFor="low-risk" className="text-risk-low font-medium">Low Risk</Label>
                    <span className="text-sm text-muted-foreground ml-2">
                      (Conservative, prioritizes safety)
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium-risk" />
                    <Label htmlFor="medium-risk" className="text-risk-medium font-medium">Medium Risk</Label>
                    <span className="text-sm text-muted-foreground ml-2">
                      (Balanced approach)
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high-risk" />
                    <Label htmlFor="high-risk" className="text-risk-high font-medium">High Risk</Label>
                    <span className="text-sm text-muted-foreground ml-2">
                      (Aggressive, prioritizes growth)
                    </span>
                  </div>
                </RadioGroup>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading || !isKeySet}>
                {loading ? 'Generating Strategy...' : 'Generate Investment Strategy'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {investmentStrategy && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Your Investment Strategy 
                <span className={`ml-2 text-base ${getRiskColor(riskTolerance)}`}>
                  ({riskTolerance.charAt(0).toUpperCase() + riskTolerance.slice(1)} Risk)
                </span>
              </CardTitle>
              <CardDescription>Personalized investment recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Recommended Asset Allocation</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(investmentStrategy.recommended_allocation).map(([key, value]: [string, any]) => (
                    <div key={key} className="bg-secondary rounded-md p-3">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{key}</p>
                        <p className="font-bold">{value.percentage}%</p>
                      </div>
                      <p className="text-sm mt-1">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 border border-muted rounded-md bg-secondary/30">
                <p className="font-medium">Monthly Contribution Suggestion</p>
                <p className="text-2xl font-bold mt-1">
                  ${investmentStrategy.monthly_contribution_suggestion.toFixed(2)}
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Long-Term Strategy</h3>
                  <p className="text-sm">{investmentStrategy.long_term_strategy}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Short-Term Strategy</h3>
                  <p className="text-sm">{investmentStrategy.short_term_strategy}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Specific Recommendations</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {investmentStrategy.specific_recommendations.map((recommendation: string, index: number) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="pt-2">
                <Button onClick={() => navigate('/score')} className="w-full">
                  Calculate Your Financial Score
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Investment;
