import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const requireFromWeb = createRequire(new URL('../apps/web/package.json', import.meta.url));
const { createClient } = requireFromWeb('@sanity/client');

const envPath = path.resolve(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('Missing .env.local at repo root');
  process.exit(1);
}

const envText = fs.readFileSync(envPath, 'utf8');
const env = {};
for (const line of envText.split(/\r?\n/)) {
  if (!line || line.trim().startsWith('#')) continue;
  const idx = line.indexOf('=');
  if (idx === -1) continue;
  const key = line.slice(0, idx).trim();
  let val = line.slice(idx + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  env[key] = val;
}

const token = env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error('SANITY_API_WRITE_TOKEN not found in .env.local');
  process.exit(1);
}

const client = createClient({
  projectId: 'n1ug74wc',
  dataset: 'production',
  apiVersion: '2024-02-01',
  useCdn: false,
  token,
});

const block = (text, style = 'normal') => ({
  _type: 'block',
  style,
  _key: Math.random().toString(36).slice(2),
  children: [
    {
      _type: 'span',
      _key: Math.random().toString(36).slice(2),
      text,
      marks: [],
    },
  ],
  markDefs: [],
});

const faqDoc = {
  _type: 'faq',
  _id: 'faq-ru',
  language: 'ru',
  title: 'Часто задаваемые вопросы',
  slug: { _type: 'slug', current: 'faq-ru' },
  intro: [
    block('Краткие ответы на самые частые вопросы о встречах Анонимных Алкоголиков в Гааге.'),
  ],
  items: [
    {
      _type: 'object',
      _key: 'faq1',
      question: 'Что такое Анонимные Алкоголики (АА)?',
      answer: [
        block(
          'АА — это сообщество людей, которые помогают друг другу сохранять трезвость, делясь опытом и поддерживая друг друга.'
        ),
      ],
    },
    {
      _type: 'object',
      _key: 'faq2',
      question: 'Кто может посещать встречи?',
      answer: [block('Любой, кто хочет решить свою проблему с алкоголем. Участие добровольное.')],
    },
    {
      _type: 'object',
      _key: 'faq3',
      question: 'Сколько стоит посещение?',
      answer: [block('Встречи бесплатны. АА не имеет членских взносов.')],
    },
    {
      _type: 'object',
      _key: 'faq4',
      question: 'Нужно ли регистрироваться заранее?',
      answer: [block('Нет, можно просто прийти на встречу.')],
    },
    {
      _type: 'object',
      _key: 'faq5',
      question: 'Анонимно ли это?',
      answer: [block('Да. Анонимность — основа сообщества, и личная информация не разглашается.')],
    },
  ],
};

const selfTestDoc = {
  _type: 'selfTest',
  _id: 'selfTest-ru',
  language: 'ru',
  title: 'Самопроверка',
  slug: { _type: 'slug', current: 'self-test-ru' },
  intro: [block('Ответьте «Да» или «Нет» на вопросы ниже. Подсчёт количества ответов «Да» ведётся автоматически.')],
  questions: [
    { _type: 'object', _key: 'q1', text: 'Вы когда‑нибудь решали не пить неделю или около того, но выдерживали только пару дней?' },
    { _type: 'object', _key: 'q2', text: 'Хотели бы вы, чтобы люди не лезли в ваши дела из‑за выпивки и не указывали вам, что делать?' },
    { _type: 'object', _key: 'q3', text: 'Пробовали ли вы переходить с одного напитка на другой в надежде, что это поможет не напиться?' },
    { _type: 'object', _key: 'q4', text: 'Приходилось ли вам в течение последнего года выпивать с утра после пробуждения?' },
    { _type: 'object', _key: 'q5', text: 'Завидуете ли вы людям, которые могут пить и не иметь проблем?' },
    { _type: 'object', _key: 'q6', text: 'Были ли у вас проблемы, связанные с употреблением алкоголя, за последний год?' },
    { _type: 'object', _key: 'q7', text: 'Создавало ли ваше употребление алкоголя проблемы дома?' },
    { _type: 'object', _key: 'q8', text: 'Пытаетесь ли вы получить «дополнительные» напитки на вечеринке, потому что вам «не хватает»?' },
    { _type: 'object', _key: 'q9', text: 'Говорите ли вы себе, что можете бросить пить в любой момент, хотя затем всё равно напиваетесь?' },
    { _type: 'object', _key: 'q10', text: 'Пропускали ли вы работу или учебу из‑за алкоголя?' },
    { _type: 'object', _key: 'q11', text: 'Бывали ли у вас «провалы в памяти»?' },
    { _type: 'object', _key: 'q12', text: 'Думали ли вы, что жизнь была бы лучше, если бы вы не пили?' },
  ],
  resultCopy: [
    block(
      'Эти вопросы предназначены для самооценки. Только вы можете решить, нужна ли вам помощь. Если вы хотите узнать больше, приходите на встречу или свяжитесь с нами.'
    ),
  ],
};

const main = async () => {
  const faqExisting = await client.fetch('*[_type == \"faq\" && language == \"ru\"][0]{_id}');
  const selfExisting = await client.fetch('*[_type == \"selfTest\" && language == \"ru\"][0]{_id}');

  if (faqExisting?._id && faqExisting._id !== faqDoc._id) {
    faqDoc._id = faqExisting._id;
  }
  if (selfExisting?._id && selfExisting._id !== selfTestDoc._id) {
    selfTestDoc._id = selfExisting._id;
  }

  await client.createOrReplace(faqDoc);
  await client.createOrReplace(selfTestDoc);

  console.log('Created/updated RU FAQ and Self-Test documents:', faqDoc._id, selfTestDoc._id);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
