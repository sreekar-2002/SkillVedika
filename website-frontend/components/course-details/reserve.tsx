"use client";

import { useEffect, useState } from "react";
import { EnrollModal } from "../EmptyLoginForm";

export default function Reserve({ agenda = [] }: { agenda?: any[] }) {
  const [content, setContent] = useState<any>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [courses, setCourses] = useState<{ id: number; title: string }[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const agendaList = Array.isArray(agenda) ? agenda : [];

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    fetch(`${apiUrl}/placements-reserve`)
      .then((res) => {
        if (!res.ok) {
          console.warn("Reserve API error:", res.status);
          return null;
        }
        return res.json();
      })
      .then((response) => {
        if (!response) {
          // Set default content if API fails
          setContent({
            reserve_title: { main: 'Reserve Your Spot' },
            reserve_subtitle: 'Join our exclusive program',
            reserve_block1: ['0', 'Days'],
            reserve_block2: ['0', 'Hours'],
            reserve_block3: ['0', 'Minutes'],
            reserve_button_name: 'Enroll Now'
          });
          return;
        }
        // Handle both wrapped (success + data) and direct responses
        const data = response?.success && response?.data ? response.data : response;
        const placement = Array.isArray(data) ? data[0] : data;
        setContent(placement);
      })
      .catch((err) => {
        console.error("Reserve API error:", err);
        // Set default content on error
        setContent({
          reserve_title: { main: 'Reserve Your Spot' },
          reserve_subtitle: 'Join our exclusive program',
          reserve_block1: ['0', 'Days'],
          reserve_block2: ['0', 'Hours'],
          reserve_block3: ['0', 'Minutes'],
          reserve_button_name: 'Enroll Now'
        });
      });
  }, []);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          console.error("NEXT_PUBLIC_API_URL not set");
          setCoursesLoading(false);
          return;
        }

        const res = await fetch(`${apiUrl}/courses`);
        if (!res.ok) {
          console.error("Failed to fetch courses");
          setCoursesLoading(false);
          return;
        }

        const data = await res.json();
        const courseList = Array.isArray(data)
          ? data.map((course: any) => ({
              id: course.id || course.course_id,
              title: course.title || course.course_name,
            }))
          : (data?.data || []);
        setCourses(courseList);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setCoursesLoading(false);
      }
    }

    fetchCourses();
  }, []);

  // Don't return null - render with default content if needed
  const displayContent = content || {
    reserve_title: { main: 'Reserve Your Spot' },
    reserve_subtitle: 'Join our exclusive program',
    reserve_block1: ['0', 'Days'],
    reserve_block2: ['0', 'Hours'],
    reserve_block3: ['0', 'Minutes'],
    reserve_button_name: 'Enroll Now'
  };

  // Helper: safely extract text from various shapes
  const extractText = (val: any): string => {
    if (val === null || val === undefined) return "";
    if (typeof val === "string") return val;
    if (typeof val === "number" || typeof val === "boolean") return String(val);
    if (Array.isArray(val)) return val.map(extractText).join(" ");
    if (typeof val === "object") {
      if (val.main !== undefined) return extractText(val.main);
      if (val.text !== undefined) return extractText(val.text);
      if (val.title !== undefined) return extractText(val.title);
      try { return JSON.stringify(val); } catch { return String(val); }
    }
    return String(val);
  };

  const parseBlockValue = (block: any, idx: number, fallback: string | number) => {
    try {
      if (block === null || block === undefined) return fallback;
      if (typeof block === 'string') {
        // maybe a JSON-stringified array
        try {
          const parsed = JSON.parse(block);
          if (Array.isArray(parsed)) return extractText(parsed[idx]) || fallback;
          return extractText(parsed) || fallback;
        } catch {
          return block || fallback;
        }
      }
      if (Array.isArray(block)) return extractText(block[idx]) || fallback;
      if (typeof block === 'object') {
        // If object like {0: 'x', 1: 'y'} or {value:..., label:...}
        if (block[idx] !== undefined) return extractText(block[idx]) || fallback;
        if (block.value !== undefined && idx === 0) return extractText(block.value) || fallback;
        if (block.label !== undefined && idx === 1) return extractText(block.label) || fallback;
        return extractText(block) || fallback;
      }
      return block || fallback;
    } catch (e) {
      return fallback;
    }
  };

  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          {extractText(displayContent.reserve_title) || extractText(displayContent.title) || 'Reserve Your Spot'}
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 mb-12">
          {extractText(displayContent.reserve_subtitle) || extractText(displayContent.description) || 'Join our exclusive program'}
        </p>

        {/* Boxes */}
        <div className="grid md:grid-cols-3 gap-8 mb-10">

          {/* Box 1 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-3xl font-bold text-blue-900 mb-2">
              {parseBlockValue(displayContent.reserve_block1, 0, agendaList.length || '0')}
            </div>
            <p className="text-gray-600 text-sm">
              {parseBlockValue(displayContent.reserve_block1, 1, 'Days')}
            </p>
          </div>

          {/* Box 2 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-3xl font-bold text-blue-900 mb-2">
              {parseBlockValue(displayContent.reserve_block2, 0, '0')}
            </div>
            <p className="text-gray-600 text-sm">
              {parseBlockValue(displayContent.reserve_block2, 1, 'Hours')}
            </p>
          </div>

          {/* Box 3 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-3xl font-bold text-blue-900 mb-2">
              {parseBlockValue(displayContent.reserve_block3, 0, '0')}
            </div>
            <p className="text-gray-600 text-sm">
              {parseBlockValue(displayContent.reserve_block3, 1, 'Minutes')}
            </p>
          </div>

        </div>

        {/* Button */}
        <button
          onClick={() => setShowEnrollModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg inline-block transition"
        >
          {extractText(displayContent.reserve_button_name) || 'Enroll Now'}
        </button>

        {showEnrollModal && (
          <EnrollModal
            courses={courses}
            page="Course Details"
            onClose={() => setShowEnrollModal(false)}
          />
        )}
      </div>
    </section>
  );
}
