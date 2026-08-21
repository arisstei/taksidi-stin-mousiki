"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";

function otherLangPath(pathname) {
  if (pathname.startsWith("/en")) {
    const rest = pathname.slice(3);
    return rest === "" ? "/" : rest;
  }
  return pathname === "/" ? "/en" : `/en${pathname}`;
}

export function SiteHeader() {
  const pathname = usePathname() || "/";
  const lang = pathname.startsWith("/en") ? "en" : "el";
  const t = getDictionary(lang);
  const basePath = lang === "en" ? "/en" : "";
  const switchHref = otherLangPath(pathname);

  return (
    <header className="border-b border-black/10 bg-cream/80 backdrop-blur sticky top-0 z-10">
      <div className="h-[3px] bg-gradient-to-r from-brand via-gold to-brand" />
      <div className="mx-auto max-w-3xl px-6 py-5 flex items-center justify-between">
        <Link href={`${basePath}/`} className="font-serif text-xl tracking-tight text-ink">
          {lang === "en" ? (
            <>
              A Journey Through <span className="text-brand">Music</span>
            </>
          ) : (
            <>
              Ταξίδι στη <span className="text-brand">Μουσική</span>
            </>
          )}
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href={`${basePath}/about`}
            className="text-sm text-ink/60 hover:text-brand transition-colors"
          >
            {t.nav.about}
          </Link>
          <span className="text-sm text-ink/50 hidden sm:block">{t.siteTagline}</span>
          <Link
            href={switchHref}
            className="text-xs font-mono font-semibold px-2 py-1 rounded border border-black/15 text-ink/60 hover:border-brand/50 hover:text-brand transition-colors"
          >
            {t.nav.switchTo}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const pathname = usePathname() || "/";
  const lang = pathname.startsWith("/en") ? "en" : "el";
  const t = getDictionary(lang);
  const basePath = lang === "en" ? "/en" : "";

  return (
    <footer className="mx-auto max-w-3xl px-6 py-10 text-sm text-ink/40 border-t border-black/10 mt-16">
      {t.footer}{" "}
      <Link href={`${basePath}/about`} className="hover:text-brand transition-colors">
        {t.footerAboutLink}
      </Link>
    </footer>
  );
}
