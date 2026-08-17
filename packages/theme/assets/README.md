# Assets

`../../../assets/inbox/` is the repository owner's read-only source library. Plugin code and build commands must not modify it.

`release/` contains browser-ready copies listed in `manifest.yaml`. The gallery has 41 source-resolution JPEG copies at quality 80 plus one native 3840×2160 conversation wallpaper at quality 92; the originals remain unchanged. The Host plugin serves these files through its same-origin artwork route, while the gallery lazy-loads them as they enter view. Full-canvas sharpness still depends on each original's pixel dimensions.

For future AI-assisted work, retain the provider, model, generation date, prompt, reference-image rights, and a summary of human edits whenever those records are available.
