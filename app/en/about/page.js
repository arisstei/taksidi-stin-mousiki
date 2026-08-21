import AboutContent from "@/components/AboutContent";
import { getDictionary } from "@/lib/dictionaries";

const t = getDictionary("en");

export const metadata = {
  title: { absolute: `About — ${t.siteName}` },
  description: `What ${t.siteName} is, and the sourcing rule we follow in every article.`,
  alternates: { languages: { el: "/about" } },
};

export default function EnglishAboutPage() {
  return <AboutContent lang="en" />;
}
