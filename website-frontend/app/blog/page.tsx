import Header from "@/components/header";
import Hero from "@/components/blog/hero";
import BlogSection from "@/components/blog/blog-section";
import DemoSection from "@/components/blog/demo-section";
import Footer from "@/components/footer";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

/* ------------------------------------------------------------------
      DYNAMIC SEO META TAGS FOR BLOG LISTING PAGE
   Uses `/blog-page` API to populate meta_title, meta_description, meta_keywords
------------------------------------------------------------------ */
export async function generateMetadata(): Promise<Metadata> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fallbackTitle = "Blogs | SkillVedika – Latest Tech Insights, Tutorials & Learning Guides";
  const fallbackDescription =
    "Explore SkillVedika’s latest blogs on software development, programming, AI, cloud computing, data science, career growth, and emerging technologies. Stay updated and enhance your learning journey.";
  const fallbackKeywords = [
    "SkillVedika blogs",
    "tech blogs",
    "programming tutorials",
    "software development articles",
    "data science blogs",
    "AI learning blogs",
    "cloud computing guides",
    "IT career tips",
    "web development blogs",
    "SkillVedika learning resources",
  ];

  try {
    // Fetch SEO metadata for the Blog page from the `seos` table.
    // id = 7 corresponds to "Blog Listing" in the seed data.
    const res = await fetch(`${apiUrl}/seo/6`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch seo/6: ${res.status}`);

    const json = await res.json();
    const content = json?.data ?? json ?? null;

    if (!content) {
      return {
        title: fallbackTitle,
        description: fallbackDescription,
        keywords: fallbackKeywords,
        openGraph: { title: fallbackTitle, description: fallbackDescription, url: "https://skillvedika.com/blog", type: "website" },
        twitter: { card: "summary_large_image", title: fallbackTitle, description: fallbackDescription },
      };
    }

    const keywords = content.meta_keywords
      ? typeof content.meta_keywords === "string"
        ? content.meta_keywords.split(",").map((k: string) => k.trim())
        : content.meta_keywords
      : fallbackKeywords;

    const metaTitle = content.meta_title ?? fallbackTitle;
    const metaDescription = content.meta_description ?? fallbackDescription;

    return {
      title: metaTitle,
      description: metaDescription,
      keywords,
      openGraph: { title: metaTitle, description: metaDescription, url: "https://skillvedika.com/blog", type: "website" },
      twitter: { card: "summary_large_image", title: metaTitle, description: metaDescription },
    };
  } catch (err) {
    console.error("Error generating blog metadata:", err);
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      keywords: fallbackKeywords,
      openGraph: { title: fallbackTitle, description: fallbackDescription, url: "https://skillvedika.com/blog", type: "website" },
      twitter: { card: "summary_large_image", title: fallbackTitle, description: fallbackDescription },
    };
  }
}

export default async function BlogPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  let content: any = null;
  let allCourses: any[] = [];
  let formDetails: any = null;

  /* ---------------------------------------------------
      1️⃣ Fetch Blog Page CMS Content
  ----------------------------------------------------- */
  try {
    const res = await fetch(`${apiUrl}/blog-page`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      content = json.data || json;
    }
  } catch (error) {
    console.error("Error fetching blog content:", error);
  }

  /* ---------------------------------------------------
      2️⃣ Fetch Courses (for demo dropdown)
  ----------------------------------------------------- */
  try {
    const res = await fetch(`${apiUrl}/courses`, {
      next: { revalidate: 86400 },
    });

    if (res.ok) {
      const json = await res.json();
      // Handle different API response formats
      // API might return: { success: true, data: [...] } or direct array
      allCourses = Array.isArray(json) 
        ? json 
        : (json?.data || json?.courses || []);
      
      // Ensure it's always an array
      if (!Array.isArray(allCourses)) {
        allCourses = [];
      }
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
  }

  /* ---------------------------------------------------
      3️⃣ Fetch Form Details
  ----------------------------------------------------- */
  try {
    const res = await fetch(`${apiUrl}/form-details`, { cache: "no-store" });

    if (res.ok) {
      const json = await res.json();
      const payload = json.data ?? json;

      formDetails = Array.isArray(payload)
        ? payload[payload.length - 1]
        : payload;
    }
  } catch (error) {
    console.error("Error fetching form details:", error);
  }

  /* ---------------------------------------------------
      4️⃣ Handle Missing Content
  ----------------------------------------------------- */
  if (!content) {
    return (
      <main className="min-h-screen flex items-center justify-center text-red-600">
        Failed to load Blog Page content.
      </main>
    );
  }

  /* ---------------------------------------------------
      5️⃣ Render Page
  ----------------------------------------------------- */
  return (
    <main className="min-h-screen bg-white">
      <Hero
        title={content.hero_title}
        description={content.hero_description}
        image={content.hero_image}
      />

      <BlogSection sidebarLabel={content.sidebar_name} />

      <DemoSection
        allCourses={allCourses}
        title={content.demo_title}
        subtitle={content.demo_subtitle}
        points={content.demo_points}
        formDetails={formDetails}
      />
    </main>
  );
}
