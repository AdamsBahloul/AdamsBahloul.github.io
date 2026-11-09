import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { gsap, useGSAP } from '../../../animations/gsapConfig';
import { navigation } from '../../../data/navigation';
import { useLenis } from '../../../hooks/useLenis';
import Container from '../../common/Container/Container';
import IntroBio from '../../sections/IntroBio/IntroBio';
import styles from './Header.module.scss';

const HEADER_ENTRANCE_EVENT = 'portfolio:header-entrance-complete';
const HEADER_ENTRANCE_START_EVENT = 'portfolio:header-entrance-start';

function RollingLabel({ label }: { label: string }) {
  return <span className={styles.label} aria-hidden="true">
    {Array.from(label).map((character, index) => (
      <span className={styles.letterWindow} key={`${character}-${index}`}>
        <span className={styles.letterTrack} style={{ '--letter-index': index } as CSSProperties}>
          <span className={styles.letter}>{character}</span>
          <span className={styles.letter}>{character}</span>
        </span>
      </span>
    ))}
  </span>;
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [entranceComplete, setEntranceComplete] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const lenis = useLenis();
  const headerRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  const completeEntrance = () => {
    setEntranceComplete(true);
    document.documentElement.dataset.headerEntranceComplete = 'true';
    window.dispatchEvent(new Event(HEADER_ENTRANCE_EVENT));
  };

  useGSAP(() => {
    const header = headerRef.current;
    if (!header) return;

    const media = gsap.matchMedia(header);
    media.add('(prefers-reduced-motion: reduce)', () => {
      completeEntrance();
    });
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const logo = header.querySelector('[data-header-logo]');
      const navItems = Array.from(header.querySelectorAll<HTMLElement>('[data-header-nav-item]'));
      const menu = header.querySelector('[data-menu-toggle]');
      const isMobile = window.matchMedia('(max-width: 42rem)').matches;
      const visibleNavItems = isMobile ? [] : navItems;
      const entrants = [logo, ...visibleNavItems, menu].filter((element): element is Element => Boolean(element));

      gsap.set(entrants, { autoAlpha: 0 });
      if (logo) gsap.set(logo, { x: '-1.25rem', y: '-0.75rem', scale: 1, transformOrigin: 'top left' });
      visibleNavItems.forEach((item) => gsap.set(item, {
        x: '1.25rem',
        y: '-0.75rem',
        scale: 1,
        transformOrigin: 'top right',
      }));
      if (menu) gsap.set(menu, { x: '1.25rem', y: '-0.75rem', scale: 1, transformOrigin: 'top right' });

      const timeline = gsap.timeline({ onStart: () => window.dispatchEvent(new Event(HEADER_ENTRANCE_START_EVENT)), onComplete: completeEntrance });
      timeline.set(entrants, { autoAlpha: 1 }, 0);
      if (logo) timeline.to(logo, { x: 0, y: 0, duration: 0.72, ease: 'power3.out' }, 0);
      visibleNavItems.forEach((item, index) => timeline.to(item, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.72,
        ease: 'power3.out',
      }, 0.04 + index * 0.025));
      if (menu) timeline.to(menu, { x: 0, y: 0, scale: 1, duration: 0.72, ease: 'power3.out' }, 0.04);

      return () => timeline.kill();
    });

    return () => media.revert();
  }, { scope: headerRef, dependencies: [] });

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lenis?.stop();
    headerRef.current?.querySelector<HTMLElement>('[data-header-nav-item]')?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      menuToggleRef.current?.focus();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen, lenis]);

  const showMenu = () => setMenuOpen((open) => !open);

  return <header ref={headerRef} className={`${styles.header} ${menuOpen ? styles.menuIsOpen : ''}`}>
    <Container className={styles.inner}>
      <nav
        id="primary-navigation"
        className={`${styles.navigation} ${menuOpen ? styles.navigationOpen : ''}`}
        aria-label="Main navigation"
      >
        <ul className={styles.links}>
          {navigation.map((item, index) => <li key={item.href} style={{ '--menu-index': index } as CSSProperties}>
            <NavLink
              to={item.href}
              className={styles.link}
              aria-label={item.label}
              data-header-nav-item
              data-ui-sound
              onClick={() => setMenuOpen(false)}
            >
              <RollingLabel label={item.label} />
            </NavLink>
          </li>)}
        </ul>
      </nav>
      <button
        ref={menuToggleRef}
        className={`${styles.menuToggle} ${menuOpen ? styles.menuToggleOpen : ''}`}
        type="button"
        data-menu-toggle
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={showMenu}
      >
        {menuOpen ? 'CLOSE' : 'MENU'}
      </button>
      <div className={styles.identity}>
        <NavLink className={styles.brand} to="/" aria-label="Portfolio home" data-header-logo onClick={() => setMenuOpen(false)}>
          <img src="/images/Mainlogo.png" alt="Adam" width="3424" height="839" />
        </NavLink>
        {isHome && <IntroBio ready={entranceComplete} />}
      </div>
    </Container>
  </header>;
}
