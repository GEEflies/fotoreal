export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  image: string;
  tags: string[];
  content: string;
  readingTime?: number;
}

// Vite glob import — pulls all JSON files from src/content/blog/ at build time
const modules = import.meta.glob<BlogPost>("../content/blog/*.json", {
  eager: true,
  import: "default",
});

const posts: BlogPost[] = Object.values(modules).sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export function getAllPosts(): BlogPost[] {
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(currentSlug);
  if (!current) return posts.filter((p) => p.slug !== currentSlug).slice(0, limit);

  // Score posts by tag overlap
  return posts
    .filter((p) => p.slug !== currentSlug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score || new Date(b.post.date).getTime() - new Date(a.post.date).getTime())
    .slice(0, limit)
    .map((r) => r.post);
}
