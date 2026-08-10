export function GET() {
  return new Response("This resource is no longer available.", {
    status: 410,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}

export const HEAD = GET;
