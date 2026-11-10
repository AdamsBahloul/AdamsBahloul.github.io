import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

const Home = lazy(() => import('./pages/Home/Home'));
const Work = lazy(() => import('./pages/Work/Work'));
const ProjectDetail = lazy(() => import('./pages/Work/ProjectDetail'));
const About = lazy(() => import('./pages/About/About'));
const Playground = lazy(() => import('./pages/Playground/Playground'));

// Routes stay declarative here; the shared shell lives in MainLayout.
export default function App() {
  return <Routes><Route element={<MainLayout />}>
    <Route index element={<Home />} />
    <Route path="work" element={<Work />} />
    <Route path="work/:slug" element={<ProjectDetail />} />
    <Route path="about" element={<About />} />
    <Route path="contact" element={<Home />} />
    <Route path="playground" element={<Playground />} />
    <Route path="*" element={<Home />} />
  </Route></Routes>;
}
