import groq from "groq";

/** Site settings singleton (same doc Studio edits via documentId "siteSettings"). */
export const siteSettingsQuery = groq`*[_id == "siteSettings"][0]{
  logo,
  mainMenuRu[]{
    label,
    "link": link->{ _type, "slug": slug.current }
  },
  mainMenuUa[]{
    label,
    "link": link->{ _type, "slug": slug.current }
  },
  footerText,
  "contact": coalesce(contact, footerContact),
  seo{
    title,
    description,
    ogImage,
    ogImageAlt,
    canonicalBaseUrl
  }
}`;

/** Home page for a locale (ru or ua). Pass $locale when fetching. */
export const homePageQuery = groq`*[_type == "homePage" && language == $locale][0]{
  title,
  introText,
  language,
  meetingSection{
    sectionTitle,
    time,
    languages
  }
}`;

/** Generic page by locale and slug. Pass $locale and $slug when fetching. */
export const pageBySlugQuery = groq`*[_type == "page" && language == $locale && slug.current == $slug][0]{
  title,
  body,
  slug
}`;

/** All page slugs per locale (for static path generation). */
export const allPageSlugsQuery = groq`*[_type == "page" && defined(slug.current)]{
  "locale": language,
  "slug": slug.current
}`;
