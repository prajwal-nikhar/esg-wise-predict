import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ESGScoreCard } from '@/components/esg/ESGScoreCard';
import { OverallScoreGauge } from '@/components/esg/OverallScoreGauge';
import { ScoreHistoryChart, PillarPerformanceChart } from '@/components/esg/ScoreCharts';
import { useCompany } from '@/hooks/useCompany';
import { useCompanyScores } from '@/hooks/useCompanyScores';
import { useQuestionnaireResponses } from '@/hooks/useQuestionnaireResponses';
import { useESGQuestions } from '@/hooks/useESGQuestions';
import { Progress } from '@/components/ui/progress';
import { FileQuestion, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import CompanySetup from './CompanySetup';

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { company, isLoading: companyLoading } = useCompany();
  const { scores, latestScore, isLoading: scoresLoading } = useCompanyScores(company?.id);
  const { responses } = useQuestionnaireResponses(company?.id);
  const { data: questions } = useESGQuestions(company?.id);

  if (companyLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!company) {
    return <CompanySetup />;
  }

  const totalQuestions = questions?.length || 0;
  const answeredQuestions = responses?.filter((r) => r.selected_option_id !== null).length || 0;
  const completionPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">{company.name}</h1>
          <p className="text-muted-foreground">ESG Dashboard</p>
        </div>

        {/* Questionnaire Progress */}
        {completionPercentage < 100 && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex-1 mr-4">
                <p className="font-medium">Complete your ESG Assessment</p>
                <p className="text-sm text-muted-foreground mb-2">
                  {answeredQuestions} of {totalQuestions} questions answered
                </p>
                <Progress value={completionPercentage} className="h-2" />
              </div>
              <Button onClick={() => navigate('/company/questionnaire')}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Scores Grid */}
        <div className="grid gap-6 md:grid-cols-4">
          <OverallScoreGauge
            score={latestScore?.overall_score ?? null}
            percentile={latestScore?.industry_percentile}
            className="md:row-span-2"
          />
          <ESGScoreCard pillar="environmental" score={latestScore?.environmental_score ?? null} />
          <ESGScoreCard pillar="social" score={latestScore?.social_score ?? null} />
          <ESGScoreCard pillar="governance" score={latestScore?.governance_score ?? null} />
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {scoresLoading ? (
            <Card>
              <CardHeader><CardTitle>Historical Performance</CardTitle></CardHeader>
              <CardContent className="flex items-center justify-center h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : (
            scores && scores.length > 1 && <ScoreHistoryChart scores={scores} />
          )}
          {scoresLoading ? (
             <Card>
              <CardHeader><CardTitle>Pillar Performance</CardTitle></CardHeader>
              <CardContent className="flex items-center justify-center h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : (
            latestScore && <PillarPerformanceChart latestScore={latestScore} />
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/company/questionnaire')}>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileQuestion className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">ESG Questionnaire</CardTitle>
                <CardDescription>Answer questions to improve your score</CardDescription>
              </div>
            </CardHeader>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/company/predictions')}>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Predictions</CardTitle>
                <CardDescription>View forecasts and recommendations</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
