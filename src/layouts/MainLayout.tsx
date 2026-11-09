import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/navigation/Header/Header';
import Footer from '../components/navigation/Footer/Footer';
import PageTransition from '../components/navigation/PageTransition/PageTransition';
import SiteControls from '../components/navigation/SiteControls/SiteControls';

/** Shared site chrome; route content is rendered through the outlet. */
export default function MainLayout() {
  const { pathname } = useLocation();
  const workIndex = pathname === '/work';
  return <><a className="skip-link" href="#main-content">Skip to content</a><Header /><main id="main-content" className={workIndex ? 'work-index-main' : undefined} tabIndex={-1}><Outlet /></main>{!workIndex && <Footer />}<PageTransition /><SiteControls /></>;
}
