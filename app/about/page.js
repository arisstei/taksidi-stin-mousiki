import AboutContent from "@/components/AboutContent";

export const metadata = {
  title: "Σχετικά",
  description:
    "Τι είναι το Ταξίδι στη Μουσική, και ο κανόνας πηγών που ακολουθούμε σε κάθε άρθρο.",
  alternates: { languages: { en: "/en/about" } },
};

export default function AboutPage() {
  return <AboutContent lang="el" />;
}
