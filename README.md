# Ταξίδι στη Μουσική

Blog με τεκμηριωμένες ιστορίες πίσω από ελληνικά τραγούδια — Next.js + Tailwind.

## Ανάπτυξη τοπικά

```bash
npm install
npm run dev
```

## Δομή περιεχομένου

Κάθε τραγούδι είναι ένα JSON αρχείο στο `content/songs/`, με πεδία:

- `title`, `composer`, `lyricist`, `year`, `performer`
- `status`: `"verified"` ή `"needs-source"`
- `story`: πίνακας παραγράφων
- `quote`, `quoteAttribution`: το κεντρικό παράθεμα-πηγή
- `caveat`: σημείωση προσοχής (π.χ. ανεπιβεβαίωτος ισχυρισμός)
- `sources`: πίνακας `{ label, url }`
- `coverVideoUrl`: link στο cover του τραγουδιού (μόλις ηχογραφηθεί)

Για να προστεθεί νέο τραγούδι, αρκεί ένα νέο `.json` αρχείο σε αυτόν τον φάκελο — η αρχική σελίδα και η σελίδα τραγουδιού ενημερώνονται αυτόματα.

## Deploy

Το repo συνδέεται με Vercel — κάθε push στο `main` κάνει αυτόματο deploy.
