"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { EnrollModal } from "../EmptyLoginForm";

export default function Hero({
  titlePart1,
  titleHighlight,
  subheading,
  buttonText,
  buttonLink,
  imagePath,
}: {
  titlePart1: string;
  titleHighlight: string;
  subheading: string;
  buttonText: string;
  buttonLink: string;
  imagePath: string;
}) {
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
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E8F0F7] to-[#F0F4F9] py-20 md:py-24">

      {/* === Hero Content === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center relative z-10"
      >
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {titlePart1}{" "}
            <span className="text-blue-900">
              {titleHighlight}
            </span>
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            {subheading}
          </p>

          <div className="flex flex-wrap gap-4">
            <motion.button
              onClick={() => setShowEnrollModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.1 }}
              className="px-8 py-3 bg-blue-800 text-white rounded-lg font-semibold shadow hover:bg-[#0066d3] transition"
            >
              {buttonText}
            </motion.button>
          </div>

          {showEnrollModal && (
            <EnrollModal
              courses={courses}
              page="Corporate Training"
              onClose={() => setShowEnrollModal(false)}
            />
          )}
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
          className="relative flex justify-center items-center"
        >
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-[#CCE2FF] rounded-full blur-3xl opacity-50"></div>

          <div className="relative z-10">
            <Image
              src={imagePath || "/corporate training/Frame 1.png"}
              alt="Corporate Training Illustration"
              width={500}
              height={500}
              className="object-contain"
              priority
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
