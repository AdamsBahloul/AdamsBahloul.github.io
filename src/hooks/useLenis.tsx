import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../animations/gsapConfig';
import { configureScrollTrigger } from '../animations/scrollConfig';

const LenisContext = createContext<Lenis | null>(null);
/** Own one Lenis instance and keep its RAF loop and ScrollTrigger in sync. */
export function LenisProvider({ children }: PropsWithChildren) {
  const instance = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  useEffect(() => {
    configureScrollTrigger();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ autoRaf: false, smoothWheel: true, lerp: 0.08 });
    instance.current = lenis;
    setLenis(lenis);
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', ScrollTrigger.update);
    return () => { gsap.ticker.remove(update); lenis.destroy(); instance.current = null; setLenis(null); };
  }, []);
  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
export function useLenis() { return useContext(LenisContext); }
