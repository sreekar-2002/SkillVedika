import Hero from "@/components/corporate-training/hero";
import EmpowerSection from "@/components/corporate-training/empower-section";
import TrainingPortfolio from "@/components/corporate-training/training-portfolio";
import Advantages from "@/components/corporate-training/advantages";
import HrGuide from "@/components/corporate-training/hr-guide";
import DemoSection from "@/components/corporate-training/demo-section";
import FAQ from "@/components/corporate-training/faq";
import { Metadata } from "next";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

/* ============================================================
   📌 DYNAMIC METADATA — Fetches from SEO database
   Compatible with Next.js 16 (params & props are Promises)
============================================================ */
export async function generateMetadata() {
  let apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const api = apiBase.endsWith("/api") ? apiBase : `${apiBase}/api`;

  // Fetch metadata content from backend
  let meta = null;
  try {
    const res = await fetch(`${api}/seo/3`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      meta = json.data ?? json;
    }
  } catch (err) {
    console.error("❌ Metadata Fetch Error (Corporate):", err);
  }

  // If API unavailable → fallback SEO
  if (!meta) {
    return {
      title: "Corporate Training Programs for Teams | SkillVedika",
      description:
        "Upgrade your workforce with SkillVedika's customized corporate training programs designed to build leadership, technical, and soft skills.",
      keywords: [
        "corporate training",
        "employee upskilling",
        "leadership training",
        "technical training",
      ],
    };
  }

  // Build helpers that tolerate different shapes from the API
  const extractText = (value: any) => {
    if (!value) return null;
    if (typeof value === "string") return value;
    if (Array.isArray(value)) {
      const first = value[0];
      if (!first) return null;
      if (typeof first === "string") return first;
      if (typeof first === "object") return first.text || first.title || Object.values(first).find((v) => typeof v === "string") || null;
    }
    if (typeof value === "object") {
      return value.text || value.title || Object.values(value).find((v) => typeof v === "string") || null;
    }
    return null;
  };

  // Prefer explicit SEO/meta fields, then fall back to hero fields
  const baseTitle = extractText(meta.meta_title) || extractText(meta.seo_title) || extractText(meta.hero_title) || "Corporate Training";
  const title = `${baseTitle} `;
  const description = extractText(meta.meta_description) || extractText(meta.seo_description) || extractText(meta.hero_description) || "Upgrade your workforce with SkillVedika's customized corporate training programs.";

  // Allow backend to provide keywords (string or array) via `meta.meta_keywords`, `meta.keywords` or `meta.seo_keywords`
  const rawKeywords = meta.meta_keywords || meta.keywords || meta.seo_keywords || null;
  const keywords = rawKeywords
    ? Array.isArray(rawKeywords)
      ? rawKeywords
      : String(rawKeywords).split(",").map((k: string) => k.trim()).filter(Boolean)
    : ["corporate training", "employee upskilling", "leadership training", "technical training"];

  // Build image URL: prefer frontend public folder, then backend
  const imageRaw = meta.hero_image || meta.hero_banner || "/placeholder.svg";
  const imageClean = String(imageRaw ?? "/placeholder.svg").replace(/\s+/g, "").trim();
  let image: string;
  if (imageClean.startsWith("http")) {
    image = imageClean;
  } else {
    const publicFile = path.join(process.cwd(), "public", imageClean.replace(/^\/+/, ""));
    if (fs.existsSync(publicFile)) {
      image = imageClean.startsWith("/") ? imageClean : `/${imageClean}`;
    } else {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const backendOrigin = apiBase.endsWith("/api") ? apiBase.replace(/\/api$/, "") : apiBase;
      image = imageClean.startsWith("/") ? `${backendOrigin}${imageClean}` : `${backendOrigin}/${imageClean}`;
    }
  }

  return {
    title,
    description,
    keywords,

    openGraph: {
      title,
      description,
      images: [image],
      type: "website",
      url: "https://skillvedika.com/corporate-training",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },

    alternates: {
      canonical: "https://skillvedika.com/corporate-training",
    },
  };
}

/* ============================================================
   📌 PAGE COMPONENT
============================================================ */
export default async function CorporateTraining() {
  const api = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

  let content: any = null;
  let allCourses: any[] = [];
  let formDetails: any = null;

  /* --------------------------------------------------
        FETCH CORPORATE TRAINING PAGE CONTENT
  -------------------------------------------------- */
  try {
    const res = await fetch(`${api}/corporate-training`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      content = json.data ?? json;
    }
  } catch (err) {
    console.error("❌ Error fetching corporate content:", err);
  }

  /* --------------------------------------------------
        FETCH COURSES FOR DEMO DROPDOWN
  -------------------------------------------------- */
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
    console.error("❌ Failed to load courses:", err);
  }

  /* --------------------------------------------------
        FETCH FORM DETAILS
  -------------------------------------------------- */
  try {
    const res = await fetch(`${api}/form-details`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      const payload = json.data ?? json;
      formDetails = Array.isArray(payload)
        ? payload[payload.length - 1]
        : payload;
    }
  } catch (err) {
    console.error("❌ Failed to fetch form details:", err);
  }

  /* --------------------------------------------------
        SAFETY FALLBACKS
  -------------------------------------------------- */
  if (!content) {
    return (
      <main className="min-h-screen flex items-center justify-center text-red-600 text-lg">
        Failed to load Corporate Training Page content.
      </main>
    );
  }

  const hero = content.hero_title ?? {
    part1: "Skill Up with",
    highlight: "SkillVedika",
  };

  const empower = content.empower_title ?? {
    part1: "Empower Your",
    part2: "Workforce",
  };

  /* --------------------------------------------------
        PAGE RENDER
  -------------------------------------------------- */
  return (
    <main className="min-h-screen bg-background">

      {/* HERO SECTION */}
      <Hero
        titlePart1={hero.part1}
        titleHighlight={hero.highlight}
        subheading={content.hero_subheading}
        buttonText={content.hero_button_text}
        buttonLink={content.hero_button_link}
        imagePath={content.hero_image}
      />

      {/* EMPOWER SECTION */}
      <EmpowerSection
        title={empower}
        description={content.empower_description}
        imagePath={content.empower_image}
      />

      {/* TRAINING PORTFOLIO */}
      <TrainingPortfolio
        title={content.portfolio_title}
        subtitle={content.portfolio_subtitle}
        items={content.portfolio_items}
      />

      {/* ADVANTAGES */}
      <Advantages
        title={content.advantages_title}
        subtitle={content.advantages_subtitle}
        leftItems={content.advantages_left_items}
        rightItems={content.advantages_right_items}
      />

      {/* HR GUIDE */}
      <HrGuide
        title={content.hr_guide_title}
        subtitle={content.hr_guide_subtitle}
        steps={content.hr_guide_steps}
      />

      {/* DEMO SECTION */}
      <DemoSection
        title={content.demo_title}
        points={content.demo_points}
        allCourses={allCourses}
        formDetails={formDetails}
      />

      {/* FAQ (optional) */}
      {/* <FAQ /> */}
    </main>
  );
}
