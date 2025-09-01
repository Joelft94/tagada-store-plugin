// Configuration schema for Tagada skincare plugin (following SPECIFICATIONS.md)
import { z } from "zod";

// Branding configuration - exactly as per specifications
const BrandingSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
  secondaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color")
    .optional(),
  logoUrl: z.string().optional(),
});

// Product IDs configuration - as suggested by team
const ProductIdsSchema = z.array(z.string().min(1, "Product ID cannot be empty"));

// Multi-language content support
const LocalizedStringSchema = z.record(z.string(), z.string()); // locale -> string

// Content sections for multi-language support
const ContentSectionsSchema = z.record(
  z.string(),
  z.record(z.string(), z.string())
); // locale -> { sectionKey -> content }

// Footer links configuration
const FooterLinkSchema = z.object({
  label: z.string().min(1, "Link label is required"),
  url: z.string().min(1, "Link URL is required"),
  locale: z.string().optional(),
});

// Content configuration with i18n support
const ContentSchema = z.object({
  tagline: LocalizedStringSchema,
  sections: ContentSectionsSchema,
  footerLinks: z.array(FooterLinkSchema),
});

// Assets configuration
const AssetsSchema = z
  .object({
    heroImage: z.string().optional(),
    logoImage: z.string().optional(),
    placeholderImage: z.string().optional(),
  })
  .optional();

// SEO configuration with multi-language support
const SeoSchema = z
  .object({
    title: LocalizedStringSchema,
    description: LocalizedStringSchema,
    socialImageUrl: z.string().optional(),
  })
  .optional();

// Main configuration schema - using product IDs as team suggested
export const ConfigSchema = z.object({
  configName: z.string().min(1, "Config name is required"),
  productIds: ProductIdsSchema,
  branding: BrandingSchema.optional(),
  content: ContentSchema.optional(),
  assets: AssetsSchema,
  seo: SeoSchema,
});

// Export types
export type Config = z.infer<typeof ConfigSchema>;
export type Branding = z.infer<typeof BrandingSchema>;
export type ProductIds = z.infer<typeof ProductIdsSchema>;
export type Content = z.infer<typeof ContentSchema>;
export type LocalizedString = z.infer<typeof LocalizedStringSchema>;
export type ContentSections = z.infer<typeof ContentSectionsSchema>;
export type FooterLink = z.infer<typeof FooterLinkSchema>;
export type Assets = z.infer<typeof AssetsSchema>;
export type Seo = z.infer<typeof SeoSchema>;

// Configuration validation helper
export const validateConfig = (config: unknown): Config => {
  try {
    return ConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Configuration validation failed: ${error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join(", ")}`
      );
    }
    throw error;
  }
};

// Helper to get localized content with fallback
export const getLocalizedContent = (
  localizedContent: LocalizedString,
  locale: string = "en",
  fallbackLocale: string = "en"
): string => {
  return (
    localizedContent[locale] ||
    localizedContent[fallbackLocale] ||
    Object.values(localizedContent)[0] ||
    ""
  );
};

// Helper to get section content with locale fallback
export const getSectionContent = (
  sections: ContentSections,
  sectionKey: string,
  locale: string = "en",
  fallbackLocale: string = "en"
): string => {
  const localeSection = sections[locale]?.[sectionKey];
  const fallbackSection = sections[fallbackLocale]?.[sectionKey];
  const firstAvailable = Object.values(sections)[0]?.[sectionKey];

  return localeSection || fallbackSection || firstAvailable || "";
};

// Default minimal configuration template
export const DEFAULT_CONFIG: Config = {
  configName: "default-skincare",
  productIds: [
    "product_example_1",
    "product_example_2", 
    "product_example_3",
  ],
};
