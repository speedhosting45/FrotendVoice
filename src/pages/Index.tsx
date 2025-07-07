
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import AnimatedBackground from '@/components/AnimatedBackground';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <HeroSection />
        <AboutSection />
      </div>
    </div>
  );
};

export default Index;
