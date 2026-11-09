import { gsap } from '../gsapConfig';

/** Scrub a restrained vertical offset against the trigger's scroll progress. */
export function parallax(target: gsap.TweenTarget, distance = 60) {
  return gsap.to(target, { y: distance, ease: 'none', scrollTrigger: { trigger: target as gsap.DOMTarget, start: 'top bottom', end: 'bottom top', scrub: true } });
}
