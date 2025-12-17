"use client";

import parse from "html-react-parser";
import { useState, useEffect } from "react";
import { EnrollModal } from "../EmptyLoginForm";

export default function JobProgrammeSupport({ jobSupport }) {
  const paymentTypes = jobSupport?.job_support_payment_types || [];
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [courses, setCourses] = useState<{ id: number; title: string }[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

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
        // Map API response to { id, title } format expected by modal
        const courseList = Array.isArray(data)
          ? data.map((course: any) => ({
              id: course.id || course.course_id,
              title: course.title || course.course_name,
            }))
          : [];
        setCourses(courseList);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setCoursesLoading(false);
      }
    }

    fetchCourses();
  }, []);

  return (
    <section
      className="relative py-24 bg-cover bg-center"
      style={{
        backgroundImage: "url('/home/handshake.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* ⭐ Dynamic Title (safe wrapper) */}
        <div className="text-3xl md:text-4xl font-bold text-white mb-4">
          {jobSupport?.job_support_title
            ? parse(jobSupport.job_support_title)
            : "Job Programme Support"}
        </div>

        {/* ⭐ Dynamic Content (safe wrapper) */}
        <div className="text-gray-100 text-sm md:text-base mb-8 max-w-2xl mx-auto">
          {jobSupport?.job_support_content
            ? parse(jobSupport.job_support_content)
            : null}
        </div>

        {/* ⭐ Dynamic Payment Type Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
          {paymentTypes.map((type, index) => (
            <button
              key={index}
              className="bg-white text-[#2C5AA0] px-8 py-2 rounded font-semibold hover:bg-gray-100 transition-colors capitalize"
            >
              {type}
            </button>
          ))}
        </div>

        {/* ⭐ Dynamic Main Button */}
        <button
          onClick={() => setShowEnrollModal(true)}
          className="inline-block bg-[#2C5AA0] text-white px-8 py-3 rounded font-semibold hover:bg-[#1A3F66] transition-colors"
        >
          {jobSupport?.job_support_button || "Get Started"}
        </button>

        {showEnrollModal && (
          <EnrollModal
            courses={courses}
            page="Home page"
            onClose={() => setShowEnrollModal(false)}
          />
        )}
      </div>
    </section>
  );
}
