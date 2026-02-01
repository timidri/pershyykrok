import { defineType } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Generic Page',
  type: 'document',
  fields: [
    {
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true, // Optional: hides it from the UI so it doesn't clutter the form
    },
    { name: 'title', type: 'string', title: 'Page Title' },
    { 
      name: 'slug', 
      type: 'slug', 
      options: { source: 'title' },
      validation: Rule => Rule.required()
    },
    { 
      name: 'body', 
      title: 'Content', 
      type: 'array', 
      of: [{type: 'block'}] // Standard text editor
    }
  ]
})