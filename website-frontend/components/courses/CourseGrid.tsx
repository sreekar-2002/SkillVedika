"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import CourseRow from "./CourseRow";
import CategorySidebar from "./CategorySidebar";

export default function CourseGrid({ searchQuery = "", urlCategory = "" }) {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCats, setSelectedCats] = useState(["all"]);
  const [forcedCategory, setForcedCategory] = useState("");

  // ⭐ Prevents search-mode from staying disabled forever
  const [forceExitSearch, setForceExitSearch] = useState(false);

  // ⭐ FIX: Whenever URL searchQuery changes → allow search mode again
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setForceExitSearch(false);
    }
  }, [searchQuery]);

  // LOAD DATA
  useEffect(() => {
    async function load() {
      try {
        const [catRes, courseRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/categories"),
          axios.get("http://127.0.0.1:8000/api/courses"),
        ]);

        // Handle categories - check if data exists and is an array
        const categoriesData = catRes?.data?.data || catRes?.data || [];
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);

        // Handle courses - check if data exists and is an array
        const coursesData = courseRes?.data?.data || courseRes?.data || [];
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      } catch (err) {
        console.error("Error loading data:", err);
        // Ensure arrays are set even on error
        setCategories([]);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="py-20 text-center">Loading...</div>;

  const q = searchQuery.trim().toLowerCase();
  const catQuery = urlCategory.trim().toLowerCase();

  // ⭐ Search mode only when searchQuery exists AND not force-disabled
  const isSearchMode = !forceExitSearch && q.length > 0 && !catQuery;

  // ⭐ CATEGORY SELECT HANDLER
  const handleCategorySelect = (clickedId) => {
    // -------- EXIT SEARCH MODE --------
    if (isSearchMode) {
      setForceExitSearch(true); // disable search mode instantly

      // Clear search param
      const params = new URLSearchParams(window.location.search);
      params.delete("search");
      params.delete("category");

      const cleanUrl = `/courses${params.toString() ? `?${params}` : ""}`;
      window.history.replaceState({}, "", cleanUrl);

      // Apply category immediately
      if (clickedId === "all") {
        setSelectedCats(["all"]);
      } else {
        setSelectedCats([clickedId]);
      }

      return;
    }

    // -------- NORMAL MODE --------
    if (clickedId === "all") {
      setSelectedCats(["all"]);
      return;
    }

    let updated = selectedCats.filter((x) => x !== "all");

    if (updated.includes(clickedId)) {
      updated = updated.filter((x) => x !== clickedId);
    } else {
      updated.push(clickedId);
    }

    if (updated.length === 0) updated = ["all"];
    setSelectedCats(updated);
  };

  // -------- GROUP COURSES BY CATEGORY --------
  // Ensure courses is an array before using filter
  const coursesArray = Array.isArray(courses) ? courses : [];
  const categoriesArray = Array.isArray(categories) ? categories : [];
  
  let grouped = categoriesArray
    .map((cat) => ({
      ...cat,
      courses: coursesArray.filter((c) => c.category_id === cat.id),
    }))
    .filter((g) => g.courses.length > 0);

  // URL CATEGORY MODE
  if (catQuery) {
    const match = categoriesArray.find((c) => c.name?.toLowerCase() === catQuery);
    grouped = match ? grouped.filter((g) => g.id === match.id) : [];
  }

  // SEARCH FILTER
  if (isSearchMode) {
    const matched = coursesArray.filter(
      (c) =>
        c.title?.toLowerCase().includes(q) ||
        (c.description || "").toLowerCase().includes(q) ||
        (c.status || "").toLowerCase().includes(q)
    );

    grouped = grouped
      .map((cat) => ({
        ...cat,
        courses: matched.filter((c) => c.category_id === cat.id),
      }))
      .filter((cat) => cat.courses.length > 0);
  }

  // VIEW ALL MODE
  if (forcedCategory) {
    grouped = grouped.filter(
      (g) => g.name.toLowerCase() === forcedCategory.toLowerCase()
    );
  }

  // APPLY CATEGORY FILTER (checkboxes)
  const finalCategories =
    isSearchMode ||
    forcedCategory ||
    catQuery ||
    selectedCats.includes("all")
      ? grouped
      : grouped.filter((cat) => selectedCats.includes(String(cat.id)));

  const visibleCount = finalCategories.reduce(
    (sum, cat) => sum + cat.courses.length,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-5 py-0">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* ⭐ HIDE SIDEBAR IN VIEW-ALL MODE */}
        {!forcedCategory && (
          <CategorySidebar
            categories={categories}
            selected={selectedCats}
            isSearchMode={isSearchMode}
            totalResults={visibleCount}
            onChange={handleCategorySelect}
          />
        )}

        {/* ⭐ FULL WIDTH WHEN SIDEBAR HIDDEN */}
        <div className={forcedCategory ? "col-span-4" : "md:col-span-3"}>
          {finalCategories.length > 0 ? (
            finalCategories.map((category) => (
              <CourseRow
                key={category.id}
                title={category.name}
                courses={category.courses}
                disableArrows={Boolean(catQuery || forcedCategory)}
                onViewAll={(title) => setForcedCategory(title)}
                onBack={() => setForcedCategory("")}
              />
            ))
          ) : (
            <div className="text-center py-20 text-gray-600">
              No courses match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
