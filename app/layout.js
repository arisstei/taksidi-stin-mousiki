import "./globals.css";
import Link from "next/link";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Ιστορίες πίσω από τα τραγούδια`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
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
        <header className="border-b border-black/10 bg-cream/80 backdrop-blur sticky top-0 z-10">
          <div className="mx-auto max-w-3xl px-6 py-5 flex items-center justify-between">
            <Link href="/" className="font-serif text-xl tracking-tight text-ink">
              Ταξίδι στη <span className="text-brand">Μουσική</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/about"
                className="text-sm text-ink/60 hover:text-brand transition-colors"
              >
                Σχετικά
              </Link>
              <span className="text-sm text-ink/50 hidden sm:block">
                Ιστορίες πίσω από τα τραγούδια
              </span>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
        <footer className="mx-auto max-w-3xl px-6 py-10 text-sm text-ink/40 border-t border-black/10 mt-16">
          Κάθε ιστορία εδώ τεκμηριώνεται με πηγές που φαίνονται στο τέλος κάθε
          άρθρου. Αν μια ιστορία δεν έχει ακόμη πρωτογενή πηγή, σημειώνεται
          ρητά. ·{" "}
          <Link href="/about" className="hover:text-brand transition-colors">
            Σχετικά με το project
          </Link>
        </footer>
      </body>
    </html>
  );
}
