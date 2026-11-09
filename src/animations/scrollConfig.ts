import { ScrollTrigger } from './gsapConfig';

/** Shared defaults: markers stay off and refresh after layout-affecting asset loads. */
export function configureScrollTrigger() {
  ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }
}
