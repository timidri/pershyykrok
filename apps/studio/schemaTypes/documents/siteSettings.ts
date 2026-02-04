import { defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'settings', title: 'Settings', default: true },
    { name: 'menu', title: 'Menu' },
    { name: 'seo', title: 'SEO' }
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
  fields: [
    // --- Header ---
    {
      name: 'logo',
      type: 'image',
      title: 'Site Logo',
      group: 'settings'
    },
    // --- Navigation ---
    {
      name: 'mainMenuRu',
      title: 'Main Menu (Russian)',
      group: 'menu',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Link',
          preview: {
            select: {
              label: 'label',
              refTitle: 'link.title',
              refSlug: 'link.slug.current',
              refLang: 'link.language',
            },
            prepare({ label, refTitle, refSlug, refLang }) {
              const parts = [refLang, refSlug].filter(Boolean)
              return {
                title: label || refTitle || 'Link',
                subtitle: parts.length > 0 ? parts.join(' · ') : undefined,
              }
            },
          },
          fields: [
            { name: 'label', type: 'string', title: 'Label' },
            { name: 'link', type: 'reference', to: [{ type: 'page'}, { type: 'homePage' }, { type: 'faq' }, { type: 'selfTest' }] }
          ]
        }
      ]
    },
    {
      name: 'mainMenuUa',
      title: 'Main Menu (Ukrainian)',
      group: 'menu',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Link',
          preview: {
            select: {
              label: 'label',
              refTitle: 'link.title',
              refSlug: 'link.slug.current',
              refLang: 'link.language',
            },
            prepare({ label, refTitle, refSlug, refLang }) {
              const parts = [refLang, refSlug].filter(Boolean)
              return {
                title: label || refTitle || 'Link',
                subtitle: parts.length > 0 ? parts.join(' · ') : undefined,
              }
            },
          },
          fields: [
            { name: 'label', type: 'string', title: 'Label' },
            { name: 'link', type: 'reference', to: [{ type: 'page'}, { type: 'homePage' }, { type: 'faq' }, { type: 'selfTest' }] }
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
      group: 'settings',
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
      group: 'settings',
      fields: [
        { name: 'address', type: 'string', title: 'Address' },
        { name: 'phone', type: 'string', title: 'Phone Number' },
        { name: 'website', type: 'url', title: 'Website URL' },
        {
          name: 'mapLocation',
          type: 'geopoint',
          title: 'Map coordinates',
          description: 'Location for the map on the homepage (lat/lng). Altitude is optional.'
        }
      ]
    },

    // --- SEO ---
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      fields: [
        {
          name: 'title',
          title: 'Default SEO Title',
          type: 'object',
          fields: [
            { name: 'ua', type: 'string', title: 'Ukrainian' },
            { name: 'ru', type: 'string', title: 'Russian' }
          ]
        },
        {
          name: 'description',
          title: 'Default Meta Description',
          type: 'object',
          fields: [
            { name: 'ua', type: 'text', title: 'Ukrainian', rows: 3 },
            { name: 'ru', type: 'text', title: 'Russian', rows: 3 }
          ]
        },
        {
          name: 'ogImage',
          type: 'image',
          title: 'Open Graph Image'
        },
        {
          name: 'ogImageAlt',
          type: 'object',
          title: 'Open Graph Image Alt',
          fields: [
            { name: 'ua', type: 'string', title: 'Ukrainian' },
            { name: 'ru', type: 'string', title: 'Russian' }
          ]
        },
        {
          name: 'canonicalBaseUrl',
          type: 'url',
          title: 'Canonical Base URL',
          description: 'Example: https://example.org'
        }
      ]
    }
  ]
})
