import { gsap } from '../gsapConfig';

/** Scale a progress indicator from left to right over the document's scroll range. */
export function scrollProgress(target: gsap.TweenTarget) {
  return gsap.fromTo(target, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: true } });
}
