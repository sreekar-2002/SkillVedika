"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getTitleParts } from "@/utils/getTitle";
import { useState, useEffect } from "react";
import { EnrollModal } from "../EmptyLoginForm";

export default function ReadyToEmpower({
  title,
  description,
  buttonText,
  buttonLink,
  image,
}: {
  title: any;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
}) {
  const imageOffset = { x: -10, y: 10 };
  
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
  
  // Extract title parts
  const { part1, part2 } = getTitleParts(title);

  return (
    <section className="relative bg-gradient-to-b from-white via-white to-white py-10 px-6 sm:px-10 lg:px-16 overflow-hidden">
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
        
        {/* LEFT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex justify-center lg:justify-start w-full lg:w-[40%]"
        >
          <div className="relative w-[340px] h-[340px] flex items-center justify-center">
            
            {/* Glow Ring */}
            <div className="absolute w-[340px] h-[340px] rounded-full border-8 border-white/60 backdrop-blur-md shadow-[0_0_40px_-6px_rgba(90,106,235,0.15)]" />

            {/* Floating Image */}
            <motion.img
              src={image || "/on-job-support/Frame 279.png"}
              alt="Team Empowerment"
              className="relative z-10 w-[260px] h-[260px] object-cover rounded-full shadow-2xl border-4 border-white"
              style={{
                transform: `translate(${imageOffset.x}px, ${imageOffset.y}px)`,
              }}
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />

            <div className="absolute w-[260px] h-[260px] rounded-full bg-gradient-to-br from-blue-300/20 to-indigo-300/20 blur-2xl -z-10"></div>
          </div>
        </motion.div>

        {/* RIGHT TEXT */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-[90%]"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-snug">
            {part1 || "Ready to"}{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              {part2 || "Empower Your Workforce?"}
            </span>
          </h2>

          <p
            className="text-lg text-gray-700 mb-10 leading-relaxed max-w-[90%]"
            dangerouslySetInnerHTML={{ __html: description || "" }}
          />

          {/* CTA BUTTON */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Button
              asChild
              className="relative overflow-hidden bg-blue-900 hover:bg-blue-900 text-white px-8 py-6 rounded-xl font-semibold text-base shadow-md transition-all duration-300 group"
            >
              <button
                type="button"
                onClick={() => setShowEnrollModal(true)}
                className="w-full text-left"
              >
                <span className="relative z-10">
                  {buttonText || "Contact Us Today"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 via-indigo-400/40 to-blue-600/40 opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500" />
              </button>
            </Button>
          </motion.div>

          {showEnrollModal && (
            <EnrollModal
              courses={courses}
              page="On-Job Support"
              onClose={() => setShowEnrollModal(false)}
            />
          )}
        </motion.div>
      </div>

      {/* Floating Animations */}
      <style jsx>{`
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float 10s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>

    </section>
  );
}
