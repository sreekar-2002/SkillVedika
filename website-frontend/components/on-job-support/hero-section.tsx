"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getTitleParts } from "@/utils/getTitle";
import { useState, useEffect } from "react";
import { EnrollModal } from "../EmptyLoginForm";

export default function HeroSection({
  title,
  description,
  buttonText,
  buttonLink,
  imagePath,
}: {
  title: any;
  description: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  imagePath: string | null;
}) {
  const IMAGE_SCALE = 0.72;
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

  // Use the shared helper to safely build title parts
  const { part1, part2 } = getTitleParts(title);

  // Ensure description is a string (TipTap output). Fallback to empty string.
  const descriptionHtml = description || "";

  return (
    <section className="bg-gradient-to-br from-[#E8F0F7] to-[#F0F4F9] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div className="space-y-6 w-full">
            {/* Dynamic Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                <span className="text-[#1E4C8F]">{part1 || "On-Job Support"}</span>
                {part2 && <span className="text-[#1E4C8F] ml-2">{part2}</span>}
              </h1>
            </div>

            {/* Description: TipTap HTML — render inside a div to avoid nesting block elements inside <p> */}
            <div
              className="text-lg text-gray-700 leading-relaxed"
              // TipTap stores HTML — render it directly. If you want sanitization, add a sanitizer here.
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />

            {/* Button */}
            <div className="flex gap-4 pt-2">
              <Button
                onClick={() => setShowEnrollModal(true)}
                className="bg-[#1E4C8F] hover:bg-[#163C72] text-white px-8 py-5 text-base rounded-lg shadow-md"
              >
                {buttonText || "Get Support"}
              </Button>
            </div>

            {showEnrollModal && (
              <EnrollModal
                courses={courses}
                page="On-Job Support"
                onClose={() => setShowEnrollModal(false)}
              />
            )}

            {/* Trust indicators (unchanged) */}
            <div className="flex flex-wrap gap-6 pt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c..."></path>
                </svg>
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8..."></path>
                </svg>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hidden md:flex justify-center relative">
            <div className="relative w-[750px] h-[400px] flex items-center justify-center z-10">
              <Image
                src={imagePath || "/on-job-support/Frame 275.png"}
                alt="On-job support"
                width={550}
                height={550}
                className="object-contain drop-shadow-xl"
                style={{ transform: `scale(${IMAGE_SCALE})` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
