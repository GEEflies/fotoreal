export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  image: string;
  tags: string[];
  content: string;
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
