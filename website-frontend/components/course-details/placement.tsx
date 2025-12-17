"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Placement() {
  const [content, setContent] = useState<any>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    fetch(`${apiUrl}/placements-reserve`)
      .then((res) => {
        if (!res.ok) {
          console.warn("Placement API error:", res.status);
          return null;
        }
        return res.json();
      })
      .then((response) => {
        if (!response) {
          setContent(null);
          return;
        }
        // Handle both wrapped (success + data) and direct responses
        const data = response?.success && response?.data ? response.data : response;
        const placement = Array.isArray(data) ? data[0] : data;
        setContent(placement);
      })
      .catch((err) => {
        console.error("Placement API error:", err);
        setContent(null);
      });
  }, []);

  useEffect(() => {
    if (!content?.placement_images) return;

    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % content.placement_images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [content]);

  if (!content) return null;

  // Helper to safely extract a display string from different shapes
  const extractText = (val: any): string => {
    if (val === null || val === undefined) return "";
    if (typeof val === "string") return val;
    if (typeof val === "number" || typeof val === "boolean") return String(val);
    if (Array.isArray(val)) return val.map(extractText).join(" ");
    if (typeof val === "object") {
      // prefer common keys
      if (val.main !== undefined) return extractText(val.main);
      if (val.text !== undefined) return extractText(val.text);
      if (val.title !== undefined) return extractText(val.title);
      // fallback to stringifying small objects
      try {
        return JSON.stringify(val);
      } catch (e) {
        return String(val);
      }
    }
    return String(val);
  };

  // Ensure placement_images exists and is an array
  const placementImages = content.placement_images || [];
  const images = Array.isArray(placementImages) 
    ? placementImages.map((url) => ({
        src: url,
        alt: "Company Logo",
      }))
    : [];

  // Don't render if there are no images
  if (images.length === 0) return null;

  return (
    <section className="relative bg-gradient-to-b from-blue-50 via-blue-100/30 to-purple-50 px-6 py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(59,130,246,0.12),transparent_50%),radial-gradient(circle_at_70%_20%,rgba(168,85,247,0.1),transparent_40%)] animate-pulse"></div>

      <div className="relative max-w-6xl mx-auto text-center">
        {/* Dynamic Header */}
        {(extractText(content.placements_title) || extractText(content.title)) && (
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            {extractText(content.placements_title) || extractText(content.title) || 'Placement Partners'}
          </h2>
        )}

        {(extractText(content.placements_subtitle) || extractText(content.description)) && (
          <p className="text-gray-600 mb-14 text-base">
            {extractText(content.placements_subtitle) || extractText(content.description) || ''}
          </p>
        )}

        {/* Carousel */}
        <div className="relative flex justify-center items-center h-48 md:h-56">
          {images.map((logo, idx) => {
            const prevIdx = (activeIdx - 1 + images.length) % images.length;
            const nextIdx = (activeIdx + 1) % images.length;

            let positionClass = "hidden md:block opacity-0";
            let motionProps = {};

            if (idx === activeIdx) {
              positionClass = "z-20 scale-125";
              motionProps = {
                initial: { opacity: 0, scale: 0.8, y: 20 },
                animate: { opacity: 1, scale: 1.25, y: 0 },
                exit: { opacity: 0, scale: 0.8, y: -20 },
              };
            } else if (idx === prevIdx) {
              positionClass = "absolute left-[10%] z-10 scale-90 opacity-60";
              motionProps = {
                initial: { opacity: 0, x: -100 },
                animate: { opacity: 0.6, x: 0 },
                exit: { opacity: 0, x: -100 },
              };
            } else if (idx === nextIdx) {
              positionClass = "absolute right-[10%] z-10 scale-90 opacity-60";
              motionProps = {
                initial: { opacity: 0, x: 100 },
                animate: { opacity: 0.6, x: 0 },
                exit: { opacity: 0, x: 100 },
              };
            } else {
              positionClass = "opacity-0 pointer-events-none";
            }

            return (
              <AnimatePresence key={idx}>
                {(idx === activeIdx || idx === prevIdx || idx === nextIdx) && (
                  <motion.div
                    key={idx}
                    {...motionProps}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className={`absolute flex justify-center items-center w-48 md:w-56 lg:w-60 ${positionClass}`}
                  >
                    <div
                      className={`bg-white/70 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-lg border border-white/60 transition-all duration-500 ${
                        idx === activeIdx
                          ? "scale-110 shadow-blue-200 drop-shadow-xl"
                          : "shadow-md"
                      }`}
                    >
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={180}
                        height={100}
                        className="object-contain mx-auto"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-10">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === activeIdx ? "bg-blue-600 scale-110" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
