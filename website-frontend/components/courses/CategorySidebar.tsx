"use client";

import { useEffect, useState } from "react";

export default function CategorySidebar({
  categories,
  selected,
  onChange,
  totalResults,
  isSearchMode,
}) {
  const [heading, setHeading] = useState("Categories");

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/course-page-content")
      .then((res) => res.json())
      .then((data) => setHeading(data.sidebar_heading));
  }, []);


  return (
    <aside className="bg-white rounded-3xl shadow p-6 w-64 h-[1150px] flex flex-col sticky top-24">
      <h3 className="text-lg font-semibold text-gray-900 mb-5">
        {heading}
      </h3>

      <div className="space-y-3 max-h-[950px] overflow-y-auto pr-2">

        {/* ALL */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 accent-[#1E5BA8]"
            checked={!isSearchMode && selected.includes("all")}
            onChange={() => onChange("all")}
          />
          <span className="text-sm text-gray-800">All</span>
        </label>

        {/* CATEGORY LIST */}
        {categories.map((cat) => (
          <label
            key={cat.id}
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              type="checkbox"
              className="w-4 h-4 accent-[#1E5BA8]"
              checked={!isSearchMode && selected.includes(String(cat.id))}
              onChange={() => onChange(String(cat.id))}
            />
            <span className="text-sm text-gray-800">{cat.name}</span>
          </label>
        ))}
      </div>

      <p className="mt-6 text-sm text-gray-700">{totalResults} Courses</p>
    </aside>
  );
}
