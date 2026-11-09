import { gsap } from '../gsapConfig';

/** Reveal a collection with a short, ordered stagger and one trigger for the group. */
export function staggerIn(targets: gsap.TweenTarget, trigger?: Element) {
  return gsap.fromTo(targets, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: trigger ?? targets as gsap.DOMTarget, start: 'top 85%', once: true } });
}
