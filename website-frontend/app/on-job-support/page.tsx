import HeroSection from "@/components/on-job-support/hero-section";
import RealTimeHelp from "@/components/on-job-support/real-time-help";
import WhoIsThisFor from "@/components/on-job-support/who-is-this-for";
import HowWeHelp from "@/components/on-job-support/how-we-help";
import OurProcess from "@/components/on-job-support/our-process";
import WhyChoose from "@/components/on-job-support/why-choose";
import ReadyToEmpower from "@/components/on-job-support/ready-to-empower";
import GetLiveDemo from "@/components/on-job-support/get-live-demo";
import { Metadata } from "next";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

/* ============================================================
   ⭐ 1. Dynamic Metadata for On-Job-Support Page
   Compatible with Next.js 16 (params & props are Promises)
============================================================ */
export async function generateMetadata() {
  let apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const api = apiBase.endsWith("/api") ? apiBase : `${apiBase}/api`;

  // Fetch metadata content from backend
  let meta = null;
  try {
    const res = await fetch(`${api}/seo/4`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      meta = json.data ?? json;
    }
  } catch (err) {
    console.error("❌ Metadata Fetch Error (OJS):", err);
  }

  // If API unavailable → fallback SEO
  if (!meta) {
    return {
      title: "On-Job Support | SkillVedikaAA",
      description:
        "Get real-time expert help, hands-on technical support, and job-ready guidance with SkillVedika’s On-Job Support.",
      keywords: [
        "on job support",
        "skillvedika support",
        "real time project help",
        "technical support",
      ],
    };
  }

  // Build metadata from DB fields
  // Build helpers that tolerate different shapes from the API
  const extractText = (value: any) => {
    if (!value) return null;
    if (typeof value === "string") return value;
    if (Array.isArray(value)) {
      // array of strings or objects
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
  const baseTitle = extractText(meta.meta_title) || extractText(meta.seo_title) || extractText(meta.hero_title) || "On-Job Support";
  const title = `${baseTitle} `;
  const description = extractText(meta.meta_description) || extractText(meta.seo_description) || extractText(meta.hero_description) || "Get hands-on technical guidance, real-time issue resolution, and expert-driven On-Job Support at SkillVedika.";

  // Allow backend to provide keywords (string or array) via `meta.meta_keywords`, `meta.keywords` or `meta.seo_keywords`
  const rawKeywords = meta.meta_keywords || meta.keywords || meta.seo_keywords || null;
  const keywords = rawKeywords
    ? Array.isArray(rawKeywords)
      ? rawKeywords
      : String(rawKeywords).split(",").map((k: string) => k.trim()).filter(Boolean)
    : ["on job support", "real time support", "project support", "technical help", "skillvedika"];

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
      url: "https://skillvedika.com/on-job-support",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },

    alternates: {
      canonical: "https://skillvedika.com/on-job-support",
    },
  };
}

/* ============================================================
   ⭐ 2. PAGE COMPONENT — Your Original Logic (unchanged)
============================================================ */
export default async function OnJobSupport() {
  const api = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  let content: any = null;
  let allCourses: any[] = [];

  /* -------------------------------
        FETCH PAGE CONTENT
  ------------------------------- */
  try {
    const res = await fetch(`${api}/on-job-support-page`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      content = json.data || json;
    }
  } catch (err) {
    console.error("❌ Error loading OJS content:", err);
  }

  /* -------------------------------
        FETCH COURSES
  ------------------------------- */
  try {
    const res = await fetch(`${api}/courses`, {
      next: { revalidate: 86400 },
    });

    if (res.ok) allCourses = await res.json();
  } catch (err) {
    console.error("❌ Error fetching courses:", err);
  }

  /* -------------------------------
        FETCH FORM DETAILS
  ------------------------------- */
  let formDetails: any = null;
  try {
    const res = await fetch(`${api}/form-details`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      const payload = json.data ?? json;
      formDetails = Array.isArray(payload) ? payload[payload.length - 1] : payload;
    }
  } catch (err) {
    console.error("❌ Failed to fetch form details:", err);
  }

  if (!content) {
    return (
      <main className="min-h-screen flex items-center justify-center text-red-600">
        Failed to load On-Job-Support content.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <HeroSection
        title={content.hero_title}
        description={content.hero_description}
        buttonText={content.hero_button_text}
        buttonLink={content.hero_button_link}
        imagePath={content.hero_image}
      />

      <RealTimeHelp
        title={content.realtime_title}
        subheading={content.realtime_subheading}
        description={content.realtime_description}
        subsection1Title={content.realtime_subsection_title1}
        subsection1Desc={content.subsection_title1_description}
        subsection2Title={content.realtime_subsection_title2}
        subsection2Desc={content.subsection_title2_description}
        imagePath={content.realtime_image}
      />

      <WhoIsThisFor
        targetLabel={content.who_target}
        title={content.who_title}
        subtitle={content.who_subtitle}
        cards={content.who_cards}
      />

      <HowWeHelp
        title={content.how_title}
        subtitle={content.how_subtitle}
        points={content.how_points}
        footer={content.how_footer}
      />

      <OurProcess
        title={content.process_title}
        subtitle={content.process_subtitle}
        steps={content.process_points}
      />

      <WhyChoose
        title={content.why_title}
        points={content.why_points}
        image={content.why_image}
      />

      <ReadyToEmpower
        title={content.ready_title}
        description={content.ready_description}
        buttonText={content.ready_button}
        buttonLink={content.ready_button_link}
        image={content.ready_image}
      />

      <GetLiveDemo
        allCourses={allCourses}
        target={content.demo_target}
        title={content.demo_title}
        subtitle={content.demo_subtitle}
        points={content.demo_points}
        formDetails={formDetails}
      />
    </main>
  );
}

