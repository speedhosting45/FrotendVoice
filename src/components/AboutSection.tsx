
import { motion } from 'framer-motion';
import { Users, Lock, Zap } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: Users,
      title: "Connect with up to 4 people",
      description: "Small, intimate voice rooms for quality conversations"
    },
    {
      icon: Lock, 
      title: "Private and secure voice chat",
      description: "Your conversations stay between you and your friends"
    },
    {
      icon: Zap,
      title: "Runs peer-to-peer using WebRTC",
      description: "Lightning-fast, direct connections with minimal latency"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-space text-4xl md:text-5xl font-bold text-white mb-4">
            What is this?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full" />
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 h-full hover:bg-white/10 transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4 group-hover:animate-pulse-glow">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <h3 className="font-space text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="font-inter text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
