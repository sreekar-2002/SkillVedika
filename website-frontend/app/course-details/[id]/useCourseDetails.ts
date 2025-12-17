"use client";

import { useState, useEffect } from "react";

export function useCourseDetails(id: string) {
  const [course, setCourse] = useState<any>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Prefer environment variable but fall back to localhost API for dev to avoid silent failures
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'; // already = http://127.0.0.1:8000/api

  useEffect(() => {
    async function load() {
      if (!id || id === '') {
        console.warn("Course ID is empty, skipping fetch");
        setLoading(false);
        return;
      }

      if (!api) {
        console.error("ENV ERROR: NEXT_PUBLIC_API_URL is missing");
        setLoading(false);
        return;
      }

      try {
        const courseUrl = `${api.replace(/\/$/, '')}/courses/${id}`;
        console.log("Fetching course from:", courseUrl);

        const res = await fetch(courseUrl, {
          cache: "no-store",
          mode: 'cors',
        });

        if (!res.ok) {
          const text = await res.text().catch(() => null);
          console.error("API Error:", res.status, res.statusText, text);
          throw new Error(`API Error: ${res.status}`);
        }

        const json = await res.json();

        // Handle different API response formats
        const courseData = json.course || json.data || json;
        const detailsData = json.details || courseData?.details || null;

        // Ensure details is always an object with expected properties
        const normalizedDetails = detailsData ? {
          agenda: detailsData.agenda || [],
          why_choose: detailsData.why_choose || [],
          who_should_join: detailsData.who_should_join || [],
          key_outcomes: detailsData.key_outcomes || [],
          meta_title: detailsData.meta_title || null,
          meta_description: detailsData.meta_description || null,
          meta_keywords: detailsData.meta_keywords || null,
          ...detailsData,
        } : {
          agenda: [],
          why_choose: [],
          who_should_join: [],
          key_outcomes: [],
          meta_title: null,
          meta_description: null,
          meta_keywords: null,
        };

        setCourse({
          ...courseData,
          details: normalizedDetails,
        });

        // load all courses (for dropdown). Use same api base and robust error handling
        const allUrl = `${api.replace(/\/$/, '')}/courses`;
        const allRes = await fetch(allUrl, { cache: 'no-store', mode: 'cors' });
        if (allRes.ok) {
          const allJson = await allRes.json();
          setAllCourses(Array.isArray(allJson) ? allJson : (allJson.data || []));
        } else {
          console.warn('Failed to load course list', allRes.status);
        }

      } catch (err: any) {
        console.error("Fetch failed:", err?.message || err);
        setCourse(null); // Ensure course is null on error
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      load();
    } else {
      setLoading(false);
    }
  }, [id, api]);

  return { course, allCourses, loading };
}
