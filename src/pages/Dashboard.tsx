
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useOpenAI } from '../contexts/OpenAIContext';
import { getLatestBudget, getLatestFinancialScore, getLatestInvestmentStrategy } from '../lib/dataRepository';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import ApiKeySetup from '@/components/settings/ApiKeySetup';
import { Calculator, ChartPie, MessageCircle } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { isKeySet } = useOpenAI();
  const navigate = useNavigate();
  
  const [budget, setBudget] = useState<any>(null);
  const [score, setScore] = useState<any>(null);
  const [investmentStrategy, setInvestmentStrategy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          const [budgetData, scoreData, strategyData] = await Promise.all([
            getLatestBudget(currentUser.uid),
            getLatestFinancialScore(currentUser.uid),
            getLatestInvestmentStrategy(currentUser.uid)
          ]);
          
          setBudget(budgetData);
          setScore(scoreData);
          setInvestmentStrategy(strategyData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchUserData();
  }, [currentUser]);
  
  // Budget data for pie chart
  const budgetData = budget ? [
    { name: 'Savings', value: budget.savings.percentage, color: '#4ECDC4' },
    { name: 'Essential', value: budget.essential.percentage, color: '#FF6B6B' },
    { name: 'Investment', value: budget.investment.percentage, color: '#3A86FF' },
    { name: 'Discretionary', value: budget.discretionary.percentage, color: '#FFA500' },
    { name: 'Emergency', value: budget.emergency.percentage, color: '#8338EC' }
  ] : [];
  
  // Financial score data for chart
  const scoreData = score ? [
    { name: 'Savings', score: score.breakdown.savings_score },
    { name: 'Debt', score: score.breakdown.debt_score },
    { name: 'Emergency', score: score.breakdown.emergency_fund_score },
    { name: 'Investment', score: score.breakdown.investment_score },
    { name: 'Expenses', score: score.breakdown.expense_ratio_score }
  ] : [];
  
  // Get score color based on category
  const getScoreColor = (category: string) => {
    switch(category) {
      case 'Poor': return 'text-score-poor';
      case 'Fair': return 'text-score-fair';
      case 'Good': return 'text-score-good';
      case 'Excellent': return 'text-score-excellent';
      default: return 'text-muted-foreground';
    }
  };
  
  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6">Financial Dashboard</h1>
      
      {!isKeySet && (
        <div className="mb-8">
          <ApiKeySetup />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="mr-2" size={20} />
              Budget Tool
            </CardTitle>
            <CardDescription>Create and manage your budget</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Plan your finances with our AI-powered budget tool.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/budget')}>Create Budget</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChartPie className="mr-2" size={20} />
              Investment Strategy
            </CardTitle>
            <CardDescription>Get personalized investment advice</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Discover investment options based on your risk tolerance.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/investment')}>Explore Investments</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="mr-2" size={20} />
              Financial Literacy
            </CardTitle>
            <CardDescription>Chat with our financial assistant</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Get answers to your financial questions in real-time.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/chat')}>Ask Questions</Button>
          </CardFooter>
        </Card>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading your financial data...</p>
        </div>
      ) : (
        <>
          {/* Financial Score */}
          {score && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Your Financial Health Score</CardTitle>
                <CardDescription>Overall assessment of your financial health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="text-center mb-6 md:mb-0">
                    <div className="relative inline-block">
                      <svg className="w-32 h-32">
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          fill="none"
                          stroke="#e6e6e6"
                          strokeWidth="12"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          fill="none"
                          stroke={
                            score.category === 'Poor' ? '#FF6B6B' :
                            score.category === 'Fair' ? '#FFA500' :
                            score.category === 'Good' ? '#4ECDC4' : '#3A86FF'
                          }
                          strokeWidth="12"
                          strokeDasharray={`${(score.score / 100) * 339} 339`}
                          strokeLinecap="round"
                          transform="rotate(-90 60 60)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-4xl font-bold">{score.score}</span>
                        <span className={`text-sm font-medium ${getScoreColor(score.category)}`}>
                          {score.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 max-w-lg">
                    <h4 className="font-medium mb-2">Breakdown</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={scoreData}>
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="score" fill="#3A86FF" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Analysis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium mb-1">Strengths:</h5>
                      <ul className="list-disc list-inside text-sm">
                        {score.analysis.strengths.map((strength: string, index: number) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-1">Areas to Improve:</h5>
                      <ul className="list-disc list-inside text-sm">
                        {score.analysis.weaknesses.map((weakness: string, index: number) => (
                          <li key={index}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => navigate('/score')}>
                  Calculate New Score
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Budget Breakdown */}
          {budget && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Budget Breakdown</CardTitle>
                <CardDescription>Your current budget allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center">
                  <div className="w-full md:w-1/2 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={budgetData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={40}
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {budgetData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full md:w-1/2 mt-6 md:mt-0">
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span>Monthly Income:</span>
                        <span className="font-medium">${budget.income.toFixed(2)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Savings:</span>
                        <span className="font-medium">${budget.savings.amount.toFixed(2)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Essential Expenses:</span>
                        <span className="font-medium">${budget.essential.amount.toFixed(2)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Investment:</span>
                        <span className="font-medium">${budget.investment.amount.toFixed(2)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Discretionary:</span>
                        <span className="font-medium">${budget.discretionary.amount.toFixed(2)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Emergency Fund:</span>
                        <span className="font-medium">${budget.emergency.amount.toFixed(2)}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Budget Analysis</h4>
                  <p className="text-sm">{budget.analysis}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => navigate('/budget')}>
                  Update Budget
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Investment Strategy */}
          {investmentStrategy && (
            <Card>
              <CardHeader>
                <CardTitle>Investment Strategy</CardTitle>
                <CardDescription>Your personalized investment plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Recommended Allocation</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(investmentStrategy.recommended_allocation).map(([key, value]: [string, any]) => (
                      <div key={key} className="bg-secondary rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{key}</span>
                          <span className="font-bold">{value.percentage}%</span>
                        </div>
                        <p className="text-sm">{value.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Strategy Overview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium mb-1">Long-term Strategy:</h5>
                      <p className="text-sm">{investmentStrategy.long_term_strategy}</p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-1">Short-term Strategy:</h5>
                      <p className="text-sm">{investmentStrategy.short_term_strategy}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Specific Recommendations</h4>
                  <ul className="list-disc list-inside text-sm">
                    {investmentStrategy.specific_recommendations.map((recommendation: string, index: number) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => navigate('/investment')}>
                  Update Strategy
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {!budget && !score && !investmentStrategy && (
            <div className="text-center py-12">
              <p className="mb-4 text-lg">Get started with your financial journey</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate('/budget')}>Create Your Budget</Button>
                <Button onClick={() => navigate('/score')} variant="outline">Calculate Financial Score</Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
