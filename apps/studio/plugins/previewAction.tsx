import type { DocumentActionComponent, DocumentActionProps } from 'sanity';

type PreviewDocument = {
  _id?: string;
  _type?: string;
  language?: string;
  slug?: { current?: string };
};

function buildPreviewUrl(doc: PreviewDocument) {
  const baseUrl = import.meta.env.SANITY_STUDIO_PREVIEW_URL || '';
  const secret = import.meta.env.SANITY_STUDIO_PREVIEW_SECRET;
  const locale = doc.language || 'ua';

  if (!secret || !baseUrl) {
    return null;
  }

  const normalizedBase = baseUrl.replace(/\/$/, '');
  const slug = doc.slug?.current;

  const path =
    doc._type === 'homePage'
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
  if (doc._id) {
    url.searchParams.set('id', doc._id);
  }
  return url.toString();
}

export const previewAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { draft, published } = props;
  const doc = (draft || published) as PreviewDocument | undefined;
  const docType = doc?._type;
  const isSupportedType = docType === 'homePage' || docType === 'page';

  const missingEnv: string[] = [];
  if (!import.meta.env.SANITY_STUDIO_PREVIEW_URL) {
    missingEnv.push('SANITY_STUDIO_PREVIEW_URL');
  }
  if (!import.meta.env.SANITY_STUDIO_PREVIEW_SECRET) {
    missingEnv.push('SANITY_STUDIO_PREVIEW_SECRET');
  }

  const previewUrl = doc ? buildPreviewUrl(doc) : null;
  const disabled = !isSupportedType || !previewUrl;
  const missingEnvMessage =
    missingEnv.length > 0 ? `Missing env vars: ${missingEnv.join(', ')}` : undefined;

  return {
    label: !isSupportedType
      ? 'Preview unavailable'
      : missingEnvMessage
      ? 'Preview unavailable'
      : 'Open preview',
    title: disabled
      ? !isSupportedType
        ? 'Preview is only available for Home Page and Page documents'
        : missingEnvMessage ||
          'Preview requires a locale and (for pages) a slug, plus SANITY_STUDIO_PREVIEW_SECRET'
      : 'Open draft preview in a new tab',
    disabled,
    onHandle: () => {
      if (previewUrl) {
        window.open(previewUrl, '_blank', 'noopener');
      }
      props.onComplete();
    },
  };
};
