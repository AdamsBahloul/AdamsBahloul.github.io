import { gsap } from '../gsapConfig';

/** Translate a track across its measured overflow while pinning its viewport. */
export function horizontalScroll(viewport: Element, track: HTMLElement) {
  const overflow = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
  return gsap.to(track, { x: () => -overflow(), ease: 'none', scrollTrigger: { trigger: viewport, start: 'top top', end: () => `+=${overflow()}`, pin: true, scrub: 1, invalidateOnRefresh: true } });
}
