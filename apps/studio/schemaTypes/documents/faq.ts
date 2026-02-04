import { defineType } from 'sanity'

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  preview: {
    select: { title: 'title', slug: 'slug.current', language: 'language' },
    prepare({ title, slug, language }) {
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
      hidden: true,
    },
    { name: 'title', type: 'string', title: 'Page Title' },
    {
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'intro',
      title: 'Introduction',
      type: 'blockContent',
    },
    {
      name: 'items',
      title: 'Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'FAQ Item',
          fields: [
            { name: 'question', type: 'string', title: 'Question' },
            { name: 'answer', type: 'blockContent', title: 'Answer' },
          ],
          preview: {
            select: { title: 'question' },
          },
        },
      ],
    },
  ],
})
