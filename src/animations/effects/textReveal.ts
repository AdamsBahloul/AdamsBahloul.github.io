import { gsap } from '../gsapConfig';

/** Reveal a whole text element on entry. Use authored line wrappers for line-by-line motion. */
export function textReveal(target: gsap.TweenTarget, trigger?: Element) {
  return gsap.fromTo(target, { autoAlpha: 0, yPercent: 35 }, { autoAlpha: 1, yPercent: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: trigger ?? target as gsap.DOMTarget, start: 'top 85%', once: true } });
}
