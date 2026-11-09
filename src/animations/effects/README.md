# Animation effects

- `textReveal`: entrance reveal for a text element; provide authored line spans for deliberate line-by-line animation.
- `imageReveal`: opens an image wrapper with a CSS clip-path reveal.
- `stagger`: reveals a group of elements in sequence.
- `parallax`: ties a restrained vertical offset to scroll progress.

Pinned sections, horizontal scroll and progress indicators are composed with GSAP/ScrollTrigger at the feature level as they need explicit, accessible markup and cleanup scope. All helpers return GSAP animations for the caller to own and revert through `useGSAP`.
