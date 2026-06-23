import React, { Suspense, lazy } from 'react';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import CommandPalette from './components/CommandPalette';

// Lazy load non-critical sections for performance
const About = lazy(() => import('./components/About'));
const Services = lazy(() => import('./components/Services'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const FrameScrollAnimation = lazy(() => import('./components/FrameScrollAnimation'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <CommandPalette />

      <Suspense fallback={<div className="h-screen bg-black" />}>
        <FrameScrollAnimation />
        <About />
        <Portfolio />
        <Services />
        <Contact />
        <Footer />
      </Suspense>
    </>
  );
}

export default App;
