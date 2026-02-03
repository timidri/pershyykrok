import type {
  HomePageQueryResult,
  PageBySlugQueryResult,
  SiteSettingsQueryResult,
} from '../sanity-types';
import { homePageQuery, pageBySlugQuery, siteSettingsQuery } from '../queries';
import { getClient } from './sanity';

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
