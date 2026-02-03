import type { DocumentViewComponentProps } from 'sanity';
import { buildPreviewUrl, getMissingPreviewEnv } from '../lib/previewUrl';

export function PreviewPane(props: DocumentViewComponentProps) {
  const doc =
    (props.document?.displayed as { _type?: string; _id?: string; language?: string; slug?: { current?: string } } | undefined) ||
    (props.document?.draft as { _type?: string; _id?: string; language?: string; slug?: { current?: string } } | undefined) ||
    (props.document?.published as { _type?: string; _id?: string; language?: string; slug?: { current?: string } } | undefined);

  const missingEnv = getMissingPreviewEnv();
  const url = buildPreviewUrl(doc);

  if (missingEnv.length > 0) {
    return (
      <div style={{ padding: '1.5rem', fontFamily: 'sans-serif' }}>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>Preview unavailable</h3>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          Missing env vars: {missingEnv.join(', ')}
        </p>
      </div>
    );
  }

  if (!url) {
    return (
      <div style={{ padding: '1.5rem', fontFamily: 'sans-serif' }}>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>Preview unavailable</h3>
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          Preview is only available for Home Page and Page documents with a slug.
        </p>
      </div>
    );
  }

  return (
    <iframe
      title="Preview"
      src={url}
      style={{ width: '100%', height: '100%', border: 0 }}
    />
  );
}
