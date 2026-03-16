export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({
          error: "Method not allowed. Use POST.",
        }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    try {
      const body = await request.json();
      const { system, messages, model, max_tokens } = body || {};

      if (!messages || !Array.isArray(messages)) {
        return new Response(
          JSON.stringify({ error: "Missing messages array." }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }

      const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: model || "claude-sonnet-4-20250514",
          max_tokens: max_tokens || 1000,
          system: system || "",
          messages,
        }),
      });

      const data = await anthropicRes.json();

      if (!anthropicRes.ok) {
        return new Response(
          JSON.stringify({
            error: "Anthropic request failed",
            details: data,
          }),
          {
            status: anthropicRes.status,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }

      const reply =
        data?.content?.find((item) => item.type === "text")?.text ||
        "Something went wrong. Try again.";

      return new Response(JSON.stringify({ reply, raw: data }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Worker crashed",
          message: error?.message || "Unknown error",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }
  },
};
