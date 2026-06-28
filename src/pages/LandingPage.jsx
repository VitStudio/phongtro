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
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      <LandingNavbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeatureSection />
      <PricingSection />
      <ProcessSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
