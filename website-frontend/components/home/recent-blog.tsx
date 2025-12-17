"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import parse from "html-react-parser";

export default function RecentBlogs({ blogs, blogHeading }: any) {
  const cardsPerSlide = 3;

  // Normalize blog data from API (handle different field names)
  const normalizedBlogs = blogs.map((blog: any) => ({
    id: blog.blog_id || blog.id,
    title: blog.blog_name || blog.title,
    slug: blog.url_friendly_title || blog.slug,
    image: blog.banner_image || blog.thumbnail_image || blog.images || "/placeholder.svg",
    date: blog.published_at,
    recent_blog: blog.recent_blog,
  }));

  // Sort blogs newest → oldest
  const sortedBlogs = useMemo(() => {
    return [...normalizedBlogs].sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [normalizedBlogs]);

  // Group blogs into chunks of 3
  const slides = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < sortedBlogs.length; i += cardsPerSlide) {
      chunks.push(sortedBlogs.slice(i, i + cardsPerSlide));
    }
    return chunks;
  }, [sortedBlogs]);

  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((p) => (p + 1) % slides.length);
  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);

  return (
    <section className="py-16 px-6 bg-white relative">
      <div className="max-w-7xl mx-auto relative">

        {/* ⭐ CMS Heading (hydration safe wrapper) */}
        <div className="text-3xl font-bold text-gray-900 mb-12">
          {blogHeading ? parse(blogHeading) : "Recent Blogs"}
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center 
                     bg-white shadow-md rounded-full hover:bg-gray-100 z-20"
        >
          <ChevronLeft className="text-[#1e5ba8]" size={28} />
        </button>

        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center 
                     bg-white shadow-md rounded-full hover:bg-gray-100 z-20"
        >
          <ChevronRight className="text-[#1e5ba8]" size={28} />
        </button>

        {/* Slider */}
        <div className="overflow-hidden relative px-8">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((group, i) => (
              <div
                key={i}
                className="min-w-full grid grid-cols-1 md:grid-cols-3 gap-10 px-4 items-stretch"
              >
                {group.map((b: any) => {
                  // Image extraction - normalized field
                  let img = b.image || "/placeholder.svg";

                  if (!img.startsWith("/") && !img.startsWith("http")) {
                    img = "/" + img;
                  }

                  return (
                    <div
                      key={b.id}
                      className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition p-4 border flex flex-col h-full"
                    >
                      <img
                        src={img}
                        alt={b.title}
                        className="w-full h-56 object-cover rounded-lg mb-5"
                      />

                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {b.title}
                      </h3>

                      <span className="text-sm text-gray-500 block mb-3">
                        {b.date
                          ? new Date(b.date).toDateString()
                          : ""}
                      </span>

                      <a
                        href={`/blog/${b.slug}`}
                        className="bg-[#1e5ba8] text-white px-4 py-2 rounded text-sm hover:bg-blue-700 mt-auto self-start"
                      >
                        Read More
                      </a>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
