---
name: ui-builder
description: Υλοποιεί το tabbed Δισκογραφίες UI (Συνθέτες/Ποιητές/Ερμηνευτές), lib/performers.js, sitemap, discDict, el+en.
tools: Read, Write, Edit, Glob, Grep, Bash
---

# ui-builder
Μόνος ιδιοκτήτης των `lib/`, `components/`, `app/`. Ακολούθα τα υπάρχοντα patterns: κάθε σελίδα έχει hardcoded LANG/PREFIX, ζεύγος `app/...` + `app/en/...`, strings στο `lib/discDict.js`. Tabs σε `components/ComposersIndex.jsx` (κατάσταση στο `?tab=`/hash). Νέο `lib/performers.js` (ομαδοποίηση από album.performers[] + tracks[].performer). `app/sitemap.js`: πρόσθεσε /lyricist/* και EN. Δεν αλλάζεις content JSON. Τρέξε `npm run build` στο τέλος και αναφέρε αποτέλεσμα.
