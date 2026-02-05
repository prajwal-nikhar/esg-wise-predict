 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
 };
 
 serve(async (req) => {
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const { company_id, company_name, industry, unanswered_questions } = await req.json();
     const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
 
     if (!LOVABLE_API_KEY) {
       throw new Error("LOVABLE_API_KEY is not configured");
     }
 
     const prompt = `You are an ESG (Environmental, Social, Governance) expert analyst. Based on the company profile and industry patterns, predict the most likely answers to unanswered ESG questionnaire questions.
 
 Company: ${company_name}
 Industry: ${industry}
 
 Unanswered Questions:
 ${unanswered_questions.map((q: any, i: number) => `${i + 1}. [${q.pillar.toUpperCase()}] ${q.question}`).join('\n')}
 
 For each question, provide a prediction (true/false) with confidence level (0-1) and brief reasoning based on typical practices in the ${industry} industry.`;
 
     const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
       method: "POST",
       headers: {
         Authorization: `Bearer ${LOVABLE_API_KEY}`,
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         model: "google/gemini-3-flash-preview",
         messages: [
           { role: "system", content: "You are an ESG expert. Return predictions in valid JSON format." },
           { role: "user", content: prompt },
         ],
         tools: [{
           type: "function",
           function: {
             name: "predict_answers",
             description: "Predict answers to ESG questions",
             parameters: {
               type: "object",
               properties: {
                 predictions: {
                   type: "array",
                   items: {
                     type: "object",
                     properties: {
                       question_id: { type: "string" },
                       question_text: { type: "string" },
                       pillar: { type: "string" },
                       predicted_answer: { type: "boolean" },
                       confidence: { type: "number" },
                       reasoning: { type: "string" }
                     },
                     required: ["question_id", "question_text", "pillar", "predicted_answer", "confidence", "reasoning"]
                   }
                 }
               },
               required: ["predictions"]
             }
           }
         }],
         tool_choice: { type: "function", function: { name: "predict_answers" } }
       }),
     });
 
     if (!response.ok) {
       const errorText = await response.text();
       console.error("AI gateway error:", response.status, errorText);
       throw new Error("AI gateway error");
     }
 
     const data = await response.json();
     const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
     
     if (!toolCall?.function?.arguments) {
       throw new Error("No predictions returned");
     }
 
     const predictions = JSON.parse(toolCall.function.arguments);
     
     // Map question IDs back
     const mappedPredictions = predictions.predictions.map((p: any, i: number) => ({
       ...p,
       question_id: unanswered_questions[i]?.id || p.question_id,
       question_text: unanswered_questions[i]?.question || p.question_text,
       pillar: unanswered_questions[i]?.pillar || p.pillar,
     }));
 
     return new Response(JSON.stringify({ predictions: mappedPredictions }), {
       headers: { ...corsHeaders, "Content-Type": "application/json" },
     });
   } catch (error) {
     console.error("predict-answers error:", error);
     return new Response(
       JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });