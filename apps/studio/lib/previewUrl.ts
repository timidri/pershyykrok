type PreviewDocument = {
  _id?: string;
  _type?: string;
  language?: string;
  slug?: { current?: string };
};

export function getMissingPreviewEnv(): string[] {
  const missing: string[] = [];
  if (!import.meta.env.SANITY_STUDIO_PREVIEW_URL) {
    missing.push('SANITY_STUDIO_PREVIEW_URL');
  }
  if (!import.meta.env.SANITY_STUDIO_PREVIEW_SECRET) {
    missing.push('SANITY_STUDIO_PREVIEW_SECRET');
  }
  return missing;
}

export function buildPreviewUrl(doc: PreviewDocument | undefined) {
  const baseUrl = import.meta.env.SANITY_STUDIO_PREVIEW_URL || '';
  const secret = import.meta.env.SANITY_STUDIO_PREVIEW_SECRET;
  const locale = doc?.language || 'ua';

  if (!secret || !baseUrl) {
    return null;
  }

  const normalizedBase = baseUrl.replace(/\/$/, '');
  const slug = doc?.slug?.current;

  const path =
    doc?._type === 'homePage'
      ? `/preview/${locale}`
      : slug
      ? `/preview/${locale}/${slug}`
      : null;

  if (!path) {
    return null;
  }

  const url = new URL(`${normalizedBase}${path}`);
  url.searchParams.set('preview', '1');
  url.searchParams.set('secret', secret);
  if (doc?._id) {
    url.searchParams.set('id', doc._id);
  }
  return url.toString();
}
