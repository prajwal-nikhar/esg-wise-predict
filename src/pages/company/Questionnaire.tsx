 import { useState } from 'react';
 import { DashboardLayout } from '@/components/layout/DashboardLayout';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { useCompany } from '@/hooks/useCompany';
 import { useESGQuestionsByPillar } from '@/hooks/useESGQuestions';
 import { useQuestionnaireResponses } from '@/hooks/useQuestionnaireResponses';
 import { useCompanyScores } from '@/hooks/useCompanyScores';
 import { ESGPillar, PILLAR_LABELS } from '@/lib/types';
 import { Leaf, Users, Building, CheckCircle2, XCircle, Loader2, Calculator } from 'lucide-react';
 import { cn } from '@/lib/utils';
 
 const pillarIcons = {
   environmental: Leaf,
   social: Users,
   governance: Building,
 };
 
 const pillarColors = {
   environmental: 'data-[state=active]:bg-environmental data-[state=active]:text-environmental-foreground',
   social: 'data-[state=active]:bg-social data-[state=active]:text-social-foreground',
   governance: 'data-[state=active]:bg-governance data-[state=active]:text-governance-foreground',
 };
 
 export default function Questionnaire() {
   const { company } = useCompany();
   const { questionsByPillar, isLoading: questionsLoading } = useESGQuestionsByPillar();
   const { responsesMap, upsertResponse } = useQuestionnaireResponses(company?.id);
   const { calculateScores } = useCompanyScores(company?.id);
   const [activePillar, setActivePillar] = useState<ESGPillar>('environmental');
 
   if (questionsLoading) {
     return (
       <DashboardLayout>
         <div className="flex items-center justify-center min-h-[60vh]">
           <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
       </DashboardLayout>
     );
   }
 
   const handleAnswer = async (questionId: string, answer: boolean) => {
     await upsertResponse.mutateAsync({ questionId, answer });
   };
 
   const pillars: ESGPillar[] = ['environmental', 'social', 'governance'];
 
   return (
     <DashboardLayout>
       <div className="space-y-6">
         <div className="flex items-center justify-between">
           <div>
             <h1 className="text-3xl font-bold">ESG Questionnaire</h1>
             <p className="text-muted-foreground">Answer yes/no questions to assess your ESG performance</p>
           </div>
           <Button onClick={() => calculateScores.mutate()} disabled={calculateScores.isPending}>
             {calculateScores.isPending ? (
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
             ) : (
               <Calculator className="mr-2 h-4 w-4" />
             )}
             Calculate Scores
           </Button>
         </div>
 
         <Tabs value={activePillar} onValueChange={(v) => setActivePillar(v as ESGPillar)}>
           <TabsList className="grid w-full grid-cols-3">
             {pillars.map((pillar) => {
               const Icon = pillarIcons[pillar];
               const questions = questionsByPillar?.[pillar] || [];
               const answered = questions.filter((q) => responsesMap?.[q.id]?.answer !== null).length;
               return (
                 <TabsTrigger
                   key={pillar}
                   value={pillar}
                   className={cn('gap-2', pillarColors[pillar])}
                 >
                   <Icon className="h-4 w-4" />
                   <span className="hidden sm:inline">{PILLAR_LABELS[pillar]}</span>
                   <span className="text-xs opacity-70">({answered}/{questions.length})</span>
                 </TabsTrigger>
               );
             })}
           </TabsList>
 
           {pillars.map((pillar) => (
             <TabsContent key={pillar} value={pillar} className="space-y-4 mt-6">
               {questionsByPillar?.[pillar]?.map((question, index) => {
                 const response = responsesMap?.[question.id];
                 return (
                   <Card key={question.id}>
                     <CardHeader className="pb-3">
                       <div className="flex items-start justify-between gap-4">
                         <div>
                           <CardDescription className="text-xs uppercase tracking-wide">
                             {question.category}
                           </CardDescription>
                           <CardTitle className="text-base font-medium mt-1">
                             {index + 1}. {question.question_text}
                           </CardTitle>
                         </div>
                         {response?.is_predicted && (
                           <span className="text-xs bg-muted px-2 py-1 rounded">AI Predicted</span>
                         )}
                       </div>
                     </CardHeader>
                     <CardContent className="flex gap-3">
                       <Button
                         variant={response?.answer === true ? 'default' : 'outline'}
                         size="sm"
                         className={cn(
                           response?.answer === true && 'bg-score-excellent hover:bg-score-excellent/90'
                         )}
                         onClick={() => handleAnswer(question.id, true)}
                         disabled={upsertResponse.isPending}
                       >
                         <CheckCircle2 className="mr-1 h-4 w-4" />
                         Yes
                       </Button>
                       <Button
                         variant={response?.answer === false ? 'default' : 'outline'}
                         size="sm"
                         className={cn(
                           response?.answer === false && 'bg-score-critical hover:bg-score-critical/90'
                         )}
                         onClick={() => handleAnswer(question.id, false)}
                         disabled={upsertResponse.isPending}
                       >
                         <XCircle className="mr-1 h-4 w-4" />
                         No
                       </Button>
                     </CardContent>
                   </Card>
                 );
               })}
             </TabsContent>
           ))}
         </Tabs>
       </div>
     </DashboardLayout>
   );
 }