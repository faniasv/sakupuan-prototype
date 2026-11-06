export const dynamic = "force-dynamic";

// GET /api/health - uptime check
export async function GET() {
  return Response.json({ ok: true, time: new Date().toISOString() });
}
