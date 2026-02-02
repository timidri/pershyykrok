import { defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
  fields: [
    // --- Header ---
    {
      name: 'logo',
      type: 'image',
      title: 'Site Logo'
    },

    // --- Navigation ---
    {
      name: 'mainMenuRu',
      title: 'Main Menu (Russian)',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Link',
          fields: [
            { name: 'label', type: 'string', title: 'Label' },
            { name: 'link', type: 'reference', to: [{ type: 'page'}, { type: 'homePage' }] }
          ]
        }
      ]
    },
    {
      name: 'mainMenuUa',
      title: 'Main Menu (Ukrainian)',
      type: 'array',
      of: [
         {
          type: 'object',
          title: 'Link',
          fields: [
            { name: 'label', type: 'string', title: 'Label' },
            { name: 'link', type: 'reference', to: [{ type: 'page'}, { type: 'homePage' }] }
          ]
        }
      ]
    },

    // --- Footer ---
    {
      name: 'footerText',
      title: 'Footer Text (copyright and org info)',
      description: 'Use newlines for multiple lines. Shown in footer left block.',
      type: 'object',
      fields: [
        { name: 'ru', type: 'text', title: 'Russian', rows: 4 },
        { name: 'ua', type: 'text', title: 'Ukrainian', rows: 4 }
      ]
    },
    {
      name: 'contact',
      title: 'Contact (used in meeting block, button, and footer)',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        { name: 'address', type: 'string', title: 'Address' },
        { name: 'phone', type: 'string', title: 'Phone Number' },
        { name: 'website', type: 'url', title: 'Website URL' }
      ]
    }
  ]
})