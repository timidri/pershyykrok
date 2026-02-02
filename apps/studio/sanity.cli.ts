import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'n1ug74wc',
    dataset: 'production'
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
  /**
   * NEW: Modern TypeGen Configuration
   * This replaces sanity-typegen.json
   */
  typegen: {
    // 1. Where to output the types
    generates: '../web/src/sanity-types.ts',
    
    // 2. The schema file (created by 'extract')
    schema: './schema.json',
    
    // 3. THE FIX: Only scan .ts files. 
    // We explicitly exclude .astro files to stop the "return" error.
    path: '../web/src/**/*.ts' 
  }
})
