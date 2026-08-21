// Λεξικό διεπαφής (UI strings) για τις δύο εκδόσεις του site.
// Ελληνικά = προεπιλογή, στο root. Αγγλικά = /en/*.
// Το περιεχόμενο κάθε τραγουδιού (ιστορία, quotes) μεταφράζεται ξεχωριστά
// μέσα στο ίδιο το content/songs/*.json, στο πεδίο "en".

export const dictionaries = {
  el: {
    lang: "el",
    htmlLang: "el",
    ogLocale: "el_GR",
    siteName: "Ταξίδι στη Μουσική",
    siteTagline: "Ιστορίες πίσω από τα τραγούδια",
    siteDescription:
      "Οι αληθινές, τεκμηριωμένες ιστορίες πίσω από ελληνικά έντεχνα και λαϊκά τραγούδια — μόνο από συνεντεύξεις, βιβλία και επίσημες πηγές.",
    nav: { about: "Σχετικά", switchTo: "EN" },
    footer:
      "Κάθε ιστορία εδώ τεκμηριώνεται με πηγές που φαίνονται στο τέλος κάθε άρθρου. Αν μια ιστορία δεν έχει ακόμη πρωτογενή πηγή, σημειώνεται ρητά.",
    footerAboutLink: "Σχετικά με το project",
    hero: {
      kicker: "Πραγματικές ιστορίες, όχι θρύλοι",
      titleParts: ["Κάθε τραγούδι ", "κρύβει", " μια ιστορία"],
      subtitle:
        "Γιατί γράφτηκε; Ποιος πόνεσε, ερωτεύτηκε ή θυμώνει πίσω από κάθε στίχο; Σκάβουμε σε συνεντεύξεις, βιβλία και επίσημα αρχεία — καμία φήμη δεν περνάει χωρίς απόδειξη.",
      randomButton: "🎲 Έκπληξέ με με μια ιστορία",
    },
    featured: { kicker: "✨ Επιλεγμένο τεκμήριο", from: "— από το" },
    tabs: {
      composers: "Συνθέτες",
      lyricists: "Στιχουργοί",
      performers: "Ερμηνευτές",
      titles: "Τραγούδια",
    },
    searchPlaceholder: {
      composers: "Αναζήτησε συνθέτη…",
      lyricists: "Αναζήτησε στιχουργό…",
      performers: "Αναζήτησε ερμηνευτή…",
      titles: "Αναζήτησε τραγούδι…",
    },
    searchHint: {
      composers: "Αναζήτηση με βάση το όνομα του συνθέτη",
      lyricists: "Αναζήτηση με βάση το όνομα του στιχουργού",
      performers: "Αναζήτηση με βάση το όνομα του ερμηνευτή",
      titles: "Μπορείς να αναζητήσεις: τραγούδι, συνθέτη, στιχουργό ή ερμηνευτή",
    },
    statsLine: (songs, composers, lyricists, performers) =>
      `Στη συλλογή: ${songs} τραγούδια · ${composers} συνθέτες · ${lyricists} στιχουργοί · ${performers} ερμηνευτές`,
    popularHeading: "Δημοφιλή",
    popularColumns: {
      composers: "Συνθέτες",
      lyricists: "Στιχουργοί",
      performers: "Ερμηνευτές",
      titles: "Τίτλοι",
    },
    allLetters: "Όλα",
    resultsLine: (count, total) => `Εμφανίζονται ${count} από ${total}`,
    noNames: "Δεν βρέθηκαν ονόματα.",
    noSongs: "Δεν βρέθηκαν τραγούδια για αυτή την αναζήτηση.",
    backToAll: "← Όλα τα τραγούδια",
    yearLabel: "",
    performerLabel: "Ερμηνεία:",
    filmLabel: "Ταινία:",
    caveatLabel: "Σημείωση προσοχής:",
    performancesHeading: "Οι εκτελέσεις",
    firstPerformance: "Πρώτη εκτέλεση",
    famousPerformance: "Πιο γνωστή / αγαπημένη εκτέλεση",
    interviewHeading: "Συνέντευξη / ντοκουμέντο",
    coverHeading: "Το cover",
    watchVideo: "Δες το βίντεο →",
    sourceLabel: "Πηγή:",
    seeSource: "Δες την πηγή →",
    sourcesHeading: "Πηγές",
    grades: {
      A: {
        code: "Α",
        title: "Πρωτογενής πηγή",
        description:
          "Βασισμένο σε αυτούσια δήλωση, συνέντευξη ή γραπτό του ίδιου του δημιουργού.",
      },
      B: {
        code: "Β",
        title: "Τεκμηριωμένο",
        description:
          "Πολλαπλές, συγκλίνουσες δευτερογενείς πηγές — άρθρα, βιβλία, επίσημα αρχεία.",
      },
      C: {
        code: "Γ",
        title: "Χρειάζεται πηγή",
        description:
          "Η ιστορία κυκλοφορεί ευρέως, αλλά δεν έχει ακόμα εντοπιστεί πρωτογενής επιβεβαίωση.",
      },
      D: {
        code: "Δ",
        title: "Παράδοση — ανεπιβεβαίωτο",
        description:
          "Μεταθανάτια αφήγηση ή προφορική παράδοση, χωρίς σύγχρονη τεκμηρίωση.",
      },
    },
    about: {
      title: "Σχετικά με το",
      titleHighlight: "Ταξίδι στη Μουσική",
      s1h: "Τι είναι αυτό το project",
      s1p:
        "Το «Ταξίδι στη Μουσική» εξιστορεί τις πραγματικές, τεκμηριωμένες ιστορίες πίσω από ελληνικά έντεχνα και λαϊκά τραγούδια — από τη στιγμή που γράφτηκαν μέχρι τους ανθρώπους που τα έζησαν. Ξεκίνησε σαν ιδέα για ένα κανάλι (YouTube / Instagram / TikTok) και επεκτάθηκε σε blog, ώστε κάθε ιστορία να μπορεί να τεκμηριωθεί πλήρως — με παραπομπές, βίντεο-ντοκουμέντα και πηγές που ο καθένας μπορεί να ελέγξει ο ίδιος.",
      s2h: "Ο κανόνας των πηγών",
      s2p1a:
        "Κάθε ισχυρισμός εδώ χρειάζεται μια πηγή που μπορεί να δειχθεί — συνέντευξη του ίδιου του δημιουργού, επίσημο αρχείο (π.χ. Αρχείο ΕΡΤ), βιβλίο ή δημοσιευμένο άρθρο. Όταν μια ιστορία δεν έχει ακόμη πρωτογενή πηγή, δεν κρύβεται — σημειώνεται ρητά ως",
      s2p1b: "⚠️ «Χρειάζεται πρωτογενή πηγή»",
      s2p1c: "μέχρι να επιβεβαιωθεί.",
      s2p2:
        "Όταν μια πηγή είναι βιβλίο, δεν αντιγράφουμε αυτούσιο το κείμενό του — το παραφράζουμε με ακριβή παραπομπή (τίτλος, συγγραφέας, εκδότης, έτος, σελίδα) και παραπέμπουμε στο ίδιο το βιβλίο για την πρωτότυπη διατύπωση. Οι δημοσιογραφικές πηγές (άρθρα, περιοδικά) μπορούν να παρατίθενται αυτούσια, με πλήρη αναφορά.",
      s3h: "Ποιος το φτιάχνει",
      s3p:
        "[Να συμπληρωθεί: λίγα λόγια για τον Αριστείδη — η σχέση του με τη μουσική, γιατί ξεκίνησε αυτό το project, και ο δικός του δρόμος ως τραγουδιστής.]",
    },
  },

  en: {
    lang: "en",
    htmlLang: "en",
    ogLocale: "en_US",
    siteName: "A Journey Through Music",
    siteTagline: "The stories behind the songs",
    siteDescription:
      "The true, documented stories behind Greek éntechno and laïkó songs — sourced only from interviews, books, and official archives.",
    nav: { about: "About", switchTo: "ΕΛ" },
    footer:
      "Every story here is sourced, with references listed at the end of each article. If a story doesn't yet have a primary source, that's stated explicitly.",
    footerAboutLink: "About this project",
    hero: {
      kicker: "Real stories, not legends",
      titleParts: ["Every song ", "hides", " a story"],
      subtitle:
        "Why was it written? Who was hurting, falling in love, or angry behind each line? We dig through interviews, books, and official archives — no rumor gets in without proof.",
      randomButton: "🎲 Surprise me with a story",
    },
    featured: { kicker: "✨ Featured artifact", from: "— from" },
    tabs: {
      composers: "Composers",
      lyricists: "Lyricists",
      performers: "Performers",
      titles: "Songs",
    },
    searchPlaceholder: {
      composers: "Search a composer…",
      lyricists: "Search a lyricist…",
      performers: "Search a performer…",
      titles: "Search a song…",
    },
    searchHint: {
      composers: "Search by the composer's name",
      lyricists: "Search by the lyricist's name",
      performers: "Search by the performer's name",
      titles: "You can search by: song, composer, lyricist, or performer",
    },
    statsLine: (songs, composers, lyricists, performers) =>
      `In the collection: ${songs} songs · ${composers} composers · ${lyricists} lyricists · ${performers} performers`,
    popularHeading: "Popular",
    popularColumns: {
      composers: "Composers",
      lyricists: "Lyricists",
      performers: "Performers",
      titles: "Titles",
    },
    allLetters: "All",
    resultsLine: (count, total) => `Showing ${count} of ${total}`,
    noNames: "No names found.",
    noSongs: "No songs found for this search.",
    backToAll: "← All songs",
    yearLabel: "",
    performerLabel: "Performed by:",
    filmLabel: "Film:",
    caveatLabel: "A note of caution:",
    performancesHeading: "The performances",
    firstPerformance: "First performance",
    famousPerformance: "Best-known / favorite performance",
    interviewHeading: "Interview / documentary",
    coverHeading: "The cover",
    watchVideo: "Watch the video →",
    sourceLabel: "Source:",
    seeSource: "See the source →",
    sourcesHeading: "Sources",
    grades: {
      A: {
        code: "Α",
        title: "Primary source",
        description:
          "Based on a direct statement, interview, or writing from the creator themselves.",
      },
      B: {
        code: "Β",
        title: "Documented",
        description:
          "Multiple, converging secondary sources — articles, books, official archives.",
      },
      C: {
        code: "Γ",
        title: "Needs a source",
        description:
          "The story circulates widely, but no primary confirmation has been found yet.",
      },
      D: {
        code: "Δ",
        title: "Tradition — unconfirmed",
        description:
          "A posthumous account or oral tradition, without contemporary documentation.",
      },
    },
    about: {
      title: "About",
      titleHighlight: "A Journey Through Music",
      s1h: "What this project is",
      s1p:
        "“A Journey Through Music” tells the real, documented stories behind Greek éntechno and laïkó songs — from the moment they were written to the people who lived them. It started as an idea for a channel (YouTube / Instagram / TikTok) and grew into a blog, so that every story could be fully sourced — with citations, video documents, and references anyone can check for themselves.",
      s2h: "Our sourcing rule",
      s2p1a:
        "Every claim here needs a source that can be shown — an interview with the creator themselves, an official archive (e.g. the Greek public broadcaster's archive, ERT), a book, or a published article. When a story doesn't yet have a primary source, that isn't hidden — it's marked explicitly as",
      s2p1b: "⚠️ “Needs a primary source”",
      s2p1c: "until confirmed.",
      s2p2:
        "When a source is a book, we never reproduce its exact wording — we paraphrase it with a precise citation (title, author, publisher, year, page) and point readers to the book itself for the original text. Journalistic sources (newspaper and magazine articles) may be quoted directly, with full attribution.",
      s3h: "Who makes this",
      s3p:
        "[To be filled in: a few words about Aristeidis — his relationship with music, why he started this project, and his own path as a singer.]",
    },
  },
};

export function getDictionary(lang) {
  return dictionaries[lang] || dictionaries.el;
}
