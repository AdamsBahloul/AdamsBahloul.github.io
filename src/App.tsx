import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home/Home';
import Work from './pages/Work/Work';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Playground from './pages/Playground/Playground';

// Routes stay declarative here; the shared shell lives in MainLayout.
export default function App() {
  return <Routes><Route element={<MainLayout />}>
    <Route index element={<Home />} />
    <Route path="work" element={<Work />} />
    <Route path="about" element={<About />} />
    <Route path="contact" element={<Contact />} />
    <Route path="playground" element={<Playground />} />
    <Route path="*" element={<Home />} />
  </Route></Routes>;
}
