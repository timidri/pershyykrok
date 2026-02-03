import type { AstroGlobal } from 'astro';

export function requirePreview(astro: AstroGlobal) {
  const previewSecret = import.meta.env.SANITY_PREVIEW_SECRET;
  const previewParam = astro.url.searchParams.get('preview');
  const secretParam = astro.url.searchParams.get('secret');
  const isPreview = previewParam === '1' && !!previewSecret && secretParam === previewSecret;

  if (!isPreview) {
    throw new Response('Unauthorized', { status: 401 });
  }

  if (!import.meta.env.SANITY_API_READ_TOKEN) {
    throw new Response('Preview token missing on server', { status: 500 });
  }

  return true;
}
