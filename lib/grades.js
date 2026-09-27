// Κλίμακα τεκμηρίωσης (από το χαμηλότερο στο υψηλότερο):
//   D → C → B → A → S → SS → SSS
// D/C/B: όπως πριν (παράδοση / χρειάζεται πηγή / τεκμηριωμένο).
// A   (≥90%): θεσμική ή επιστημονική πηγή, ή πολλές ανεξάρτητες που συγκλίνουν.
// S   (95%):  ο ίδιος ο δημιουργός αφηγείται την ιστορία — δημοσιευμένα, με ακριβή παραπομπή.
// SS  (99%):  ο δημιουργός + ανεξάρτητη επιβεβαίωση από άλλον συντελεστή ή σύγχρονο τεκμήριο.
// SSS (100%): ο δημιουργός σε ηχητικό/οπτικό ή αυτόγραφο τεκμήριο + σύγχρονο της εποχής
//             ντοκουμέντο (χρονολογημένο δημοσίευμα, χειρόγραφο, αρχειακό έγγραφο) + καμία
//             αντικρουόμενη πηγή.
// Τα κείμενα (τίτλος/περιγραφή) ανά γλώσσα βρίσκονται στο lib/dictionaries.js.

export const GRADE_ORDER = ["SSS", "SS", "S", "A", "B", "C", "D"]; // για εμφάνιση (υψηλότερο πρώτα)

export const GRADES = {
  SSS: {
    code: "SSS",
    percent: "100%",
    stars: 3,
    badgeClass: "grade-sss text-[#f3dc9b] border-[#b8863c]",
    outlineClass: "border-[#b8863c] text-[#241b16] bg-[#f3dc9b]",
    textClass: "text-[#b8863c]",
  },
  SS: {
    code: "SS",
    percent: "99%",
    stars: 2,
    badgeClass: "grade-ss text-[#241b16] border-[#9c6f2c]",
    outlineClass: "border-[#9c6f2c] text-[#9c6f2c]",
    textClass: "text-[#9c6f2c]",
  },
  S: {
    code: "S",
    percent: "95%",
    stars: 1,
    badgeClass: "bg-[#5e2626] text-[#f2d9a0] border-[#b8863c]",
    outlineClass: "border-[#5e2626] text-[#5e2626]",
    textClass: "text-[#5e2626]",
  },
  A: {
    code: "A",
    percent: "≥90%",
    badgeClass: "bg-brand text-white border-brand",
    outlineClass: "border-brand text-brand",
    textClass: "text-brand",
  },
  B: {
    code: "B",
    badgeClass: "bg-teal text-white border-teal",
    outlineClass: "border-teal text-teal",
    textClass: "text-teal",
  },
  C: {
    code: "C",
    badgeClass: "bg-[#7a6f64] text-white border-[#7a6f64]",
    outlineClass: "border-[#7a6f64] text-[#7a6f64]",
    textClass: "text-[#7a6f64]",
  },
  D: {
    code: "D",
    badgeClass: "bg-clay text-white border-clay",
    outlineClass: "border-clay text-clay",
    textClass: "text-clay",
  },
};

export function getGrade(song) {
  return GRADES[song?.grade] || GRADES.C;
}
