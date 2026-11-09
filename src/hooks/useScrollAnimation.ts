import { useGSAP } from '../animations/gsapConfig';
import type { RefObject } from 'react';

/** Scope GSAP work to a component root so selectors stay local and cleanup is automatic. */
export function useScrollAnimation<T extends HTMLElement>(scope: RefObject<T | null>, callback: (element: T) => void | (() => void), dependencies: unknown[] = []) {
  return useGSAP(() => scope.current ? callback(scope.current) : undefined, { dependencies, scope });
}
