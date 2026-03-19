import { useParams, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEO } from "@/components/SEO";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { Calendar, ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-20 sm:pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Článok nebol nájdený</h1>
            <Button onClick={() => navigate("/blog")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Späť na blog
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const SITE_URL = "https://realfoto.sk";
  const related = getRelatedPosts(post.slug, 3);
  const readingTime = post.readingTime || Math.ceil(post.content.split(/\s+/).length / 200);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={post.title}
        description={post.description}
        path={`/blog/${post.slug}`}
        image={post.image ? `${SITE_URL}${post.image}` : undefined}
        type="article"
        breadcrumbs={[
          { name: "Domov", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          image: post.image ? `${SITE_URL}${post.image}` : undefined,
          datePublished: post.date,
          author: {
            "@type": "Organization",
            name: "RealFoto",
            url: SITE_URL,
          },
          publisher: {
            "@type": "Organization",
            name: "RealFoto",
            logo: {
              "@type": "ImageObject",
              url: `${SITE_URL}/favicon.png`,
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${SITE_URL}/blog/${post.slug}`,
          },
        }}
      />
      <Header />
      <main className="flex-1 pt-20 sm:pt-24">
        <article className="section-container py-12 sm:py-20 max-w-3xl mx-auto">
          <Button
            onClick={() => navigate("/blog")}
            variant="ghost"
            size="sm"
            className="mb-6 -ml-2 text-muted-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Späť na blog
          </Button>

          {post.image && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-8 bg-muted">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString("sk-SK", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {readingTime} min čítania
            </span>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium bg-primary/10 text-primary rounded-full px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="section-container py-12 sm:py-16 max-w-3xl mx-auto border-t">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-6">
              Ďalšie články
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/blog/${r.slug}`}
                  className="group block rounded-xl border bg-card p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-heading text-sm font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {r.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {r.description}
                  </p>
                  <span className="inline-flex items-center text-xs font-semibold text-primary">
                    Čítať
                    <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
