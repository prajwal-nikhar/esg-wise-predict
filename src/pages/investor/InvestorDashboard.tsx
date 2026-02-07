
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCompanies } from '@/hooks/useCompanies';
import { useWatchlist } from '@/hooks/useWatchlist';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Search, GitCompare, Star, TrendingUp, TrendingDown, Building2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { INDUSTRY_LABELS, IndustryType } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export default function InvestorDashboard() {
  const navigate = useNavigate();
  const { data: companies, isLoading } = useCompanies();
  const { watchlist } = useWatchlist();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const companiesWithScores = companies?.filter((c) => c.latest_score?.overall_score) || [];
  const avgScore = companiesWithScores.length > 0
    ? companiesWithScores.reduce((acc, c) => acc + (c.latest_score?.overall_score || 0), 0) / companiesWithScores.length
    : 0;

  // Industry average calculation
  const industryAverages = Object.keys(INDUSTRY_LABELS).map(industry => {
    const industryCompanies = companiesWithScores.filter(c => c.industry === industry);
    const avg = industryCompanies.length > 0
      ? industryCompanies.reduce((acc, c) => acc + (c.latest_score?.overall_score || 0), 0) / industryCompanies.length
      : 0;
    return { industry: INDUSTRY_LABELS[industry as IndustryType], averageScore: avg };
  }).filter(item => item.averageScore > 0).sort((a, b) => b.averageScore - a.averageScore);

  // Top and bottom companies
  const sortedCompanies = [...companiesWithScores].sort((a, b) => (b.latest_score?.overall_score || 0) - (a.latest_score?.overall_score || 0));
  const top5Companies = sortedCompanies.slice(0, 5);
  const bottom5Companies = sortedCompanies.slice(-5).reverse();

  const scoreDistribution = [
    { name: 'Excellent (80+)', value: companiesWithScores.filter((c) => (c.latest_score?.overall_score ?? 0) >= 80).length, fill: 'hsl(var(--score-excellent))' },
    { name: 'Good (60-79)', value: companiesWithScores.filter((c) => (c.latest_score?.overall_score ?? 0) >= 60 && (c.latest_score?.overall_score ?? 0) < 80).length, fill: 'hsl(var(--score-good))' },
    { name: 'Average (40-59)', value: companiesWithScores.filter((c) => (c.latest_score?.overall_score ?? 0) >= 40 && (c.latest_score?.overall_score ?? 0) < 60).length, fill: 'hsl(var(--score-average))' },
    { name: 'Below (< 40)', value: companiesWithScores.filter((c) => (c.latest_score?.overall_score ?? 0) < 40).length, fill: 'hsl(var(--score-poor))' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Investor Dashboard</h1>
          <p className="text-muted-foreground">ESG analytics and company insights</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardDescription>Total Companies</CardDescription>
                <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{companies?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardDescription>Watchlist</CardDescription>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{watchlist?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardDescription>Average ESG Score</CardDescription>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgScore.toFixed(1)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardDescription>Companies with Scores</CardDescription>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{companiesWithScores.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Industry Leaders</CardTitle>
              <CardDescription>Average ESG score by industry</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="w-full h-[300px]">
                <BarChart data={industryAverages} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="industry" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="averageScore" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <CardDescription>Breakdown of company ESG ratings</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
                <ChartContainer config={{}} className="h-[250px]">
                    <PieChart >
                        <Pie data={scoreDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2}>
                            {scoreDistribution.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
                <CardTitle>Top 5 Companies</CardTitle>
                <CardDescription>Companies with the highest ESG scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {top5Companies.map((company) => (
                  <div key={company.id} className="flex items-center justify-between cursor-pointer" onClick={() => navigate(`/investor/company/${company.id}`)}>
                    <div>
                      <p className="font-semibold">{company.name}</p>
                      <p className="text-sm text-muted-foreground">{INDUSTRY_LABELS[company.industry]}</p>
                    </div>
                    <Badge>{company.latest_score?.overall_score?.toFixed(1)}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle>Bottom 5 Companies</CardTitle>
                <CardDescription>Companies with the lowest ESG scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bottom5Companies.map((company) => (
                  <div key={company.id} className="flex items-center justify-between cursor-pointer" onClick={() => navigate(`/investor/company/${company.id}`)}>
                    <div>
                      <p className="font-semibold">{company.name}</p>
                      <p className="text-sm text-muted-foreground">{INDUSTRY_LABELS[company.industry]}</p>
                    </div>
                    <Badge variant="destructive">{company.latest_score?.overall_score?.toFixed(1)}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
