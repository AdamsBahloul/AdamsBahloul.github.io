import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gsap, ScrollTrigger } from '../../../animations/gsapConfig';
import { useLenis } from '../../../hooks/useLenis';
import styles from './PageTransition.module.scss';

const pageTitles: Record<string, string> = {
  '/': 'HOME',
  '/work': 'WORK',
  '/about': 'ABOUT',
  '/contact': 'CONTACT',
  '/playground': 'PLAYGROUND',
};

function getPageTitle(pathname: string) {
  return pageTitles[pathname] ?? pathname.split('/').filter(Boolean).at(-1)?.replace(/-/g, ' ').toUpperCase() ?? 'HOME';
}

export default function PageTransition() {
  const navigate = useNavigate();
  const location = useLocation();
  const lenis = useLenis();
  const currentPath = useRef(location.pathname);
  const curtainRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const panelsRef = useRef<HTMLSpanElement[]>([]);
  const activeTimeline = useRef<gsap.core.Timeline | undefined>(undefined);
  const transitioning = useRef(false);
  const navigateRef = useRef(navigate);
  const lenisRef = useRef(lenis);
  currentPath.current = location.pathname;
  navigateRef.current = navigate;
  lenisRef.current = lenis;

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const origin = event.target;
      if (!(origin instanceof Element)) return;
      const anchor = origin.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
      if (anchor.hasAttribute('data-contact-modal')) {
        event.preventDefault();
        window.dispatchEvent(new Event('portfolio:open-contact'));
        return;
      }

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;

      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const scrollToDestination = () => {
        const sectionId = decodeURIComponent(destination.hash.slice(1));
        const target = sectionId ? document.getElementById(sectionId) : null;
        const headerOffset = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
        if (target && lenisRef.current) {
          lenisRef.current.scrollTo(target, {
            offset: -headerOffset,
            immediate: isReducedMotion,
            duration: isReducedMotion ? undefined : 1.15,
            easing: (progress) => 1 - (1 - progress) ** 4,
          });
        } else if (target) {
          const top = window.scrollY + target.getBoundingClientRect().top - headerOffset;
          window.scrollTo({ top, behavior: isReducedMotion ? 'auto' : 'smooth' });
        } else if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }
        requestAnimationFrame(() => ScrollTrigger.refresh());
      };

      if (destination.pathname === currentPath.current) {
        if (!destination.hash) return;
        const sectionId = decodeURIComponent(destination.hash.slice(1));
        if (!sectionId || !document.getElementById(sectionId)) return;
        event.preventDefault();
        if (window.location.hash !== destination.hash) window.history.pushState(null, '', destination.hash);
        scrollToDestination();
        return;
      }

      event.preventDefault();
      if (transitioning.current) return;

      const destinationHref = `${destination.pathname}${destination.search}${destination.hash}`;
      if (destination.pathname === '/') {
        navigateRef.current(destinationHref);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          scrollToDestination();
        }));
        return;
      }

      const curtain = curtainRef.current;
      const title = titleRef.current;
      if (!curtain || !title) {
        navigateRef.current(destinationHref);
        return;
      }

      if (isReducedMotion) {
        navigateRef.current(destinationHref);
        if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
        else window.scrollTo(0, 0);
        return;
      }

      transitioning.current = true;
      title.textContent = getPageTitle(destination.pathname);
      lenisRef.current?.stop();
      gsap.set(curtain, { autoAlpha: 1 });
      gsap.set(panelsRef.current, { yPercent: -105 });
      gsap.set(title, { autoAlpha: 0, y: 24 });

      activeTimeline.current?.kill();
      activeTimeline.current = gsap.timeline({
        onComplete: () => {
          transitioning.current = false;
          lenisRef.current?.start();
          activeTimeline.current = undefined;
        },
      })
        .to(panelsRef.current, {
          yPercent: 0,
          duration: 0.56,
          stagger: { each: 0.045, from: 'start' },
          ease: 'power3.inOut',
        })
        .to(title, { autoAlpha: 1, y: 0, duration: 0.34, ease: 'power3.out' }, '-=0.2')
        .call(() => {
          navigateRef.current(destinationHref);
          if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
          else window.scrollTo(0, 0);
          requestAnimationFrame(() => ScrollTrigger.refresh());
        })
        .to({}, { duration: 0.32 })
        .to(title, { autoAlpha: 0, y: -18, duration: 0.2, ease: 'power2.in' }, '>')
        .to(panelsRef.current, {
          yPercent: -105,
          duration: 0.58,
          stagger: { each: 0.04, from: 'start' },
          ease: 'power3.inOut',
        }, '<')
        .set(curtain, { autoAlpha: 0 });
    };

    document.addEventListener('click', onDocumentClick, true);
    return () => {
      document.removeEventListener('click', onDocumentClick, true);
      activeTimeline.current?.kill();
      activeTimeline.current = undefined;
      transitioning.current = false;
      lenisRef.current?.start();
    };
  }, []);

  return (
    <div ref={curtainRef} className={styles.curtain} aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => (
        <span
          className={styles.panel}
          key={index}
          ref={(element) => { if (element) panelsRef.current[index] = element; }}
          style={{ left: `${index * 12.5}%` }}
        />
      ))}
      <p ref={titleRef} className={styles.title} />
    </div>
  );
}
