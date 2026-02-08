'use client';

import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  section?: string;
  tags?: string[];
}

const DEFAULT_SEO = {
  title: 'Rinneagan - Full Stack Developer',
  description: 'Passionate full stack developer creating innovative web solutions with modern technologies',
  image: '/og-image.jpg',
  url: 'https://rinneagan.dev',
  keywords: ['full stack developer', 'web development', 'react', 'next.js', 'typescript'],
  author: 'Rinneagan',
};

export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  keywords,
  author,
  publishedDate,
  modifiedDate,
  section,
  tags,
}: SEOProps) {
  const seoTitle = title || DEFAULT_SEO.title;
  const seoDescription = description || DEFAULT_SEO.description;
  const seoImage = image || DEFAULT_SEO.image;
  const seoUrl = url || DEFAULT_SEO.url;
  const seoKeywords = keywords || DEFAULT_SEO.keywords;
  const seoAuthor = author || DEFAULT_SEO.author;

  return (
    <Head>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords.join(', ')} />
      <meta name="author" content={seoAuthor} />
      
      {/* Open Graph */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Rinneagan Portfolio" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      
      {/* Additional Meta */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <link rel="canonical" href={seoUrl} />
      
      {/* Article specific meta */}
      {publishedDate && (
        <meta property="article:published_time" content={publishedDate} />
      )}
      {modifiedDate && (
        <meta property="article:modified_time" content={modifiedDate} />
      )}
      {section && (
        <meta property="article:section" content={section} />
      )}
      {tags && tags.length > 0 && (
        <meta property="article:tag" content={tags.join(', ')} />
      )}
      
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
            author: seoAuthor,
            datePublished: publishedDate,
            dateModified: modifiedDate,
            publisher: {
              '@type': 'Organization',
              name: 'Rinneagan Portfolio',
              logo: {
                '@type': 'ImageObject',
                url: '/logo.jpg',
              },
            },
            datePublished: publishedDate,
            dateModified: modifiedDate,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': seoUrl,
            },
          }),
        }}
      />
      
      {/* Breadcrumb Structured Data */}
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: 'Home',
            item: 'https://your-portfolio-url.com',
          },
          ...(section ? [{
            position: 2,
            name: section,
            item: `https://your-portfolio-url.com/${section.toLowerCase()}`,
          }] : []),
        ]}
      />
    </>
  );
}

// Component for specific page SEO
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
    <SEO
      title={pageTitle}
      description={pageDescription}
      keywords={pageKeywords}
      url={`https://your-portfolio-url.com/${page.toLowerCase()}`}
      section={page}
    />
  );
}

// Component for project-specific SEO
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
    <SEO
      title={`${project} - Project by Rinneagan`}
      description={description || `Explore the ${project} project by Rinneagan. ${DEFAULT_SEO.description}`}
      keywords={[project, 'project', 'github', 'repository', ...(tags || [])]}
      url={`https://your-portfolio-url.com/projects/${project.toLowerCase().replace(/\s+/g, '-')}`}
      image={imageUrl}
      type="article"
      section="Projects"
      tags={tags}
    />
  );
}
