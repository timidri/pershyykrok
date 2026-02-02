import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import { documentInternationalization } from '@sanity/document-internationalization'


export default defineConfig({
  name: 'default',
  title: 'pershyykrok',

  projectId: 'n1ug74wc',
  dataset: 'production',

  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.documentTypeListItem('homePage').title('Home Page'),
            S.documentTypeListItem('page').title('Pages'),
          ]),
    }),
    visionTool(),
    documentInternationalization({
      supportedLanguages: [
        { id: 'ua', title: 'Ukrainian' },
        { id: 'ru', title: 'Russian' }
      ],
      schemaTypes: ['homePage', 'page'], 
      languageField: 'language'
    })
  ],})
