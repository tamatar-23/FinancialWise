import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useOpenAI } from '../contexts/OpenAIContext';
import { generateBudget } from '../services/openai';
import { saveBudgetData } from '../lib/dataRepository';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { toast } from 'sonner';

const Budget = () => {
  const { currentUser } = useAuth();
  const { apiKey, isKeySet } = useOpenAI();
  const navigate = useNavigate();
  
  const [income, setIncome] = useState<number>(0);
  const [essentialExpenses, setEssentialExpenses] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [budgetResult, setBudgetResult] = useState<any>(null);
  
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
    
    if (essentialExpenses <= 0) {
      toast.error("Essential expenses must be greater than zero");
      return;
    }
    
    if (essentialExpenses >= income) {
      toast.error("Essential expenses cannot exceed income");
      return;
    }
    
    try {
      setLoading(true);
      const budget = await generateBudget(income, essentialExpenses, apiKey);
      
      if (budget) {
        // Add income for later reference
        budget.income = income;
        
        setBudgetResult(budget);
        
        // Save to Firestore if user is logged in
        if (currentUser) {
          await saveBudgetData(currentUser.uid, budget);
        }
      }
    } catch (error) {
      console.error('Error generating budget:', error);
      toast.error("Failed to generate budget");
    } finally {
      setLoading(false);
    }
  };
  
  // Prepare chart data
  const chartData = budgetResult ? [
    { name: 'Savings', value: budgetResult.savings.percentage, color: '#4ECDC4' },
    { name: 'Essential', value: budgetResult.essential.percentage, color: '#FF6B6B' },
    { name: 'Investment', value: budgetResult.investment.percentage, color: '#3A86FF' },
    { name: 'Discretionary', value: budgetResult.discretionary.percentage, color: '#FFA500' },
    { name: 'Emergency', value: budgetResult.emergency.percentage, color: '#8338EC' }
  ] : [];
  
  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6">Budget Planning Tool</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Your Budget</CardTitle>
            <CardDescription>
              Enter your monthly income and essential expenses to generate a smart budget plan
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
                <Label htmlFor="expenses">Essential Monthly Expenses ($)</Label>
                <Input
                  id="expenses"
                  type="number"
                  placeholder="0.00"
                  value={essentialExpenses || ''}
                  onChange={(e) => setEssentialExpenses(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Include rent/mortgage, utilities, groceries, transportation, insurance, etc.
                </p>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading || !isKeySet}>
                {loading ? 'Generating Budget...' : 'Generate Smart Budget'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {budgetResult && (
          <Card>
            <CardHeader>
              <CardTitle>Your Budget Breakdown</CardTitle>
              <CardDescription>AI-generated budget based on your income and expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Monthly Allocation</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-secondary rounded-md p-3">
                      <p className="text-sm font-medium">Savings</p>
                      <p className="text-lg font-bold">${budgetResult.savings.amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{budgetResult.savings.percentage}%</p>
                    </div>
                    <div className="bg-secondary rounded-md p-3">
                      <p className="text-sm font-medium">Essential</p>
                      <p className="text-lg font-bold">${budgetResult.essential.amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{budgetResult.essential.percentage}%</p>
                    </div>
                    <div className="bg-secondary rounded-md p-3">
                      <p className="text-sm font-medium">Investment</p>
                      <p className="text-lg font-bold">${budgetResult.investment.amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{budgetResult.investment.percentage}%</p>
                    </div>
                    <div className="bg-secondary rounded-md p-3">
                      <p className="text-sm font-medium">Discretionary</p>
                      <p className="text-lg font-bold">${budgetResult.discretionary.amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{budgetResult.discretionary.percentage}%</p>
                    </div>
                    <div className="bg-secondary rounded-md p-3 col-span-2">
                      <p className="text-sm font-medium">Emergency Fund</p>
                      <p className="text-lg font-bold">${budgetResult.emergency.amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{budgetResult.emergency.percentage}%</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Analysis</h3>
                  <p className="text-sm">{budgetResult.analysis}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Advice</h3>
                  <p className="text-sm">{budgetResult.advice}</p>
                </div>
                
                <div className="pt-4">
                  <Button onClick={() => navigate('/investment')} className="w-full">
                    Plan Your Investments
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Budget;
