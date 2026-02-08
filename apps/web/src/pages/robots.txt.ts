import { getClient } from '../lib/sanity';
import { siteSettingsQuery } from '../queries';

export const prerender = false;

function normalizeCanonicalHost(urlOrOrigin: string) {
  try {
    const url = new URL(urlOrOrigin);
    if (url.hostname === 'pershyykrok.nl') {
      url.hostname = 'www.pershyykrok.nl';
    }
    return url.origin;
  } catch {
    return urlOrOrigin.replace(/\/$/, '');
  }
}

function getCanonicalOrigin(request: Request, configuredBaseUrl?: string) {
  if (configuredBaseUrl) return normalizeCanonicalHost(configuredBaseUrl);
  return normalizeCanonicalHost(new URL(request.url).origin);
}

export async function GET({ request }: { request: Request }) {
  const client = getClient({ preview: false });
  const siteSettings = await client.fetch<{ seo?: { canonicalBaseUrl?: string } } | null>(
    siteSettingsQuery
  );
  const origin = getCanonicalOrigin(request, siteSettings?.seo?.canonicalBaseUrl);
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
