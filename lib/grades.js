// Σύστημα βαθμών τεκμηρίωσης — αντικαθιστά το παλιό δυαδικό
// "Τεκμηριωμένο / Χρειάζεται πηγή" με 4 διαβαθμίσεις, βασισμένες στη
// φύση της κάθε πηγής (πρωτογενής δήλωση, πολλαπλές δευτερογενείς πηγές,
// έλλειψη πηγής, ή απλή προφορική παράδοση).

export const GRADES = {
  A: {
    code: "Α",
    title: "Πρωτογενής πηγή",
    description:
      "Βασισμένο σε αυτούσια δήλωση, συνέντευξη ή γραπτό του ίδιου του δημιουργού.",
    badgeClass: "bg-gold text-white border-gold",
    outlineClass: "border-gold text-gold",
    textClass: "text-gold",
  },
  B: {
    code: "Β",
    title: "Τεκμηριωμένο",
    description:
      "Πολλαπλές, συγκλίνουσες δευτερογενείς πηγές — άρθρα, βιβλία, επίσημα αρχεία.",
    badgeClass: "bg-brand text-white border-brand",
    outlineClass: "border-brand text-brand",
    textClass: "text-brand",
  },
  C: {
    code: "Γ",
    title: "Χρειάζεται πηγή",
    description:
      "Η ιστορία κυκλοφορεί ευρέως, αλλά δεν έχει ακόμα εντοπιστεί πρωτογενής επιβεβαίωση.",
    badgeClass: "bg-teal text-white border-teal",
    outlineClass: "border-teal text-teal",
    textClass: "text-teal",
  },
  D: {
    code: "Δ",
    title: "Παράδοση — ανεπιβεβαίωτο",
    description:
      "Μεταθανάτια αφήγηση ή προφορική παράδοση, χωρίς σύγχρονη τεκμηρίωση.",
    badgeClass: "bg-clay text-white border-clay",
    outlineClass: "border-clay text-clay",
    textClass: "text-clay",
  },
};

export function getGrade(song) {
  return GRADES[song?.grade] || GRADES.C;
}
