import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompanyScore, PILLAR_LABELS, PILLAR_COLORS } from '@/lib/types';
import { format } from 'date-fns';

interface ScoreHistoryChartProps {
  scores: CompanyScore[];
  className?: string;
}

export function ScoreHistoryChart({ scores, className }: ScoreHistoryChartProps) {
  const formattedScores = scores.map(s => ({
    ...s,
    calculated_at: format(new Date(s.calculated_at), 'MMM d'),
  })).reverse(); // Reverse to show oldest first

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Historical Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedScores}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="calculated_at" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="overall_score" name="Overall" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="environmental_score" name="Environmental" stroke={PILLAR_COLORS.environmental} />
            <Line type="monotone" dataKey="social_score" name="Social" stroke={PILLAR_COLORS.social} />
            <Line type="monotone" dataKey="governance_score" name="Governance" stroke={PILLAR_COLORS.governance} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface PillarPerformanceChartProps {
  latestScore: CompanyScore | null;
  className?: string;
}

export function PillarPerformanceChart({ latestScore, className }: PillarPerformanceChartProps) {
  const data = [
    { subject: PILLAR_LABELS.environmental, score: latestScore?.environmental_score ?? 0, fullMark: 100 },
    { subject: PILLAR_LABELS.social, score: latestScore?.social_score ?? 0, fullMark: 100 },
    { subject: PILLAR_LABELS.governance, score: latestScore?.governance_score ?? 0, fullMark: 100 },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Pillar Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}