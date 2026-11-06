// Small helpers shared by every route handler (app/api/**/route.js).

export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/** Wrap a handler so thrown HttpErrors become JSON responses. */
export const handler = (fn) => async (request, ctx) => {
  try {
    return await fn(request, ctx);
  } catch (err) {
    if (err instanceof HttpError) {
      return Response.json({ error: err.message, details: err.details }, { status: err.status });
    }
    console.error("[api] unhandled error", err);
    return Response.json({ error: "Terjadi kesalahan di server" }, { status: 500 });
  }
};

/** Parse + validate a JSON body with a zod schema. */
export async function readBody(request, schema) {
  let raw;
  try {
    raw = await request.json();
  } catch {
    throw new HttpError(400, "Body harus berupa JSON");
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throw new HttpError(
      400,
      "Data tidak valid",
      parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    );
  }
  return parsed.data;
}

/** Route params are a Promise in Next 15+. */
export const getParams = async (ctx) => (await ctx.params) ?? {};
