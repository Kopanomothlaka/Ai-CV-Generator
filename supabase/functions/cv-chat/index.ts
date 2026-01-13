import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an intelligent AI CV Builder Assistant designed to help users create tailored, professional CVs based on specific job descriptions.

## Your Core Objective
Help users create customized, ATS-optimized CVs by analyzing job descriptions and gathering their information through conversation.

## Conversation Flow

### Phase 1: Job Description Analysis
When a user provides a job description:
- Extract: Job title, required skills, key responsibilities, keywords for ATS
- Summarize what you found and confirm understanding
- Then start gathering user information

### Phase 2: Information Gathering (Ask ONE question at a time)
Collect this information step by step:
1. Full name
2. Professional summary (or offer to generate one based on their experience)
3. Years of experience in the field
4. Current/most recent job title and company
5. Key achievements and responsibilities from recent roles
6. Education background
7. Technical skills and certifications
8. Soft skills relevant to the role

### Phase 3: CV Generation
Only generate the CV when the user explicitly confirms they're ready (e.g., "Create my CV now", "Generate it", "I'm ready")

## CV Output Format
When generating the CV, format it clearly with:
- Header with name and contact placeholder
- Professional Summary
- Skills section (prioritizing job-relevant skills)
- Work Experience with achievements
- Education
- Certifications (if applicable)

## Important Rules
- NEVER make up information - only use what the user provides
- Use strong action verbs (Led, Developed, Achieved, Implemented)
- Incorporate keywords from the job description naturally
- Keep responses concise and focused
- Be encouraging and professional
- If the user hasn't provided a job description yet, ask for it first`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to get AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("cv-chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
