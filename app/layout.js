import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Ιστορίες πίσω από τα τραγούδια`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
    languages: { el: SITE_URL, en: `${SITE_URL}/en` },
  },
  openGraph: {
    type: "website",
    locale: "el_GR",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Ιστορίες πίσω από τα τραγούδια`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} — Ιστορίες πίσω από τα τραγούδια`,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="el">
      <body className="min-h-screen antialiased">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
