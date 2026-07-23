// Next.js API Route that properly streams SSE from FastAPI without buffering
// This replaces the rewrites proxy for /api/chat which was killing SSE streaming

export async function POST(request) {
  const body = await request.json();

  // Forward the request to FastAPI backend
  const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";
  
  const backendResponse = await fetch(`${backendUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!backendResponse.ok) {
    return new Response(
      JSON.stringify({ error: "Backend error" }),
      { status: backendResponse.status, headers: { "Content-Type": "application/json" } }
    );
  }

  // Stream the SSE response through without buffering
  const stream = new ReadableStream({
    async start(controller) {
      const reader = backendResponse.body.getReader();
      const encoder = new TextEncoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          // Forward each chunk immediately — no buffering!
          controller.enqueue(value);
        }
      } catch (error) {
        console.error("Stream error:", error);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no", // Tells Render/nginx to NOT buffer
    },
  });
}
