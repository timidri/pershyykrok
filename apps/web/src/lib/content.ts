import type {
  BlockContent,
  HomePageQueryResult,
  PageBySlugQueryResult,
  SiteSettingsQueryResult,
} from '../sanity-types';
import {
  faqBySlugQuery,
  homePageQuery,
  pageBySlugQuery,
  previewDocByIdQuery,
  selfTestBySlugQuery,
  siteSettingsQuery,
} from '../queries';
import { getClient } from './sanity';

export type FaqDoc = {
  title?: string;
  intro?: BlockContent | null;
  items?: Array<{ question?: string; answer?: BlockContent | null }>;
  slug?: { current?: string };
};

export type SelfTestDoc = {
  title?: string;
  intro?: BlockContent | null;
  questions?: Array<{ text?: string }>;
  resultCopy?: BlockContent | null;
  slug?: { current?: string };
};

export async function fetchHomePageData({
  locale,
  preview = false,
}: {
  locale: string;
  preview?: boolean;
}) {
  const client = getClient({ preview });
  const [data, siteSettings] = await Promise.all([
    client.fetch<HomePageQueryResult>(homePageQuery, { locale }),
    client.fetch<SiteSettingsQueryResult | null>(siteSettingsQuery),
  ]);

  return { data, siteSettings };
}

export async function fetchSiteSettings({ preview = false }: { preview?: boolean }) {
  const client = getClient({ preview });
  const siteSettings = await client.fetch<SiteSettingsQueryResult | null>(siteSettingsQuery);
  return siteSettings;
}

export async function fetchPageBySlugData({
  locale,
  slug,
  preview = false,
}: {
  locale: string;
  slug: string;
  preview?: boolean;
}) {
  const client = getClient({ preview });
  const data = await client.fetch<PageBySlugQueryResult>(pageBySlugQuery, { locale, slug });
  return data;
}

export async function fetchFaqBySlugData({
  locale,
  slug,
  preview = false,
}: {
  locale: string;
  slug: string;
  preview?: boolean;
}) {
  const client = getClient({ preview });
  const data = await client.fetch<FaqDoc>(faqBySlugQuery, { locale, slug });
  return data;
}

export async function fetchSelfTestBySlugData({
  locale,
  slug,
  preview = false,
}: {
  locale: string;
  slug: string;
  preview?: boolean;
}) {
  const client = getClient({ preview });
  const data = await client.fetch<SelfTestDoc>(selfTestBySlugQuery, { locale, slug });
  return data;
}

export type PreviewDoc = (FaqDoc | SelfTestDoc | PageBySlugQueryResult) & {
  _type?: string;
  language?: string;
};

export async function fetchPreviewDocById({
  id,
  preview = false,
}: {
  id: string;
  preview?: boolean;
}) {
  const client = getClient({ preview });
  const data = await client.fetch<PreviewDoc | null>(previewDocByIdQuery, { id });
  return data;
}
