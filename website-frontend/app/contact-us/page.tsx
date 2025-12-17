import HeroSection from "@/components/contact-us/heroSection";
import ContactInfo from "@/components/contact-us/contactInfo";
import MapSection from "@/components/contact-us/mapSection";
import DemoSection from "@/components/contact-us/demoSection";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

/* ----------------------------------------------------
      DYNAMIC SEO META TAGS FOR CONTACT-US PAGE
   Fetches meta fields from the API so editors can change SEO
---------------------------------------------------- */
export async function generateMetadata(): Promise<Metadata> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fallbackTitle = "Contact Us | SkillVedika – Connect With Our Training & Support Team";
  const fallbackDescription =
    "Get in touch with SkillVedika for course inquiries, demo sessions, corporate training, job support, and admissions guidance. Contact us via email, phone, or visit our global offices.";
  const fallbackKeywords = [
    "SkillVedika contact",
    "SkillVedika support",
    "Contact SkillVedika",
    "training institute contact",
    "online course support",
    "corporate training enquiries",
    "IT training contact",
    "job support contact",
    "SkillVedika USA office",
    "SkillVedika Hyderabad office",
  ];

  try {
    // Fetch SEO metadata for the Contact page from the `seos` table.
    // We fetch the specific row by primary key (id = 7) which corresponds
    // to the Contact page in the seed data. This keeps content and SEO
    // separate (admins can manage SEO independently).
    const res = await fetch(`${apiUrl}/seo/7`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to fetch contact page metadata: ${res.status}`);
    }

    const json = await res.json();
    const content = json?.data ?? json ?? null;

    if (!content) {
      return {
        title: fallbackTitle,
        description: fallbackDescription,
        keywords: fallbackKeywords,
        openGraph: {
          title: fallbackTitle,
          description: fallbackDescription,
          url: "https://skillvedika.com/contact-us",
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: fallbackTitle,
          description: fallbackDescription,
        },
      };
    }

    const keywords = content.meta_keywords
      ? typeof content.meta_keywords === "string"
        ? content.meta_keywords.split(",").map((k: string) => k.trim())
        : content.meta_keywords
      : fallbackKeywords;

    const metaTitle = content.meta_title ?? fallbackTitle;
    const metaDescription = content.meta_description ?? fallbackDescription;

    return {
      title: metaTitle,
      description: metaDescription,
      keywords,
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        url: "https://skillvedika.com/contact-us",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: metaTitle,
        description: metaDescription,
      },
    };
  } catch (err) {
    // Return fallback metadata on failure
    console.error("Error generating metadata for Contact Us page:", err);
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      keywords: fallbackKeywords,
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        url: "https://skillvedika.com/contact-us",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: fallbackTitle,
        description: fallbackDescription,
      },
    };
  }
}

export default async function ContactUsPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  let allCourses: any[] = [];
  let content: any = null;
  let formDetails: any = null;

  /* ----------------------------------------------------
     FETCH COURSES (cached to prevent 429)
  ---------------------------------------------------- */
  try {
    const res = await fetch(`${apiUrl}/courses`, {
      next: { revalidate: 86400 }, // cache 24h
    });

    if (res.ok) {
      const json = await res.json();
      // Handle different API response formats
      // API might return: { success: true, data: [...] } or direct array
      allCourses = Array.isArray(json) 
        ? json 
        : (json?.data || json?.courses || []);
      
      // Ensure it's always an array
      if (!Array.isArray(allCourses)) {
        allCourses = [];
      }
    } else {
      console.error("Failed to load courses", res.status);
    }
  } catch (err) {
    console.error("Courses API error:", err);
  }

  /* ----------------------------------------------------
     FETCH CONTACT PAGE CONTENT
  ---------------------------------------------------- */
  try {
    const res2 = await fetch(`${apiUrl}/contact-page`, {
      cache: "no-store",
    });

    if (res2.ok) {
      const json = await res2.json();
      content = json?.data ?? json ?? null;
    } else {
      console.error("Failed to fetch contact page content", res2.status);
    }
  } catch (err) {
    console.error("Contact page content API error:", err);
  }

  /* ----------------------------------------------------
     FETCH FORM DETAILS
  ---------------------------------------------------- */
  try {
    const res3 = await fetch(`${apiUrl}/form-details`, {
      cache: "no-store",
    });

    if (res3.ok) {
      const json = await res3.json();
      const payload = json.data ?? json;

      formDetails = Array.isArray(payload)
        ? payload[payload.length - 1]
        : payload;
    }
  } catch (err) {
    console.error("Failed to fetch form details:", err);
  }

  /* ----------------------------------------------------
     SAFETY BLOCK
  ---------------------------------------------------- */
  if (!content) {
    return (
      <main className="min-h-screen flex items-center justify-center text-red-600">
        Failed to load Contact Us page content.
      </main>
    );
  }

  /* ----------------------------------------------------
     RENDER PAGE
  ---------------------------------------------------- */
  return (
    <div className="w-full">
      <HeroSection
        title={content.hero_title ?? null}
        description={content.hero_description ?? ""}
        buttonText={content.hero_button ?? ""}
        buttonLink={content.hero_button_link ?? "#"}
        image={content.hero_image ?? ""}
      />

      <ContactInfo
        targetLabel={content.contactus_target}
        title={content.contactus_title}
        subtitle={content.contactus_subtitle}
        emailLabel={content.contacts_email_label}
        emailId={content.contacts_email_id}
        emailLink={content.contacts_email_id_link}
        phoneLabel={content.contacts_phone_label}
        phoneNumber={content.contacts_phone_number}
        phoneLink={content.contacts_phone_number_link}
        location1Label={content.contactus_location1_label}
        location1Address={content.contactus_location1_address}
        location1Link={content.contactus_location1_address_link}
        location2Label={content.contactus_location2_label}
        location2Address={content.contactus_location2_address}
        location2Link={content.contactus_location2_address_link}
      />

      <MapSection
        title={content.map_title}
        subtitle={content.map_subtitle}
        mapLink={content.map_link}
        mapLinkIndia={content.map_link_india}
      />

      <DemoSection
        allCourses={allCourses}
        target={content.demo_target}
        title={content.demo_title}
        subtitle={content.demo_subtitle}
        points={content.demo_points}
        formDetails={formDetails}
      />
    </div>
  );
}
