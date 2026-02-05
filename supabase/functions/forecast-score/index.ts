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
     const { company_id, company_name, industry, current_scores } = await req.json();
     const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
 
     if (!LOVABLE_API_KEY) {
       throw new Error("LOVABLE_API_KEY is not configured");
     }
 
     const currentYear = new Date().getFullYear();
 
     const prompt = `You are an ESG analyst forecasting future ESG scores based on current performance and industry trends.
 
 Company: ${company_name}
 Industry: ${industry}
 Current Year: ${currentYear}
 
 Current Scores:
 - Overall: ${current_scores.overall?.toFixed(1) || 'N/A'}
 - Environmental: ${current_scores.environmental?.toFixed(1) || 'N/A'}
 - Social: ${current_scores.social?.toFixed(1) || 'N/A'}
 - Governance: ${current_scores.governance?.toFixed(1) || 'N/A'}
 
 Based on typical ${industry} industry ESG improvement trajectories and current trends, forecast the overall ESG score for the next 3 years and provide actionable recommendations.`;
 
     const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
       method: "POST",
       headers: {
         Authorization: `Bearer ${LOVABLE_API_KEY}`,
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         model: "google/gemini-3-flash-preview",
         messages: [
           { role: "system", content: "You are an ESG forecasting expert. Return predictions in valid JSON format." },
           { role: "user", content: prompt },
         ],
         tools: [{
           type: "function",
           function: {
             name: "forecast_scores",
             description: "Forecast future ESG scores",
             parameters: {
               type: "object",
               properties: {
                 current_score: { type: "number" },
                 projected_scores: {
                   type: "array",
                   items: {
                     type: "object",
                     properties: {
                       year: { type: "number" },
                       score: { type: "number" },
                       confidence: { type: "number" }
                     },
                     required: ["year", "score", "confidence"]
                   }
                 },
                 recommendations: {
                   type: "array",
                   items: { type: "string" }
                 }
               },
               required: ["current_score", "projected_scores", "recommendations"]
             }
           }
         }],
         tool_choice: { type: "function", function: { name: "forecast_scores" } }
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
       throw new Error("No forecast returned");
     }
 
     const forecast = JSON.parse(toolCall.function.arguments);
     
     // Ensure years are correct
     forecast.projected_scores = forecast.projected_scores.map((p: any, i: number) => ({
       ...p,
       year: currentYear + i + 1
     })).slice(0, 3);
     
     forecast.current_score = current_scores.overall || 0;
 
     return new Response(JSON.stringify(forecast), {
       headers: { ...corsHeaders, "Content-Type": "application/json" },
     });
   } catch (error) {
     console.error("forecast-score error:", error);
     return new Response(
       JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });