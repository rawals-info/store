// Removed legacy middleware that rewrote all non-/in paths.
// This caused Google to see duplicate URLs and treat some as soft-404/redirected pages.
// Canonical URLs will now be enforced via explicit redirects defined in `next.config.js`.