# Project showcase

This section is appended below the home introduction and About section. Each local project image stays fixed in a pinned viewport. As scroll advances, the incoming project's local video forms two vertical panels that slide inward from the edges, carrying a negative/glitch treatment on the top layer. When the panels meet, the video is replaced by that project's still image. The same timeline reverses when scrolling upward. Project copy is centralized in `src/data/projects.ts`.

The reduced-motion layout presents the projects as a normal sequence of full-screen images without pinning or video-panel motion. Styles are scoped to this component so the existing home sections keep their own layout and animation rules.
