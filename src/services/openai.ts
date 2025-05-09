
import { toast } from "sonner";

// OpenAI API implementation
export const callOpenAI = async (
  prompt: string, 
  apiKey: string,
  model: string = "gpt-4o-mini",
  temperature: number = 0.7
): Promise<string> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        temperature: temperature,
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get response from OpenAI');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    toast.error("Failed to get AI response. Please try again.");
    return "I'm having trouble processing your request right now. Please check your API key or try again later.";
  }
};

// Budget generation
export const generateBudget = async (
  income: number, 
  essentialExpenses: number,
  apiKey: string
): Promise<any> => {
  const prompt = `
    Based on a monthly income of $${income} and essential expenses of $${essentialExpenses}, 
    generate a detailed budget breakdown. Follow these rules:
    
    1. Allocate between 20-30% for savings
    2. Cover all essential expenses (which total $${essentialExpenses})
    3. Suggest percentages for investment
    4. Allow for discretionary spending
    5. Include emergency fund allocation
    
    Return the response as a JSON object with the following structure:
    {
      "savings": {
        "amount": number,
        "percentage": number
      },
      "essential": {
        "amount": number,
        "percentage": number
      },
      "investment": {
        "amount": number,
        "percentage": number
      },
      "discretionary": {
        "amount": number,
        "percentage": number
      },
      "emergency": {
        "amount": number,
        "percentage": number
      },
      "analysis": "string with brief budget analysis",
      "advice": "string with financial advice"
    }
    
    Return ONLY the JSON with no additional text before or after.
  `;

  try {
    const response = await callOpenAI(prompt, apiKey);
    return JSON.parse(response);
  } catch (error) {
    console.error('Error generating budget:', error);
    toast.error("Failed to generate budget. Please try again.");
    return null;
  }
};

// Investment strategy generation
export const generateInvestmentStrategy = async (
  income: number,
  savings: number,
  riskTolerance: 'low' | 'medium' | 'high',
  apiKey: string
): Promise<any> => {
  const prompt = `
    Based on a monthly income of $${income}, monthly savings capacity of $${savings}, 
    and a ${riskTolerance} risk tolerance, suggest an investment strategy.
    
    The user has a ${riskTolerance} risk tolerance, so adjust the investment strategy accordingly.
    
    Return the response as a JSON object with the following structure:
    {
      "recommended_allocation": {
        "category1": {
          "percentage": number,
          "description": "string"
        },
        "category2": {
          "percentage": number,
          "description": "string"
        },
        ...other categories
      },
      "monthly_contribution_suggestion": number,
      "long_term_strategy": "string with long-term investment advice",
      "short_term_strategy": "string with short-term investment advice",
      "specific_recommendations": ["list", "of", "specific", "investment", "vehicles"]
    }
    
    For a low risk tolerance, favor bonds, index funds, and safer investments.
    For medium risk tolerance, suggest a balanced portfolio.
    For high risk tolerance, include more stocks, growth funds, and potentially some alternative investments.
    
    Return ONLY the JSON with no additional text before or after.
  `;

  try {
    const response = await callOpenAI(prompt, apiKey);
    return JSON.parse(response);
  } catch (error) {
    console.error('Error generating investment strategy:', error);
    toast.error("Failed to generate investment strategy. Please try again.");
    return null;
  }
};

// Financial health score calculation
export const calculateFinancialScore = async (
  income: number,
  expenses: number,
  savings: number,
  debt: number,
  investments: number,
  emergencyFund: number,
  apiKey: string
): Promise<any> => {
  const prompt = `
    Calculate a financial health score (0-100) based on the following data:
    - Monthly income: $${income}
    - Monthly expenses: $${expenses}
    - Monthly savings: $${savings}
    - Total debt: $${debt}
    - Total investments: $${investments}
    - Emergency fund: $${emergencyFund}
    
    Return the result as a JSON object with the following structure:
    {
      "score": number (0-100),
      "category": "Poor" | "Fair" | "Good" | "Excellent",
      "analysis": {
        "strengths": ["list", "of", "financial", "strengths"],
        "weaknesses": ["list", "of", "areas", "to", "improve"]
      },
      "recommendations": ["list", "of", "specific", "actionable", "recommendations"],
      "breakdown": {
        "savings_score": number,
        "debt_score": number,
        "emergency_fund_score": number,
        "investment_score": number,
        "expense_ratio_score": number
      }
    }
    
    Score categories:
    - 0-25: Poor
    - 26-50: Fair
    - 51-75: Good
    - 76-100: Excellent
    
    Return ONLY the JSON with no additional text before or after.
  `;

  try {
    const response = await callOpenAI(prompt, apiKey);
    return JSON.parse(response);
  } catch (error) {
    console.error('Error calculating financial score:', error);
    toast.error("Failed to calculate financial score. Please try again.");
    return null;
  }
};
