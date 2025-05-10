
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface FinancialScoreFormProps {
  onSubmit: (
    income: number, 
    expenses: number, 
    savings: number, 
    debt: number, 
    investments: number, 
    emergencyFund: number
  ) => Promise<void>;
  isKeySet: boolean;
  loading: boolean;
}

const FinancialScoreForm = ({ onSubmit, isKeySet, loading }: FinancialScoreFormProps) => {
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [savings, setSavings] = useState<number>(0);
  const [debt, setDebt] = useState<number>(0);
  const [investments, setInvestments] = useState<number>(0);
  const [emergencyFund, setEmergencyFund] = useState<number>(0);

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
    
    await onSubmit(income, expenses, savings, debt, investments, emergencyFund);
  };

  return (
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
  );
};

export default FinancialScoreForm;
