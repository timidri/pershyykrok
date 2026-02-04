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
    actions: (prev) => [...prev, previewAction, deployAction],
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
          ]),
      defaultDocumentNode: (S, { schemaType }) =>
        schemaType === 'homePage' || schemaType === 'page'
          ? S.document().views([S.view.form(), S.view.component(PreviewPane).title('Preview')])
          : S.document(),
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
