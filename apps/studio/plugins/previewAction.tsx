import type { DocumentActionComponent, DocumentActionProps } from 'sanity';
import { buildPreviewUrl, getMissingPreviewEnv } from '../lib/previewUrl';

export const previewAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { draft, published } = props;
  const doc = (draft || published) as { _type?: string; _id?: string; language?: string; slug?: { current?: string } } | undefined;
  const docType = doc?._type;
  const isSupportedType = docType === 'homePage' || docType === 'page' || docType === 'faq' || docType === 'selfTest';

  const missingEnv = getMissingPreviewEnv();

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
        ? 'Preview is only available for Home Page, FAQ, Self-Assessment, and Page documents'
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
