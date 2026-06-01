import type {SlugIsUniqueFn} from 'sanity'

export const isUniqueSlugByLang: SlugIsUniqueFn = async (slug, context) => {
  const {document, getClient} = context
  const currentId = document?._id?.replace(/^drafts\./, '')
  const draftId = currentId ? `drafts.${currentId}` : undefined
  const language = (document as {language?: string} | undefined)?.language

  if (!slug?.current || !language) return true

  const client = getClient({apiVersion: '2023-10-16'})
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
