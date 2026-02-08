import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  author?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const DEFAULT_SEO = {
  title: 'Rinneagan - Full Stack Developer Portfolio',
  description: 'Passionate full-stack developer showcasing projects, skills, and journey in web development. Explore my GitHub repositories and technical expertise.',
  keywords: [
    'full stack developer',
    'web development',
    'react',
    'next.js',
    'typescript',
    'node.js',
    'portfolio',
    'github',
    'javascript',
    'programming',
    'software engineering',
    'frontend',
    'backend',
    'fullstack'
  ],
  author: 'Rinneagan',
  image: '/og-image.jpg',
  url: 'https://rinneagan.github.io',
  type: 'website' as const
};

export function SEOHead({
  title,
  description,
  keywords,
  image,
  url,
  author,
  type = 'website',
  publishedTime,
  modifiedTime,
  section,
  tags
}: SEOHeadProps) {
  const seoTitle = title || DEFAULT_SEO.title;
  const seoDescription = description || DEFAULT_SEO.description;
  const seoKeywords = keywords || DEFAULT_SEO.keywords;
  const seoImage = image || DEFAULT_SEO.image;
  const seoUrl = url || DEFAULT_SEO.url;
  const seoAuthor = author || DEFAULT_SEO.author;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords.join(', ')} />
      <meta name="author" content={seoAuthor} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={seoUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={seoTitle} />
      <meta property="og:site_name" content="Rinneagan Portfolio" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@rinneagan" />
      <meta name="twitter:creator" content="@rinneagan" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      
      {/* Article Specific */}
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {section && (
        <meta property="article:section" content={section} />
      )}
      {tags && tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="en" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': type === 'article' ? 'Article' : 'WebPage',
            name: seoTitle,
            description: seoDescription,
            url: seoUrl,
            image: seoImage,
            author: {
              '@type': 'Person',
              name: seoAuthor,
              url: 'https://github.com/Rinneagan',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Rinneagan Portfolio',
              logo: {
                '@type': 'ImageObject',
                url: '/logo.jpg',
              },
            },
            datePublished: publishedTime,
            dateModified: modifiedTime,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': seoUrl,
            },
          }),
        }}
      />
      
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': seoUrl,
              },
              ...(section ? [{
                '@type': 'ListItem',
                'position': 2,
                'name': section,
                'item': `${seoUrl}/${section.toLowerCase()}`,
              }] : []),
            ],
          }),
        }}
      />
    </Head>
  );
}

// Page-specific SEO component
export function PageSEO({ 
  page, 
  title, 
  description, 
  keywords 
}: { 
  page: string;
  title?: string;
  description?: string;
  keywords?: string[];
}) {
  const pageTitle = title || `${page} - Rinneagan Portfolio`;
  const pageDescription = description || `Explore ${page.toLowerCase()} in Rinneagan's portfolio. ${DEFAULT_SEO.description}`;
  const pageKeywords = keywords || [page.toLowerCase(), ...DEFAULT_SEO.keywords];

  return (
    <SEOHead
      title={pageTitle}
      description={pageDescription}
      keywords={pageKeywords}
      url={`https://rinneagan.github.io/${page.toLowerCase()}`}
      section={page}
    />
  );
}

// Project-specific SEO component
export function ProjectSEO({ 
  project, 
  description, 
  tags, 
  imageUrl 
}: { 
  project: string;
  description?: string;
  tags?: string[];
  imageUrl?: string;
}) {
  return (
    <SEOHead
      title={`${project} - Project by Rinneagan`}
      description={description || `Explore the ${project} project by Rinneagan. ${DEFAULT_SEO.description}`}
      keywords={[project, 'project', 'github', 'repository', ...(tags || [])]}
      url={`https://rinneagan.github.io/projects/${project.toLowerCase().replace(/\s+/g, '-')}`}
      image={imageUrl}
      type="article"
      section="Projects"
      tags={tags}
    />
  );
}

export default SEOHead;
