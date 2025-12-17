import BlogHero from "@/components/blog-detail/Hero";
import BlogContent from "@/components/blog-detail/Content";
import RecentBlogs from "@/components/blog-detail/RecentBlogs";
import DemoSection from "@/components/blog-detail/DemoSection";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

/* ============================================================
   1. DYNAMIC METADATA (Next 16 safe version)
============================================================ */
export async function generateMetadata(props: any) {
  // Next 16: `props` and `params` can be promises; resolve safely
  const propsResolved = await props;
  const paramsResolved = await propsResolved.params;
  const slugRaw = paramsResolved?.slug;
  const slug = Array.isArray(slugRaw) ? slugRaw[0] : slugRaw;

  // Resolve API URL properly
  let apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const api = apiBase.endsWith("/api") ? apiBase : `${apiBase}/api`;

  console.log("METADATA FETCH URL:", `${api}/blogs/${slug}`);

  // Fetch blog details
  let post = null;
  try {
    const res = await fetch(`${api}/blogs/${slug}`, { cache: "no-store" });
    if (res.ok) {
      post = await res.json(); // your API returns raw blog object
    }
  } catch (err) {
    console.error("Metadata fetch error:", err);
  }

  // Fallback when not found
  if (!post) {
    return {
      title: "Blog Not Found | SkillVedika",
      description: "The requested blog post could not be found.",
    };
  }

  // Build metadata
  const metaTitle = post.meta_title || post.blog_name;
  const metaDescription =
    post.meta_description ||
    (post.blog_content
      ? post.blog_content.replace(/<[^>]*>/g, "").slice(0, 155)
      : "");

  const metaKeywords = post.meta_keywords
    ? post.meta_keywords.split(",").map((k: string) => k.trim())
    : [];

  const backendOrigin = api.replace(/\/api$/, "");

  // Prefer thumbnail, then banner; build a simple absolute URL (remove whitespace)
  let imageRaw = post.thumbnail_image || post.banner_image || "/placeholder.svg";
  const imageClean = String(imageRaw ?? "/placeholder.svg").replace(/\s+/g, "").trim();
  let image: string;
  if (imageClean.startsWith("http")) {
    image = imageClean;
  } else {
    // If the file exists in the frontend `public` folder, serve it from the frontend (relative path)
    const publicFile = path.join(process.cwd(), "public", imageClean.replace(/^\/+/, ""));
    if (fs.existsSync(publicFile)) {
      image = imageClean.startsWith("/") ? imageClean : `/${imageClean}`;
    } else {
      image = imageClean.startsWith("/") ? `${backendOrigin}${imageClean}` : `${backendOrigin}/${imageClean}`;
    }
  }

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,

    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: [image],
      type: "article",
    },

    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [image],
    },
  };
}

/* ============================================================
   2. PAGE COMPONENT — Updated for Next.js 16
============================================================ */
export default async function BlogDetailPage(props: any) {
  // Next 16: resolve props and params which may be promises
  const propsResolved = await props;
  const paramsResolved = await propsResolved.params;
  const slugRaw = paramsResolved?.slug;
  const cleanSlug = Array.isArray(slugRaw) ? slugRaw[0] : slugRaw;

  // Resolve API base
  const envBase = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
  const api = envBase.endsWith("/api") ? envBase : `${envBase}/api`;

  /* -----------------------------
     Fetch main blog post
  ----------------------------- */
  let post = null;
  try {
    const res = await fetch(`${api}/blogs/${cleanSlug}`, { cache: "no-store" });
    if (res.ok) {
      post = await res.json(); // Your API returns raw object
    }
  } catch (err) {
    console.error("Error fetching blog data:", err);
    post = null;
  }

  /* -----------------------------
     Fetch Recent Blogs
  ----------------------------- */
  let recentBlogs: any[] = [];
  try {
    const res = await fetch(`${api}/blogs?recent=yes`, { cache: "no-store" });
    if (res.ok) {
      const list = await res.json();
      if (Array.isArray(list)) {
        recentBlogs = list.slice(0, 6);
      }
    }
  } catch {}

  if (!recentBlogs.length) {
    try {
      const fallbackRes = await fetch(`${api}/blogs`, { cache: "no-store" });
      if (fallbackRes.ok) {
        const list = await fallbackRes.json();
        recentBlogs = Array.isArray(list) ? list.slice(0, 6) : [];
      }
    } catch {}
  }

  /* -----------------------------
     Fetch Courses
  ----------------------------- */
  let allCourses = [];
  try {
    const res = await fetch(`${api}/courses`, {
      next: { revalidate: 86400 }, // 24 hours cache
    });
    if (res.ok) allCourses = await res.json();
  } catch {}

  /* -----------------------------
     Fetch Form Details
  ----------------------------- */
  let formDetails: any = null;
  try {
    const res = await fetch(`${api}/form-details`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      const payload = json.data ?? json;
      formDetails = Array.isArray(payload)
        ? payload[payload.length - 1]
        : payload;
    }
  } catch {}

  /* -----------------------------
     Image processing
  ----------------------------- */
  let img =
    post?.thumbnail_image ||
    post?.banner_image ||
    post?.images ||
    "/placeholder.svg";

  if (typeof img === "string" && img.startsWith("[")) {
    try {
      const parsed = JSON.parse(img);
      img =
        parsed.thumbnail ||
        parsed.banner ||
        Object.values(parsed)[0] ||
        "/placeholder.svg";
    } catch {}
  }

  // Clean up any accidental newlines or surrounding whitespace in image strings
  if (typeof img === "string") {
    img = img.replace(/\r?\n/g, "").trim();
  }

  /* -----------------------------
     If post STILL not found
  ----------------------------- */
  if (!post) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <a href="/blog" className="text-blue-600 hover:underline">
            Back to Blogs
          </a>
        </div>
      </main>
    );
  }

  // Ensure absolute URL for images so OG/twitter and page assets resolve correctly
  const backendOrigin = api.replace(/\/api$/, "");
  // Simple image src: trim and prefer frontend public folder when file exists
  if (typeof img === "string") {
    const imgClean = String(img ?? "/placeholder.svg").replace(/\s+/g, "").trim();
    if (imgClean.startsWith("http")) {
      img = imgClean;
    } else {
      const publicFile = path.join(process.cwd(), "public", imgClean.replace(/^\/+/, ""));
      if (fs.existsSync(publicFile)) {
        img = imgClean.startsWith("/") ? imgClean : `/${imgClean}`;
      } else {
        img = imgClean.startsWith("/") ? `${backendOrigin}${imgClean}` : `${backendOrigin}/${imgClean}`;
      }
    }
  }

  /* -----------------------------
     Render page successfully
  ----------------------------- */
  return (
    <main className="min-h-screen bg-white">
      <BlogHero post={post} img={img} />
      <BlogContent post={post} />
      <RecentBlogs blogs={recentBlogs} />
      <DemoSection allCourses={allCourses} formDetails={formDetails} />
    </main>
  );
}
