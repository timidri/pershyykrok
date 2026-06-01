import { defineType, type SlugIsUniqueFn } from 'sanity'

const isUniqueSlugByLang: SlugIsUniqueFn = async (slug, context) => {
  const { document, getClient } = context
  const currentId = document?._id?.replace(/^drafts\./, '')
  const draftId = currentId ? `drafts.${currentId}` : undefined
  const language = (document as { language?: string } | undefined)?.language

  if (!slug?.current || !language) return true

  const client = getClient({ apiVersion: '2023-10-16' })
  const query =
    '*[_type == $type && slug.current == $slug && language == $language && !(_id in [$id, $draftId])][0]._id'
  const params = {
    type: document?._type,
    slug: slug.current,
    language,
    id: currentId,
    draftId,
  }

  const existingId = await client.fetch<string | null>(query, params)
  return !existingId
}

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
      options: { source: 'title', isUnique: isUniqueSlugByLang },
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
