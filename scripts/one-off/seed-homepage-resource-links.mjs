import fs from 'node:fs'
import path from 'node:path'
import {createRequire} from 'node:module'
import {fileURLToPath} from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const requireFromWeb = createRequire(new URL('../../apps/web/package.json', import.meta.url))
const {createClient} = requireFromWeb('@sanity/client')

const envPath = path.join(repoRoot, '.env.local')
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
    sectionTitle: 'Матеріали для читання на зустрічі',
    description:
      'Посилання на тексти, які ми зазвичай читаємо під час зустрічі: розділ з Великої Книги, Перший Крок з «12 і 12» та щоденні роздуми.',
    linkPrompt: 'Відкрити',
    items: [
      {
        _key: 'big-book-how-it-works',
        label: '«Як воно діє» з Великої Книги',
        description: 'Розділ 5 книги «Анонімні Алкоголіки» у PDF на сайті АА України.',
        href: 'https://aa.org.ua/wp-content/uploads/2024/07/Anonimni-Alkogoliki-internet_25.03.22.pdf#page=72',
      },
      {
        _key: 'twelve-and-twelve-step-one',
        label: 'Перший Крок з «12 і 12»',
        description:
          'Офіційна сторінка книжки «Дванадцять Кроків і Дванадцять Традицій» українською.',
        href: 'https://aa.org.ua/literature/dvanadtsiat-krokiv-ta-dvanadtsiat-tradytsiy/',
      },
      {
        _key: 'daily-reflections',
        label: 'Щоденні роздуми',
        description: 'Українське видання щоденних роздумів на сайті АА України.',
        href: 'https://aa.org.ua/wp-content/uploads/2026/05/SHCHodenni-rozdumy-dlia-WEB.pdf',
      },
    ],
  },
  ru: {
    sectionTitle: 'Материалы для чтения на встрече',
    description:
      'Ссылки на тексты, которые мы обычно читаем во время встречи: раздел из Большой Книги, Первый Шаг из «12 и 12» и ежедневные размышления.',
    linkPrompt: 'Открыть',
    items: [
      {
        _key: 'big-book-how-it-works',
        label: '«Программа в действии» из Большой Книги',
        description: 'Глава 5 книги «Анонимные Алкоголики» в PDF на сайте АА Украины.',
        href: 'https://aa.org.ua/wp-content/uploads/2024/09/Anonimnye-alkogoliki.-S-istoriyami.pdf#page=92',
      },
      {
        _key: 'twelve-and-twelve-step-one',
        label: 'Первый Шаг из «12 и 12»',
        description:
          'Официальная страница книги «Двенадцать Шагов и Двенадцать Традиций» на русском.',
        href: 'https://aa.org.ua/literature/dvenadtsat-shahov-y-dvenadtsat-tradytsyy/',
      },
      {
        _key: 'daily-reflections',
        label: 'Ежедневные размышления',
        description: 'Русская страница ежедневных размышлений на сайте АА Украины.',
        href: 'https://aa.org.ua/literature/shchodenni-rozdumy/',
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
