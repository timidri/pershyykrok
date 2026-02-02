import groq from "groq";

export const homePageQuery = groq`*[_type == "homePage" && language == "ru"][0]{
  title,
  introText,
  language,
  meetingSection
}`;