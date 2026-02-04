export const prerender = false;

export function GET({ request }: { request: Request }) {
  const origin = new URL(request.url).origin;
  const body = `User-agent: *
Allow: /
Sitemap: ${origin}/sitemap.xml
`;

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
