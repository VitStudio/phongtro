import React, { useEffect } from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import ProblemSection from '../components/landing/ProblemSection';
import SolutionSection from '../components/landing/SolutionSection';
import FeatureSection from '../components/landing/FeatureSection';
import PricingSection from '../components/landing/PricingSection';
import ProcessSection from '../components/landing/ProcessSection';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main style={{ background: 'var(--bg-color)', minHeight: '100vh', overflowX: 'hidden' }}>
      <LandingNavbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeatureSection />
      <PricingSection />
      <ProcessSection />
      <Footer />
    </main>
  );
};

export default LandingPage;
