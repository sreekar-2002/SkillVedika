import CourseGrid from "@/components/courses/CourseGrid";
import CourseSearchBar from "@/components/courses/CourseSearchBar";

const API = process.env.NEXT_PUBLIC_API_URL;

// FETCH COURSE PAGE CONTENT
async function getPageContent() {
  try {
    const res = await fetch(`${API}/course-page-content`, {
      cache: "no-store",
    });
    
    if (!res.ok) {
      console.warn(`API returned status ${res.status}, using fallback content`);
      return getFallbackContent();
    }
    
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn(`Expected JSON, got: ${contentType}, using fallback content`);
      return getFallbackContent();
    }
    
    return await res.json();
  } catch (err) {
    console.warn("Failed to fetch course page content:", err);
    return getFallbackContent();
  }
}

// FALLBACK CONTENT
function getFallbackContent() {
  return {
    heading: "Explore Our Courses",
    subheading: "Industry-ready courses designed to upgrade your skills",
    meta_title: "Courses | SkillVedika",
    meta_description: "Explore industry-ready courses designed to upgrade your skills and boost your career.",
  };
}

/* ============================================================
   📌 Dynamic Metadata (Title, Description, Keywords)
============================================================ */
export async function generateMetadata() {
  let content = null;

  try {
    // Fetch SEO metadata for the Courses page from the `seos` table.
    // id = 2 corresponds to "Course Listing" in the seed data.
    const res = await fetch(`${API}/seo/2`, { cache: "no-store" });
    if (res.ok) content = await res.json();
  } catch (err) {
    console.error("Failed to load course meta:", err);
  }

  const seo = content?.data ?? content;

  if (!seo) {
    return {
      title: "Courses | SkillVedika",
      description:
        "Explore industry-ready courses designed to upgrade your skills and boost your career.",
      keywords: ["courses", "skillvedika", "online learning", "professional training"],
    };
  }

  const metaTitle = seo.meta_title || "Courses | SkillVedika";
  const metaDescription =
    seo.meta_description ||
    "Explore industry-ready courses designed to upgrade your skills and boost your career.";
  
  // Handle meta_keywords as array or string
  let metaKeywords = ["courses", "skillvedika", "training programs"];
  if (seo.meta_keywords) {
    if (Array.isArray(seo.meta_keywords)) {
      metaKeywords = seo.meta_keywords;
    } else if (typeof seo.meta_keywords === "string") {
      metaKeywords = seo.meta_keywords
        .split(",")
        .map((k: string) => k.trim())
        .filter(Boolean);
    }
  }

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: "https://skillvedika.com/courses",
      type: "website",
      images: ["/skillvedika-logo.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: ["/skillvedika-logo.png"],
    },
    alternates: {
      canonical: "https://skillvedika.com/courses",
    },
  };
}

/* ============================================================
   📌 PAGE COMPONENT
============================================================ */
export default async function CoursesPage(props: any) {
  // Ensure searchParams is resolved in Next.js 16
  const resolved = await props;
  const searchParams = await resolved.searchParams;

  const search = searchParams?.search || "";
  const category = searchParams?.category || "";

  const content = await getPageContent();

  return (
    <div className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADING */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            {content.heading}
          </h1>
          <p className="text-gray-600 mt-2">
            {content.subheading}
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="flex justify-center mb-12">
          <CourseSearchBar />
        </div>

        {/* COURSES GRID */}
        <CourseGrid searchQuery={search} urlCategory={category} />
      </div>
    </div>
  );
}
