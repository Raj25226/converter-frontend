import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://fileconvert.pro";
  const converters = [
    "pdf-to-word", "word-to-pdf", "jpg-to-png", "png-to-jpg", "jpg-to-webp",
    "mp4-to-mp3", "excel-to-pdf", "pdf-to-excel", "ppt-to-pdf", "heic-to-jpg",
    "webp-to-png", "mp4-to-gif", "wav-to-mp3", "zip-extract", "file-compress",
  ];
  const staticPages = ["", "login", "signup", "blog", "about", "privacy", "terms", "contact"];

  return [
    ...staticPages.map(page => ({
      url: `${baseUrl}/${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page === "" ? 1 : 0.8,
    })),
    ...converters.map(slug => ({
      url: `${baseUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
