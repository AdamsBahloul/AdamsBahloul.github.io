import { gsap } from '../gsapConfig';

/** Animate a wrapper's inset clip-path to uncover its image; preserve overflow clipping on the wrapper. */
export function imageReveal(wrapper: gsap.TweenTarget) {
  return gsap.fromTo(wrapper, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.inOut', scrollTrigger: { trigger: wrapper as gsap.DOMTarget, start: 'top 80%', once: true } });
}
