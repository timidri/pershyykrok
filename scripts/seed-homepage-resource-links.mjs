import fs from 'node:fs'
import path from 'node:path'
import {createRequire} from 'node:module'

const requireFromWeb = createRequire(new URL('../apps/web/package.json', import.meta.url))
const {createClient} = requireFromWeb('@sanity/client')

const envPath = path.resolve(process.cwd(), '.env.local')
const env = {...process.env}

if (fs.existsSync(envPath)) {
  const envText = fs.readFileSync(envPath, 'utf8')
  for (const line of envText.split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue
    const idx = line.indexOf('=')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    env[key] = val
  }
}

const token = env.SANITY_API_WRITE_TOKEN
if (!token) {
  console.error('SANITY_API_WRITE_TOKEN not found in the environment or repo-root .env.local')
  process.exit(1)
}

const client = createClient({
  projectId: 'n1ug74wc',
  dataset: 'production',
  apiVersion: '2024-02-01',
  useCdn: false,
  token,
})

const resourceLinksByLanguage = {
  ua: {
    sectionTitle: 'Ресурси АА',
    description:
      'Перевірені сторінки, де можна знайти нашу групу, інші україномовні зустрічі та загальну інформацію про АА.',
    linkPrompt: 'Перейти',
    items: [
      {
        _type: 'object',
        _key: 'aa-netherlands',
        label: 'Pershyy Krok в AA Netherlands',
        description: 'Актуальна сторінка нашої групи в офіційному списку зустрічей AA Netherlands.',
        href: 'https://aa-netherlands.org/aa-meetings/find-a-meeting/pershyy-krok/',
      },
      {
        _type: 'object',
        _key: 'aa-ukraine-abroad',
        label: 'Україномовні групи за кордоном',
        description: 'Список АА України з україномовними групами та контактами поза Україною.',
        href: 'https://aa.org.ua/ukrainomovni-hrupy-za-kordonom/',
      },
      {
        _type: 'object',
        _key: 'aa-continental-europe',
        label: 'A.A. Continental European Region',
        description: 'Ресурси АА для англомовних груп у континентальній Європі.',
        href: 'https://alcoholics-anonymous.eu/',
      },
      {
        _type: 'object',
        _key: 'aa-world-services',
        label: 'Alcoholics Anonymous',
        description: 'Головний сайт Alcoholics Anonymous World Services з інформацією про програму АА.',
        href: 'https://www.aa.org/',
      },
    ],
  },
  ru: {
    sectionTitle: 'Ресурсы АА',
    description:
      'Проверенные страницы, где можно найти нашу группу, другие украиноязычные встречи и общую информацию об АА.',
    linkPrompt: 'Перейти',
    items: [
      {
        _type: 'object',
        _key: 'aa-netherlands',
        label: 'Pershyy Krok в AA Netherlands',
        description: 'Актуальная страница нашей группы в официальном списке встреч AA Netherlands.',
        href: 'https://aa-netherlands.org/aa-meetings/find-a-meeting/pershyy-krok/',
      },
      {
        _type: 'object',
        _key: 'aa-ukraine-abroad',
        label: 'Украиноязычные группы за рубежом',
        description: 'Список АА Украины с украиноязычными группами и контактами за пределами Украины.',
        href: 'https://aa.org.ua/ukrainomovni-hrupy-za-kordonom/',
      },
      {
        _type: 'object',
        _key: 'aa-continental-europe',
        label: 'A.A. Continental European Region',
        description: 'Ресурсы АА для англоязычных групп в континентальной Европе.',
        href: 'https://alcoholics-anonymous.eu/',
      },
      {
        _type: 'object',
        _key: 'aa-world-services',
        label: 'Alcoholics Anonymous',
        description: 'Главный сайт Alcoholics Anonymous World Services с информацией о программе АА.',
        href: 'https://www.aa.org/',
      },
    ],
  },
}

const main = async () => {
  for (const [language, resourceLinksSection] of Object.entries(resourceLinksByLanguage)) {
    const homePage = await client.fetch('*[_type == "homePage" && language == $language][0]{_id}', {
      language,
    })

    if (!homePage?._id) {
      console.warn(`Skipped ${language}: no homePage document found`)
      continue
    }

    await client.patch(homePage._id).set({resourceLinksSection}).commit()
    console.log(`Updated ${language} homepage resource links: ${homePage._id}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
