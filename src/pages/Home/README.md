# Home

The home section uses `biglogo.png` from `public/images` for the oversized wordmark. It scales down with a subtle fade while the header enters. The six Unsplash photos rise in a short stagger after the header settles. The clickable deck leads to `/work`; pointer hover and keyboard focus spread the deck, then restore its resting arrangement. Scrolling down sends the cards up and out in sequence. Returning to the top replays their bottom-up entrance. The location and time label stays fixed in the lower-right corner, with a white spacer before the About introduction.

The layered stock photographs are served directly from Unsplash:

- [Studio portrait](https://images.unsplash.com/photo-1712731855945-422bd7989c29)
- [Concrete architecture](https://unsplash.com/photos/grey-curved-concrete-structure-under-blue-sky-during-daytime-od-7tbERjWg)
- [Geometric facade](https://unsplash.com/photos/abstract-architecture-showcases-a-repeating-angular-pattern-MLIUd81AX1o)
- [Modern architecture and shadows](https://unsplash.com/photos/striking-modern-architecture-with-strong-lines-and-shadows-E04IKAUIKuM)
- [Symmetrical abstract architecture](https://unsplash.com/photos/abstract-architecture-against-a-dark-background-4NtZ0yU50lY)
- [Art deco building](https://unsplash.com/photos/architectural-photo-of-a-gray-building-v70Me0LlBTE)

The image source URLs and composition live in `Home.tsx`; page-only layout rules live in `Home.scss`.
