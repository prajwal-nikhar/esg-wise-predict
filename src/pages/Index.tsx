import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Building2, TrendingUp, BarChart3, Users, Shield, ArrowRight } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">ESG Platform</span>
          </div>
          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm mb-6">
            <Leaf className="h-4 w-4" />
            ESG Scoring & Prediction Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Measure, Predict, and Improve Your{' '}
            <span className="text-primary">ESG Performance</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comprehensive ESG assessment platform with AI-powered predictions, industry benchmarking, and actionable insights for companies and investors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="gap-2">
                Start Assessment <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="p-2 rounded-lg bg-environmental/10 w-fit mb-2">
                  <BarChart3 className="h-6 w-6 text-environmental" />
                </div>
                <CardTitle>ESG Assessment</CardTitle>
                <CardDescription>
                  Comprehensive binary questionnaires covering Environmental, Social, and Governance pillars aligned with major frameworks.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="p-2 rounded-lg bg-social/10 w-fit mb-2">
                  <TrendingUp className="h-6 w-6 text-social" />
                </div>
                <CardTitle>AI Predictions</CardTitle>
                <CardDescription>
                  ML-powered predictions for missing answers, future score forecasting, and industry benchmarking with confidence levels.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="p-2 rounded-lg bg-governance/10 w-fit mb-2">
                  <Users className="h-6 w-6 text-governance" />
                </div>
                <CardTitle>Investor Analytics</CardTitle>
                <CardDescription>
                  Browse, compare, and track companies with detailed ESG analytics, watchlists, and side-by-side comparisons.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="py-16 px-4">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Built for Everyone</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <Building2 className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl">For Companies</CardTitle>
                <CardDescription className="text-base">
                  Self-assess your ESG performance, get AI predictions for missing data, forecast future scores, and receive actionable improvement recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Binary ESG questionnaire</li>
                  <li>✓ Score breakdown by pillar</li>
                  <li>✓ AI-powered predictions</li>
                  <li>✓ Future score forecasting</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl">For Investors</CardTitle>
                <CardDescription className="text-base">
                  Browse companies by ESG scores, compare multiple companies side-by-side, track favorites with watchlists, and access industry analytics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Company search & filtering</li>
                  <li>✓ Side-by-side comparisons</li>
                  <li>✓ Personal watchlist</li>
                  <li>✓ Industry benchmarks</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-primary" />
            <span>ESG Platform</span>
          </div>
          <p>© {new Date().getFullYear()} All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}
