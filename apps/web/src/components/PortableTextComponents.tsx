import type { PortableTextReactComponents } from '@portabletext/react';
import { urlForImage } from '../lib/sanity';

/** Block content: alignment marks (left/center/right) + image type. */
export const portableTextBlockComponents: Partial<PortableTextReactComponents> = {
  marks: {
    left: ({ children }) => <span className="block w-full text-left">{children}</span>,
    center: ({ children }) => <span className="block w-full text-center">{children}</span>,
    right: ({ children }) => <span className="block w-full text-right">{children}</span>,
  },
  types: {
    image: ({ value }: { value: { asset?: { _ref?: string }; caption?: string } }) => {
      if (!value?.asset) return null;
      const url = urlForImage(value).width(800).url();
      if (!url) return null;
      return (
        <figure className="my-6">
          <img src={url} alt={value.caption ?? ''} className="w-full rounded" />
          {value.caption && (
            <figcaption className="mt-2 text-body text-gray-600 text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};
