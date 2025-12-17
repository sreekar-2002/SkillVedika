"use client";

import { useEffect, useState } from "react";

import Hero from "@/components/home/hero";
import ExploreSkills from "@/components/home/explore-skills";
import CourseCards from "@/components/home/course-cards";
import KeyFeatures from "@/components/home/key-features";
import JobAssistance from "@/components/home/job-assistance";
import JobProgrammeSupport from "@/components/home/job-programme-support";
import RecentBlog from "@/components/home/recent-blog";

export default function Home() {
  const [statusFilter, setStatusFilter] = useState("trending");
  const [blogs, setBlogs] = useState<any[]>([]);
  const [home, setHome] = useState<any>(null);

  const api = "http://127.0.0.1:8000";

  // Load homepage CMS data
  useEffect(() => {
    async function loadHomeContent() {
      try {
        const res = await fetch(`${api}/api/homepage`, { cache: "no-store" });
        const data = await res.json();
        setHome(data);
      } catch (err) {
        console.error("Error fetching home page content:", err);
      }
    }

    loadHomeContent();
  }, []);

  // Update meta tags when component mounts (fetch from SEO table)
  useEffect(() => {
    async function loadSeoData() {
      try {
        const res = await fetch(`${api}/api/seo/1`, { cache: "no-store" });
        if (!res.ok) return;

        const json = await res.json();
        const seo = json?.data ?? json;

        if (!seo) return;

        // Title
        const title = seo.meta_title || "SkillVedika - Online Courses & Professional Training";
        document.title = title;

        // Description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.setAttribute('name', 'description');
          document.head.appendChild(metaDescription);
        }
        if (seo.meta_description) {
          metaDescription.setAttribute('content', seo.meta_description);
        }

        // Keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeywords);
        }
        if (seo.meta_keywords) {
          metaKeywords.setAttribute('content', seo.meta_keywords);
        }

        // Open Graph
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (!ogTitle) {
          ogTitle = document.createElement('meta');
          ogTitle.setAttribute('property', 'og:title');
          document.head.appendChild(ogTitle);
        }
        ogTitle.setAttribute('content', title);

        let ogDescription = document.querySelector('meta[property="og:description"]');
        if (!ogDescription) {
          ogDescription = document.createElement('meta');
          ogDescription.setAttribute('property', 'og:description');
          document.head.appendChild(ogDescription);
        }
        if (seo.meta_description) {
          ogDescription.setAttribute('content', seo.meta_description);
        }
      } catch (err) {
        console.error("Error fetching SEO data:", err);
      }
    }

    loadSeoData();
  }, []);

  // Load blogs
  useEffect(() => {
    async function loadBlogs() {
      try {
        // Try to fetch recent blogs first
        const res = await fetch(`${api}/api/blogs?recent=yes`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          // If we got recent blogs, use them; otherwise fetch all blogs
          if (Array.isArray(data) && data.length > 0) {
            setBlogs(data.slice(0, 6));
          } else {
            // Fallback: fetch all blogs if no recent ones
            const fallbackRes = await fetch(`${api}/api/blogs`, { cache: "no-store" });
            const fallbackData = await fallbackRes.json();
            setBlogs(Array.isArray(fallbackData) ? fallbackData.slice(0, 6) : []);
          }
        } else {
          // Fallback on error: fetch all blogs
          const fallbackRes = await fetch(`${api}/api/blogs`, { cache: "no-store" });
          const fallbackData = await fallbackRes.json();
          setBlogs(Array.isArray(fallbackData) ? fallbackData.slice(0, 6) : []);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        // Try one more fallback without recent filter
        try {
          const res = await fetch(`${api}/api/blogs`, { cache: "no-store" });
          const data = await res.json();
          setBlogs(Array.isArray(data) ? data.slice(0, 6) : []);
        } catch (e) {
          console.error("Fallback blog fetch also failed:", e);
          setBlogs([]);
        }
      }
    }

    loadBlogs();
  }, []);

  if (!home) {
    return <p className="text-center pt-20">Loading Home Page…</p>;
  }

  return (
    <main className="min-h-screen bg-[#F0F4F9]">
      <Hero hero={home} />

      <ExploreSkills
        explore={home}
        setStatusFilter={setStatusFilter}
      />

      <CourseCards statusFilter={statusFilter} />

      <KeyFeatures keyFeatures={home} />

      <JobAssistance jobAssist={home} />

      <JobProgrammeSupport jobSupport={home} />

      <RecentBlog
        blogs={blogs}
        blogHeading={home.blog_section_heading}
      />
    </main>
  );
}
