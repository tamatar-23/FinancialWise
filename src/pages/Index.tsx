
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, ChartPie, MessageCircle, User } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <section className="bg-primary py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
              Your AI-Powered Financial Advisor
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-8">
              Smart budgeting, personalized investment strategies, and financial health monitoring to help you achieve your financial goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="px-8">Get Started</Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            All the tools you need for financial success
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="mr-2" size={20} />
                  Budget Planning
                </CardTitle>
                <CardDescription>AI-powered budget recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Get personalized budget recommendations based on your income and expenses. Our AI analyzes your financial situation and suggests an optimal allocation for savings, essential expenses, investments, and more.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChartPie className="mr-2" size={20} />
                  Investment Strategy
                </CardTitle>
                <CardDescription>Tailored investment recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Receive customized investment strategies based on your risk tolerance, financial goals, and market conditions. Our AI helps you make informed decisions about where to invest your money.
                </p>
              </CardContent>
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
                <p className="text-sm">
                  Ask any financial questions and get clear, informative answers from our AI assistant. Improve your financial literacy and make smarter financial decisions with expert guidance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2" size={20} />
                  Financial Health Score
                </CardTitle>
                <CardDescription>Track your financial wellbeing</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Monitor your financial health with our comprehensive scoring system. Get insights into strengths and weaknesses in your financial situation, along with actionable recommendations for improvement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* How it works */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How it Works
          </h2>
          
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/2 order-2 md:order-1">
                <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center mb-4">1</div>
                <h3 className="text-xl font-bold mb-2">Input Your Financial Details</h3>
                <p>
                  Share your income, expenses, and financial goals. The more information you provide, the more accurate your recommendations will be.
                </p>
              </div>
              <div className="md:w-1/2 order-1 md:order-2">
                <div className="bg-secondary rounded-lg h-48 flex items-center justify-center">
                  <Calculator size={48} className="text-primary" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/2">
                <div className="bg-secondary rounded-lg h-48 flex items-center justify-center">
                  <ChartPie size={48} className="text-primary" />
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center mb-4">2</div>
                <h3 className="text-xl font-bold mb-2">Get AI-Powered Analysis</h3>
                <p>
                  Our advanced AI analyzes your financial situation and generates personalized recommendations based on best practices and your unique circumstances.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/2 order-2 md:order-1">
                <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center mb-4">3</div>
                <h3 className="text-xl font-bold mb-2">Implement and Track Progress</h3>
                <p>
                  Follow the recommendations to improve your financial health, and track your progress over time. Adjust your strategies as your situation changes.
                </p>
              </div>
              <div className="md:w-1/2 order-1 md:order-2">
                <div className="bg-secondary rounded-lg h-48 flex items-center justify-center">
                  <User size={48} className="text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start your journey to financial wellness today
          </h2>
          <p className="text-lg mb-8 text-primary-foreground/80">
            Join thousands of users making smarter financial decisions with AI-powered guidance.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-background border-t border-border py-8 px-4 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link to="/" className="text-foreground font-medium text-xl flex items-center">
                <span className="text-primary font-bold">Financial</span>
                <span className="text-accent">Wise</span>
              </Link>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <Link to="/about" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/features" className="text-foreground hover:text-primary transition-colors">
                Features
              </Link>
              <Link to="/login" className="text-foreground hover:text-primary transition-colors">
                Login
              </Link>
              <Link to="/signup" className="text-foreground hover:text-primary transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} FinancialWise. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
