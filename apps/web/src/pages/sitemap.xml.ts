import { getClient } from '../lib/sanity';
import { allPageSlugsQuery, siteSettingsQuery } from '../queries';

export const prerender = false;

type SlugRow = { locale?: string; slug?: string };

function toUrl(base: string, path: string) {
  const normalizedBase = base.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

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

function getCanonicalBase(request: Request, configuredBaseUrl?: string) {
  if (configuredBaseUrl) return normalizeCanonicalHost(configuredBaseUrl);

  const url = new URL(request.url);
  return normalizeCanonicalHost(url.origin);
}

export async function GET({ request }: { request: Request }) {
  const client = getClient({ preview: false });
  const [siteSettings, slugs] = await Promise.all([
    client.fetch<{ seo?: { canonicalBaseUrl?: string } } | null>(siteSettingsQuery),
    client.fetch<SlugRow[]>(allPageSlugsQuery),
  ]);

  const base = getCanonicalBase(request, siteSettings?.seo?.canonicalBaseUrl);
  const urls = new Set<string>();

  urls.add(toUrl(base, '/ua/'));
  urls.add(toUrl(base, '/ru/'));

  (slugs || []).forEach((row) => {
    if (!row?.locale || !row?.slug) return;
    urls.add(toUrl(base, `/${row.locale}/${row.slug}`));
  });

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from(urls)
  .map((loc) => `  <url><loc>${loc}</loc></url>`)
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
