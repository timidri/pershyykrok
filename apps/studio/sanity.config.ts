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
    structureTool(),
    visionTool(),
    documentInternationalization({
      supportedLanguages: [
        { id: 'ru', title: 'Russian' },
        { id: 'ua', title: 'Ukrainian' }
      ],
      schemaTypes: ['homePage', 'page'], 
      languageField: 'language'
    })
  ],})
