import { gsap } from './gsapConfig';

/** Small reusable entrance timeline. Route-level transitions can build on this helper. */
export function createPageEntrance(target: gsap.TweenTarget) {
  return gsap.fromTo(target, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out', clearProps: 'all' });
}
