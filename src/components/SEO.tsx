import { Helmet } from "react-helmet-async";

const SITE_URL = "https://realfoto.sk";
const DEFAULT_TITLE = "RealFoto — AI editor realitných fotiek";
const DEFAULT_DESCRIPTION =
  "Profesionálne úpravy realitných fotografií pomocou AI. HDR, výmena oblohy, korekcia perspektívy. Ušetrite až 90% nákladov.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

interface Breadcrumb {
  name: string;
  path: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  breadcrumbs?: Breadcrumb[];
}

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noindex = false,
  jsonLd,
  breadcrumbs,
}: SEOProps) {
  const fullTitle = title ? `${title} | RealFoto` : DEFAULT_TITLE;
  const canonicalUrl = `${SITE_URL}${path}`;

  const jsonLdArray = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  // Auto-generate BreadcrumbList schema
  if (breadcrumbs && breadcrumbs.length > 0) {
    jsonLdArray.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((crumb, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: crumb.name,
        item: `${SITE_URL}${crumb.path}`,
      })),
    });
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="sk_SK" />
      <meta property="og:site_name" content="RealFoto" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@RealFoto" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD structured data */}
      {jsonLdArray.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}
