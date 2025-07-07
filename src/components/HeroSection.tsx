
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative px-4">
      <div className="text-center max-w-4xl mx-auto">
        <motion.h1 
          className="font-space text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Create Your{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Private Voice Server
          </span>
        </motion.h1>
        
        <motion.p 
          className="font-inter text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Fast, secure, and fun 4-person voice rooms. Perfect for friends, meetings, or hangouts.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <Link to="/voice">
            <motion.button
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-space font-semibold text-lg shadow-2xl shadow-purple-500/25 transition-all duration-300"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Mic className="w-6 h-6 group-hover:animate-pulse" />
              Create Voice Server
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
