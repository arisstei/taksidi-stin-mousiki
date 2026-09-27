import Link from "next/link";
import ArchiveVideo from "@/components/ArchiveVideo";
import DiamondDivider from "@/components/DiamondDivider";
import LyricistSongList from "@/components/LyricistSongList";

export default function LyricistContent({ person, lang = "el" }) {
  const basePath = lang === "en" ? "/en" : "";
  const total = (person.sections || []).reduce((n, s) => n + s.songs.length, 0);
  const recorded = (person.sections || []).find((s) => s.id === "recorded")?.songs.length || 0;

  return (
    <article>
      <Link href={`${basePath}/composers`} className="text-sm text-brand hover:underline">
        {lang === "en" ? "← Discographies" : "← Δισκογραφίες"}
      </Link>

      <header className="archive-folder mt-6">
        <span className="folder-tab font-mono text-[10px] uppercase tracking-[0.25em]">
          {lang === "en" ? "File" : "Φάκελος"} № {person.fileNo} · {person.name}
        </span>
        <div className="relative p-6 sm:p-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold mb-3">
            {lang === "en" ? "Poet · Lyricist" : "Ποιητής · Στιχουργός"} · {person.lifespan}
          </p>
          <h1 className="font-serif font-bold uppercase tracking-tight text-4xl sm:text-6xl text-ink leading-[0.95]">
            {person.name}
          </h1>
          <p className="font-serif italic text-lg sm:text-xl text-ink/70 mt-4 max-w-2xl">{person.tagline}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-6 font-mono text-[11px] uppercase tracking-wider text-ink/50">
            <span>{recorded} {lang === "en" ? "recorded songs" : "δισκογραφημένα τραγούδια"}</span>
            <span>{total} {lang === "en" ? "texts in total" : "κείμενα συνολικά"}</span>
          </div>
          <span aria-hidden="true" className="stamp absolute top-6 right-6 hidden sm:flex">
            {lang === "en" ? "Archive" : "Αρχείο"}
            <br />
            {person.born?.slice(0, 4)}–{person.died?.slice(0, 4)}
          </span>
        </div>
      </header>

      <section className="mt-10 space-y-4">
        {(person.bio || []).map((p, i) => (
          <p key={i} className={`text-ink/85 leading-relaxed ${i === 0 ? "dropcap" : ""}`}>{p}</p>
        ))}
      </section>

      {person.interviews?.length > 0 && (
        <section className="mt-14">
          <h2 className="section-kicker">{lang === "en" ? "From the archive" : "Από το αρχείο"}</h2>
          <div className="grid gap-6">
            {person.interviews.map((v, i) => (
              <ArchiveVideo key={i} video={v} lang={lang} />
            ))}
          </div>
        </section>
      )}

      <DiamondDivider className="my-14" />

      <section>
        <h2 className="font-serif text-3xl text-ink mb-2">{lang === "en" ? "All the songs" : "Όλα τα τραγούδια"}</h2>
        <p className="text-sm text-ink/60 mb-6 leading-relaxed">{person.listIntro}</p>
        <LyricistSongList sections={person.sections} lang={lang} />
      </section>

      <section className="mt-14 pt-6 border-t border-black/10">
        <h2 className="font-serif text-lg text-ink mb-3">{lang === "en" ? "Sources" : "Πηγές"}</h2>
        <ul className="space-y-2">
          {(person.sources || []).map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer" className="text-brand hover:underline text-sm">{s.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
