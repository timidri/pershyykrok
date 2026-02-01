import { defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    // --- Header ---
    {
      name: 'logo',
      type: 'image',
      title: 'Site Logo'
    },
    {
      name: 'headerSlogan',
      title: 'Header Slogan', 
      description: 'Text like "You are not alone..."',
      type: 'object',
      // Field-level translation since this object is shared globally
      fields: [
        { name: 'ru', type: 'string', title: 'Russian' },
        { name: 'ua', type: 'string', title: 'Ukrainian' }
      ]
    },
    
    // --- Navigation (Manual Control) ---
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
      title: 'Footer Copyright',
      type: 'object',
      fields: [
        { name: 'ru', type: 'string', title: 'Russian' },
        { name: 'ua', type: 'string', title: 'Ukrainian' }
      ]
    }
  ]
})