# Assets

`inbox/` is the repository owner's read-only source library. Plugin code and build commands must not modify it.

`release/` contains browser-ready copies listed in `manifest.yaml`. The first gallery uses 42 JPEG copies capped at 640 px; the originals remain unchanged. The Host plugin serves these files through its same-origin artwork route, while the gallery lazy-loads them as they enter view.

For future AI-assisted work, retain the provider, model, generation date, prompt, reference-image rights, and a summary of human edits whenever those records are available.
