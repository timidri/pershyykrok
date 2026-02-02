import { defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  preview: {
    select: { title: 'title', language: 'language' },
    prepare({ title, language }) {
      return {
        title: title ?? 'Untitled',
        subtitle: language ?? undefined,
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
    {
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'For dashboard reference (e.g. "Home Page - RU")'
    },
    // Top Section
    {
      name: 'introText',
      title: 'Introduction Text',
      description: 'The main text above the map section',
      type: 'blockContent',
    },
    
    // --- Meeting Details (Fixed Layout) ---
    {
      name: 'meetingSection',
      title: 'Meeting Details Section',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: 'sectionTitle', type: 'string', title: 'Section Title' },
        { name: 'time', type: 'string', title: 'Time' },
        { name: 'languages', type: 'string', title: 'Languages' }
      ]
    }
  ]
})