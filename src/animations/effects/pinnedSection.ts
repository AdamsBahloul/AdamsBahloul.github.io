import { gsap, ScrollTrigger } from '../gsapConfig';

/** Pin a section while its timeline plays; use sparingly and test the mobile/reduced-motion path. */
export function pinnedSection(trigger: Element, build: (timeline: gsap.core.Timeline) => void, end = '+=100%') {
  const timeline = gsap.timeline({ scrollTrigger: { trigger, start: 'top top', end, pin: true, scrub: 1, invalidateOnRefresh: true } });
  build(timeline);
  return timeline;
}

/** Expose ScrollTrigger for advanced feature-specific triggers without repeating imports. */
export { ScrollTrigger };
