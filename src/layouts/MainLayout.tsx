import { Outlet } from 'react-router-dom';
import Header from '../components/navigation/Header/Header';
import Footer from '../components/navigation/Footer/Footer';
import PageTransition from '../components/navigation/PageTransition/PageTransition';

/** Shared site chrome; route content is rendered through the outlet. */
export default function MainLayout() {
  return <><a className="skip-link" href="#main-content">Skip to content</a><Header /><main id="main-content" tabIndex={-1}><Outlet /></main><Footer /><PageTransition /></>;
}
