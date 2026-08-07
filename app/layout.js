import "./globals.css";

export const metadata = {
  title: "Ταξίδι στη Μουσική — Ιστορίες πίσω από τα τραγούδια",
  description:
    "Οι αληθινές, τεκμηριωμένες ιστορίες πίσω από ελληνικά έντεχνα και λαϊκά τραγούδια — μόνο από συνεντεύξεις, βιβλία και επίσημες πηγές.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="el">
      <body className="min-h-screen antialiased">
        <header className="border-b border-black/10 bg-cream/80 backdrop-blur sticky top-0 z-10">
          <div className="mx-auto max-w-3xl px-6 py-5 flex items-center justify-between">
            <a href="/" className="font-serif text-xl tracking-tight text-ink">
              Ταξίδι στη <span className="text-brand">Μουσική</span>
            </a>
            <span className="text-sm text-ink/50 hidden sm:block">
              Ιστορίες πίσω από τα τραγούδια
            </span>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
        <footer className="mx-auto max-w-3xl px-6 py-10 text-sm text-ink/40 border-t border-black/10 mt-16">
          Κάθε ιστορία εδώ τεκμηριώνεται με πηγές που φαίνονται στο τέλος κάθε
          άρθρου. Αν μια ιστορία δεν έχει ακόμη πρωτογενή πηγή, σημειώνεται
          ρητά.
        </footer>
      </body>
    </html>
  );
}
