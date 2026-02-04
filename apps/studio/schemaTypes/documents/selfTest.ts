import { defineType } from 'sanity'

export default defineType({
  name: 'selfTest',
  title: 'Self-Assessment',
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
      name: 'questions',
      title: 'Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Question',
          fields: [{ name: 'text', type: 'string', title: 'Text' }],
          preview: {
            select: { title: 'text' },
          },
        },
      ],
    },
    {
      name: 'resultCopy',
      title: 'Result Copy (optional)',
      type: 'blockContent',
    },
  ],
})
