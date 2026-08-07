// Κεντρικές σταθερές του site — άλλαξε το SITE_URL όταν συνδεθεί custom domain
// (ή όρισε το env var NEXT_PUBLIC_SITE_URL στο Vercel χωρίς να αγγίξεις κώδικα).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://taksidi-stin-mousiki.vercel.app";

export const SITE_NAME = "Ταξίδι στη Μουσική";

export const SITE_DESCRIPTION =
  "Οι αληθινές, τεκμηριωμένες ιστορίες πίσω από ελληνικά έντεχνα και λαϊκά τραγούδια — μόνο από συνεντεύξεις, βιβλία και επίσημες πηγές.";
