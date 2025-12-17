"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CourseSearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any>({
    popular: [],
    categories: [],
    courses: [],
    blogs: [],
  });
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 🎯 SAME industry skills + ranking logic
  const INDUSTRY_SKILLS = [
    "AWS","Amazon Web Services","Azure","Google Cloud","GCP","Cloud Computing",
    "Cloud Architecture","Cloud Security","DevOps","GitOps","Docker","Kubernetes",
    "Helm","Terraform","Ansible","CI/CD","Jenkins","Linux Administration",
    "Python","JavaScript","TypeScript","Java","C#","C++","Go","Ruby","Rust","PHP",
    "Node.js","Express.js","React","Next.js","Angular","Vue.js","Svelte","Frontend Development",
    "Backend Development","Full Stack Development","Android Development","iOS Development",
    "UI/UX Design","Figma","SQL","MySQL","MongoDB","PostgreSQL","Data Science",
    "Machine Learning","Deep Learning","NLP","TensorFlow","PyTorch","Cybersecurity",
    "Ethical Hacking","Testing","Selenium","Cypress","Digital Marketing","SEO"
  ];

  // BASIC Levenshtein
  const levenshtein = (a: string, b: string) => {
    const dp = Array.from({ length: a.length + 1 }, () =>
      new Array(b.length + 1).fill(0)
    );
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
    return dp[a.length][b.length];
  };

  const rankSkills = (skills: string[], query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return skills.slice(0, 15);

    const scored = skills.map((skill) => {
      const s = skill.toLowerCase();
      let score = 0;

      if (s.startsWith(q)) score += 100;
      if (s.includes(q)) score += 60;

      const dist = levenshtein(q, s);
      score += Math.max(0, 40 - dist);

      return { skill, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 15).map((x) => x.skill);
  };

  // DEBOUNCE LOGIC
  useEffect(() => {
    if (!searchTerm.trim()) {
      setShowDropdown(false);
      return;
    }
    const delay = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // CLOSE DROPDOWN
  useEffect(() => {
    const handler = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // GET SUGGESTIONS
  const fetchSuggestions = async () => {
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://127.0.0.1:8000/api";

      const { data } = await axios.get(
        `${apiBase}/search/suggestions?q=${encodeURIComponent(searchTerm)}`
      );

      const mergedPopular = Array.from(
        new Set([
          ...(data.popular || []),
          ...rankSkills(INDUSTRY_SKILLS, searchTerm),
        ])
      ).slice(0, 15);

      setSuggestions({
        popular: mergedPopular,
        categories: data.categories || [],
        courses: data.courses || [],
        blogs: data.blogs || [],
      });

      setShowDropdown(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    router.push(`/courses?search=${encodeURIComponent(searchTerm)}`);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-xl">

      {/* INPUT + BUTTON */}
      <div className="flex gap-2">
        <div className="flex-1 bg-white border border-gray-300 rounded-md px-4 flex items-center">
          <input
            type="text"
            placeholder="Search by skill"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full py-3 bg-transparent outline-none"
          />
        </div>

        <button
          onClick={handleSearch}
          className="bg-[#2C5AA0] text-white px-6 py-3 rounded-md hover:bg-blue-900"
        >
          <Search size={20} />
        </button>
      </div>

      {/* DROPDOWN */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full bg-white rounded-md shadow-xl border max-h-64 overflow-y-auto z-50"
        >
          {/* CLOSE */}
          <div className="flex justify-end p-2 border-b">
            <button
              onClick={() => setShowDropdown(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          </div>

          {/* POPULAR */}
          {suggestions.popular.length > 0 && (
            <>
              <div className="px-4 py-2 text-xs text-gray-500">Popular</div>
              {suggestions.popular.map((item: string) => (
                <div
                  key={item}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSearchTerm(item);
                    handleSearch();
                  }}
                >
                  {item}
                </div>
              ))}
            </>
          )}

        </div>
      )}
    </div>
  );
}
