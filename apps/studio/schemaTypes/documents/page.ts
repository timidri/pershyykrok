import {defineType} from 'sanity'
import {isUniqueSlugByLang} from '../utils/isUniqueSlugByLang'

export default defineType({
  name: 'page',
  title: 'Generic Page',
  type: 'document',
  preview: {
    select: {title: 'title', slug: 'slug.current', language: 'language'},
    prepare({title, slug, language}) {
      const parts = [language, slug].filter(Boolean)
      return {
        title: title ?? 'Untitled',
        subtitle: parts.length > 0 ? parts.join(' · ') : undefined,
      }
    },
  },
  fields: [
    {
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true, // Optional: hides it from the UI so it doesn't clutter the form
    },
    {name: 'title', type: 'string', title: 'Page Title'},
    {
      name: 'slug',
      type: 'slug',
      options: {source: 'title', isUnique: isUniqueSlugByLang},
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'body',
      title: 'Content',
      type: 'blockContent',
    },
  ],
})
