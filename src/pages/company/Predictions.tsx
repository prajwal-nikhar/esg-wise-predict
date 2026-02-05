 import { useState } from 'react';
 import { DashboardLayout } from '@/components/layout/DashboardLayout';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { useCompany } from '@/hooks/useCompany';
 import { useCompanyScores } from '@/hooks/useCompanyScores';
 import { useESGQuestions } from '@/hooks/useESGQuestions';
 import { useQuestionnaireResponses } from '@/hooks/useQuestionnaireResponses';
 import { supabase } from '@/integrations/supabase/client';
 import { useToast } from '@/hooks/use-toast';
 import { Loader2, Sparkles, TrendingUp, Target, Brain } from 'lucide-react';
 import { PILLAR_LABELS } from '@/lib/types';
 
 interface Prediction {
   question_id: string;
   question_text: string;
   pillar: string;
   predicted_answer: boolean;
   confidence: number;
   reasoning: string;
 }
 
 interface ForecastData {
   current_score: number;
   projected_scores: { year: number; score: number; confidence: number }[];
   recommendations: string[];
 }
 
 export default function Predictions() {
   const { company } = useCompany();
   const { latestScore } = useCompanyScores(company?.id);
   const { data: questions } = useESGQuestions();
   const { responses } = useQuestionnaireResponses(company?.id);
   const { toast } = useToast();
 
   const [predictions, setPredictions] = useState<Prediction[]>([]);
   const [forecast, setForecast] = useState<ForecastData | null>(null);
   const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);
   const [isLoadingForecast, setIsLoadingForecast] = useState(false);
 
   const unansweredQuestions = questions?.filter(
     (q) => !responses?.find((r) => r.question_id === q.id && r.answer !== null)
   );
 
   const handlePredictMissing = async () => {
     if (!company || !unansweredQuestions?.length) return;
     setIsLoadingPredictions(true);
 
     try {
       const { data, error } = await supabase.functions.invoke('predict-answers', {
         body: {
           company_id: company.id,
           company_name: company.name,
           industry: company.industry,
           unanswered_questions: unansweredQuestions.map((q) => ({
             id: q.id,
             pillar: q.pillar,
             question: q.question_text,
           })),
         },
       });
 
       if (error) throw error;
       setPredictions(data.predictions || []);
       toast({ title: 'Predictions generated!' });
     } catch (error) {
       console.error(error);
       toast({ title: 'Error generating predictions', variant: 'destructive' });
     } finally {
       setIsLoadingPredictions(false);
     }
   };
 
   const handleForecastScore = async () => {
     if (!company || !latestScore) return;
     setIsLoadingForecast(true);
 
     try {
       const { data, error } = await supabase.functions.invoke('forecast-score', {
         body: {
           company_id: company.id,
           company_name: company.name,
           industry: company.industry,
           current_scores: {
             overall: latestScore.overall_score,
             environmental: latestScore.environmental_score,
             social: latestScore.social_score,
             governance: latestScore.governance_score,
           },
         },
       });
 
       if (error) throw error;
       setForecast(data);
       toast({ title: 'Forecast generated!' });
     } catch (error) {
       console.error(error);
       toast({ title: 'Error generating forecast', variant: 'destructive' });
     } finally {
       setIsLoadingForecast(false);
     }
   };
 
   return (
     <DashboardLayout>
       <div className="space-y-6">
         <div>
           <h1 className="text-3xl font-bold">AI Predictions</h1>
           <p className="text-muted-foreground">ML-powered insights and forecasts for your ESG performance</p>
         </div>
 
         {/* Predict Missing Answers */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Brain className="h-5 w-5 text-primary" />
               Predict Missing Answers
             </CardTitle>
             <CardDescription>
               AI can predict likely answers to {unansweredQuestions?.length || 0} unanswered questions based on your company profile and industry patterns
             </CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             <Button onClick={handlePredictMissing} disabled={isLoadingPredictions || !unansweredQuestions?.length}>
               {isLoadingPredictions ? (
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               ) : (
                 <Sparkles className="mr-2 h-4 w-4" />
               )}
               Generate Predictions
             </Button>
 
             {predictions.length > 0 && (
               <div className="space-y-3 mt-4">
                 {predictions.map((p) => (
                   <div key={p.question_id} className="p-4 rounded-lg border bg-muted/50">
                     <div className="flex items-start justify-between gap-4">
                       <div>
                         <Badge variant="outline" className="mb-2">
                           {PILLAR_LABELS[p.pillar as keyof typeof PILLAR_LABELS]}
                         </Badge>
                         <p className="font-medium">{p.question_text}</p>
                         <p className="text-sm text-muted-foreground mt-1">{p.reasoning}</p>
                       </div>
                       <div className="text-right">
                         <Badge variant={p.predicted_answer ? 'default' : 'secondary'}>
                           {p.predicted_answer ? 'Yes' : 'No'}
                         </Badge>
                         <p className="text-xs text-muted-foreground mt-1">
                           {(p.confidence * 100).toFixed(0)}% confidence
                         </p>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </CardContent>
         </Card>
 
         {/* Score Forecast */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <TrendingUp className="h-5 w-5 text-primary" />
               Future Score Forecast
             </CardTitle>
             <CardDescription>
               Predict your ESG score trajectory over the next 1-3 years
             </CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             <Button onClick={handleForecastScore} disabled={isLoadingForecast || !latestScore}>
               {isLoadingForecast ? (
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               ) : (
                 <Target className="mr-2 h-4 w-4" />
               )}
               Generate Forecast
             </Button>
 
             {forecast && (
               <div className="mt-4 space-y-4">
                 <div className="grid grid-cols-3 gap-4">
                   {forecast.projected_scores.map((p) => (
                     <Card key={p.year}>
                       <CardContent className="pt-6 text-center">
                         <p className="text-sm text-muted-foreground">{p.year}</p>
                         <p className="text-3xl font-bold text-primary">{p.score.toFixed(0)}</p>
                         <p className="text-xs text-muted-foreground">
                           {(p.confidence * 100).toFixed(0)}% confidence
                         </p>
                       </CardContent>
                     </Card>
                   ))}
                 </div>
                 {forecast.recommendations.length > 0 && (
                   <div className="p-4 rounded-lg border bg-accent/50">
                     <p className="font-medium mb-2">Recommendations</p>
                     <ul className="space-y-1 text-sm text-muted-foreground">
                       {forecast.recommendations.map((r, i) => (
                         <li key={i}>• {r}</li>
                       ))}
                     </ul>
                   </div>
                 )}
               </div>
             )}
           </CardContent>
         </Card>
       </div>
     </DashboardLayout>
   );
 }