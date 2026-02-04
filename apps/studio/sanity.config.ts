import {defineConfig} from 'sanity'
import {structureTool, type StructureBuilder} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import { documentInternationalization } from '@sanity/document-internationalization'
import {PortableTextEditorPlugins} from './plugins/pte'
import { previewAction } from './plugins/previewAction'
import { deployAction } from './plugins/deployAction'
import { PreviewPane } from './components/PreviewPane'
import { DeployToolbar } from './components/DeployToolbar'

export default defineConfig({
  name: 'default',
  title: 'pershyykrok',

  projectId: 'n1ug74wc',
  dataset: 'production',
  studio: {
    components: {
      navbar: DeployToolbar,
    },
  },

  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (prev, context) => {
      const type = context?.schemaType
      if (type === 'faq' || type === 'selfTest') {
        return prev.filter((action) => action.action !== 'duplicate')
      }
      return [...prev, previewAction, deployAction]
    },
  },
  form: {
    components: {
      portableText: {
        plugins: PortableTextEditorPlugins,
      },
    },
  },
  plugins: [
    structureTool({
      structure: (S: StructureBuilder) =>
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
            S.listItem()
              .title('FAQ')
              .child(
                S.documentList()
                  .title('FAQ')
                  .filter('_type == \"faq\"')
                  .menuItems([])
              ),
            S.listItem()
              .title('Self-Assessment')
              .child(
                S.documentList()
                  .title('Self-Assessment')
                  .filter('_type == \"selfTest\"')
                  .menuItems([])
              ),
          ]),
      newDocumentOptions: (prev, { creationContext }) => {
        if (creationContext.type === 'global') {
          return prev.filter((item) => item.schemaType !== 'faq' && item.schemaType !== 'selfTest')
        }
        return prev
      },
      defaultDocumentNode: (S, { schemaType }) =>
        schemaType === 'homePage' ||
        schemaType === 'page' ||
        schemaType === 'faq' ||
        schemaType === 'selfTest'
          ? S.document().views([S.view.form(), S.view.component(PreviewPane).title('Preview')])
          : S.document(),
    }),
    visionTool(),
    documentInternationalization({
      supportedLanguages: [
        { id: 'ua', title: 'Ukrainian' },
        { id: 'ru', title: 'Russian' }
      ],
      schemaTypes: ['homePage', 'page', 'faq', 'selfTest'], 
      languageField: 'language'
    })
  ],})
