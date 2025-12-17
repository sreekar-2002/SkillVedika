"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useCourseDetails } from "./useCourseDetails";

import Hero from "@/components/course-details/hero";
import WhyChoose from "@/components/course-details/why-choose";
import WhoShouldJoin from "@/components/course-details/who-should-join";
import KeyOutcomes from "@/components/course-details/key-outcomes";
import TrainingAgenda from "@/components/course-details/training-agenda";
import JobAssistance from "@/components/course-details/job-assistance";
import FAQ from "@/components/course-details/faq";
import Placement from "@/components/course-details/placement";
import Reserve from "@/components/course-details/reserve";

export default function CourseDetailsPage() {
  // Use Next.js navigation hooks for client components
  const params = useParams();
  const searchParams = useSearchParams();
  
  // Debug logging
  useEffect(() => {
    console.log('CourseDetailsPage rendered with params:', params);
  }, [params]);
  
  const id = String(params?.id || '');

  const { course, allCourses, loading } = useCourseDetails(id);

  // Parse formDetails from search params
  const formDetailsParam = searchParams?.get('formDetails');
  let formDetails = null;
  try {
    if (formDetailsParam) {
      formDetails = JSON.parse(decodeURIComponent(formDetailsParam));
    }
  } catch (e) {
    console.error('Error parsing formDetails:', e);
    formDetails = null;
  }

  // Show error if id is missing
  if (!id) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Course ID</h1>
          <p className="text-gray-600 mb-8">
            The course ID is missing or invalid.
          </p>
          <a href="/courses" className="text-blue-600 hover:underline">
            Back to Courses
          </a>
        </div>
      </div>
    );
  }

  // Update meta tags when course data loads
  useEffect(() => {
    if (!course) return;

    // Update title
    document.title = course.details?.meta_title || course.title || "Course Details";
    
    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    if (course.details?.meta_description) {
      metaDescription.setAttribute("content", course.details.meta_description);
    }

    // Update or create meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    if (course.details?.meta_keywords) {
      metaKeywords.setAttribute("content", course.details.meta_keywords);
    }

    // Update OG tags for social sharing
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", course.details?.meta_title || course.title || "Course Details");

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement("meta");
      ogDescription.setAttribute("property", "og:description");
      document.head.appendChild(ogDescription);
    }
    if (course.details?.meta_description) {
      ogDescription.setAttribute("content", course.details.meta_description);
    }
  }, [course]);

  if (loading) {
    return (
      <div className="text-center py-20 text-lg text-gray-700">
        <p>Loading course details...</p>
        <p className="text-sm text-gray-500 mt-2">Course ID: {id || 'N/A'}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-2">
            The course with ID "{id}" could not be loaded.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Please check if the course exists and try again.
          </p>
          <a href="/courses" className="text-blue-600 hover:underline">
            Back to Courses
          </a>
        </div>
      </div>
    );
  }

  // Ensure details exist with fallback
  const courseDetails = course.details || {
    agenda: [],
    why_choose: [],
    who_should_join: [],
    key_outcomes: [],
  };

  return (
    <main className="w-full">
      <Hero course={course} allCourses={allCourses} formDetails={formDetails} />
      <TrainingAgenda agenda={courseDetails.agenda || []} />
      <WhyChoose list={courseDetails.why_choose || []} />
      <WhoShouldJoin list={courseDetails.who_should_join || []} />
      <KeyOutcomes list={courseDetails.key_outcomes || []} />
      <JobAssistance />
      <FAQ />
      <Placement />
      <Reserve agenda={courseDetails.agenda || []} />
    </main>
  );
}
