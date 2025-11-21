import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { prompt, task, context } = await req.json();
    let result = {};

    switch (task) {
      case 'generate_description':
        result = { description: 'AI-generated description for business' };
        break;
      case 'generate_post':
        result = { title: 'Latest Update', content: 'AI-generated post content' };
        break;
      case 'generate_review_reply':
        result = { reply: 'Thank you for your feedback!' };
        break;
      default:
        result = { text: 'AI-generated content' };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
