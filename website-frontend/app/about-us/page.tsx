import AboutSection from "@/components/about-us/about-section";
import DemoSection from "@/components/about-us/demo-section";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

/* ----------------------------------------
      GENERATE DYNAMIC META TAGS FOR SEO
---------------------------------------- */
export async function generateMetadata(): Promise<Metadata> {
  const api = process.env.NEXT_PUBLIC_API_URL;

  const fallbackTitle = "About Us | SkillVedika – Leading Online Training & Career Development";
  const fallbackDescription =
    "SkillVedika is a leading online training institute offering expert-led IT courses, corporate training, job support and hands-on sessions designed to help learners grow in their careers.";
  const fallbackKeywords = [
    "SkillVedika",
    "About SkillVedika",
    "Online training institute",
    "IT courses online",
    "Corporate training",
    "Job support services",
    "Professional upskilling",
    "Career development programs",
    "Software training institute",
  ];
  
  try {
    // Fetch SEO metadata for the About page from the `seos` table.
    // We fetch the specific row by primary key (id = 6) which corresponds
    // to the About page in the seed data. This keeps content and SEO
    // separate (admins can manage SEO independently).
    const res = await fetch(`${api}/seo/5`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      const content = json.data || json;
      
      const keywords = content.meta_keywords
        ? (typeof content.meta_keywords === "string"
            ? content.meta_keywords.split(",").map((k: string) => k.trim())
            : content.meta_keywords)
        : fallbackKeywords;

      return {
        title: content.meta_title || fallbackTitle,
        description: content.meta_description || fallbackDescription,
        keywords,
      };
    }
  } catch (err) {
    console.error("Error fetching metadata for About page:", err);
  }

  // Fallback metadata
  return {
    title: fallbackTitle,
    description: fallbackDescription,
    keywords: fallbackKeywords,
  };
}

export default async function AboutPage() {
  const api = process.env.NEXT_PUBLIC_API_URL;

  let content: any = null;
  let allCourses: any[] = [];
  let formDetails: any = null;

  /* -------------------------------
        FETCH ABOUT CONTENT
  ------------------------------- */
  try {
    const res = await fetch(`${api}/about-page`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      content = json.data || json;
    }
  } catch (err) {
    console.error("Error fetching About Us content:", err);
  }

  /* -------------------------------
        FETCH COURSES
  ------------------------------- */
  try {
    const res = await fetch(`${api}/courses`, {
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
  } catch (err) {
    console.error("Error fetching courses:", err);
  }

  /* -------------------------------
        FETCH FORM DETAILS (robust)
  ------------------------------- */
  try {
    const res = await fetch(`${api}/form-details`, { cache: "no-store" });

    if (res.ok) {
      const json = await res.json();

      const payload = json.data ?? json;

      if (Array.isArray(payload)) {
        formDetails = payload.length ? payload[payload.length - 1] : null;
      } else {
        formDetails = payload;
      }
    }
  } catch (err) {
    console.error("Error fetching form details:", err);
  }

  /* -------------------------------
        ERROR HANDLING
  ------------------------------- */
  if (!content) {
    return (
      <main className="min-h-screen flex items-center justify-center text-red-600 text-center">
        Failed to load About Us page content.
      </main>
    );
  }

  /* -------------------------------
        PAGE RENDER
  ------------------------------- */
  return (
    <main className="bg-white">
      <AboutSection
        image={content.aboutus_image}
        title={content.aboutus_title}
        description={content.aboutus_description}
      />

      <DemoSection
        allCourses={allCourses}
        title={content.demo_title}
        points={content.demo_content}
        formDetails={formDetails}
      />
    </main>
  );
}
