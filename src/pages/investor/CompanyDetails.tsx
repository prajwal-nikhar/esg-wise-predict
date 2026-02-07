import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useParams } from 'react-router-dom';
import { useCompanyById } from '@/hooks/useCompanyById';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PILLAR_LABELS, INDUSTRY_LABELS, COMPANY_SIZE_LABELS } from '@/lib/types';

export default function CompanyDetails() {
  const { companyId } = useParams<{ companyId: string }>();
  const { data, isLoading, isError, error } = useCompanyById(companyId);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !data?.company) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-lg text-destructive">{error?.message || 'Company not found'}</p>
        </div>
      </DashboardLayout>
    );
  }

  const { company, scores } = data;
  const latestScore = scores?.[0];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{company.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Badge variant="outline">{INDUSTRY_LABELS[company.industry]}</Badge>
              <Badge variant="outline">{COMPANY_SIZE_LABELS[company.company_size]}</Badge>
              {company.location && <span>{company.location}</span>}
            </div>
          </div>
          {company.website && (
            <a href={company.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">
              Visit Website
            </a>
          )}
        </div>

        {company.description && <p className="text-lg text-muted-foreground">{company.description}</p>}

        <Card>
          <CardHeader>
            <CardTitle>Latest ESG Score</CardTitle>
          </CardHeader>
          <CardContent>
            {latestScore ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center space-y-2 p-6 bg-secondary rounded-lg">
                  <span className="text-5xl font-bold">{latestScore.overall_score?.toFixed(1)}</span>
                  <span className="text-muted-foreground">Overall Score</span>
                  {latestScore.industry_percentile != null && (
                    <span className="text-sm text-green-600">{latestScore.industry_percentile}th percentile in {INDUSTRY_LABELS[company.industry]}</span>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>{PILLAR_LABELS.environmental}</span>
                      <span>{latestScore.environmental_score?.toFixed(1)}</span>
                    </div>
                    <Progress value={latestScore.environmental_score || 0} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>{PILLAR_LABELS.social}</span>
                      <span>{latestScore.social_score?.toFixed(1)}</span>
                    </div>
                    <Progress value={latestScore.social_score || 0} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>{PILLAR_LABELS.governance}</span>
                      <span>{latestScore.governance_score?.toFixed(1)}</span>
                    </div>
                    <Progress value={latestScore.governance_score || 0} />
                  </div>
                </div>
              </div>
            ) : (
              <p>No ESG score available for this company yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
