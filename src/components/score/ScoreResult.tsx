
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

interface ScoreResultProps {
  scoreResult: any;
  onCalculateAgain: () => void;
}

const ScoreResult = ({ scoreResult, onCalculateAgain }: ScoreResultProps) => {
  const navigate = useNavigate();

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
          onClick={onCalculateAgain} 
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
  );
};

export default ScoreResult;
