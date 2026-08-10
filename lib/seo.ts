import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

export const defaultOgImage = "/og/hidd-advisory-og-v1.png";

export function safeSocialImage(image?: string | null) {
  if (!image || image.endsWith(".svg")) return defaultOgImage;

  const lowered = image.toLowerCase();
  if (
    lowered.includes("chatgpt.com") ||
    lowered.includes("chat.openai.com") ||
    lowered.includes("openai.com/share") ||
    lowered.includes("oaidalleapiprodscus") ||
    lowered.includes("oaiusercontent.com")
  ) {
    return defaultOgImage;
  }

  return image;
}

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
};

export function createPageMetadata({
  title,
  description,
  path,
  image = defaultOgImage,
  type = "website"
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteUrl(safeSocialImage(image));
  const socialTitle = title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: socialTitle,
      description,
      url: canonical,
      siteName: siteConfig.name,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "HIDD Advisory property intelligence for Lagos buyers"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [imageUrl]
    }
  };
}
