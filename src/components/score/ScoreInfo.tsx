
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ScoreInfo = () => {
  return (
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
  );
};

export default ScoreInfo;
