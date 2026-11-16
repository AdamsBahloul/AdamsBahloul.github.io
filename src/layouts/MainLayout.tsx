import { Suspense, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/navigation/Header/Header';
import Footer from '../components/navigation/Footer/Footer';
import PageTransition from '../components/navigation/PageTransition/PageTransition';
import SiteControls from '../components/navigation/SiteControls/SiteControls';
import LoadingScreen from '../components/navigation/LoadingScreen/LoadingScreen';
import CustomCursor from '../components/navigation/CustomCursor/CustomCursor';
import ContactCards from '../components/navigation/ContactCards/ContactCards';
import { useLenis } from '../hooks/useLenis';

/** Shared site chrome; route content is rendered through the outlet. */
export default function MainLayout() {
  const { pathname } = useLocation();
  const lenis = useLenis();
  const workIndex = pathname === '/work';
  const [contactOpen, setContactOpen] = useState(() => pathname === '/contact');
  useLayoutEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, lenis]);
  useEffect(() => {
    const open = () => setContactOpen(true);
    window.addEventListener('portfolio:open-contact', open);
    if (pathname === '/contact') setContactOpen(true);
    return () => {
      window.removeEventListener('portfolio:open-contact', open);
    };
  }, [pathname]);
  const closeContact = useCallback(() => setContactOpen(false), []);
  return <><a className="skip-link" href="#main-content">Skip to content</a><Header /><main id="main-content" className={workIndex ? 'work-index-main' : undefined} tabIndex={-1}><Suspense fallback={null}><Outlet /></Suspense></main>{!workIndex && <Footer />}<PageTransition /><SiteControls /><CustomCursor /><LoadingScreen />{contactOpen && <ContactCards onClose={closeContact} />}</>;
}
