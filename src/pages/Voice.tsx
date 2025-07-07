
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import UserCard from '@/components/UserCard';
import AnimatedBackground from '@/components/AnimatedBackground';

interface User {
  id: string;
  name: string;
  isConnected: boolean;
  isSpeaking: boolean;
}

const Voice = () => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'You', isConnected: true, isSpeaking: false },
    { id: '2', name: 'Alex Johnson', isConnected: true, isSpeaking: true },
    { id: '3', name: 'Sarah Wilson', isConnected: true, isSpeaking: false },
    { id: '4', name: 'Mike Chen', isConnected: false, isSpeaking: false }
  ]);

  // Simulate speaking activity
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers(prev => prev.map(user => ({
        ...user,
        isSpeaking: user.isConnected ? Math.random() > 0.8 : false
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="font-space text-3xl md:text-4xl font-bold text-white mb-2">
              Voice Room
            </h1>
            <p className="font-inter text-gray-300">
              {users.filter(u => u.isConnected).length} of 4 connected
            </p>
          </div>
          
          <Link to="/">
            <motion.button
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-space font-semibold transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-5 h-5" />
              Leave Room
            </motion.button>
          </Link>
        </motion.div>

        {/* User Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {users.map((user) => (
            <motion.div
              key={user.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="h-80"
            >
              <UserCard
                name={user.name}
                isConnected={user.isConnected}
                isSpeaking={user.isSpeaking}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Room Info */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 max-w-md mx-auto">
            <h3 className="font-space text-lg font-semibold text-white mb-2">
              Room Status
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Connected Users:</span>
                <span>{users.filter(u => u.isConnected).length}/4</span>
              </div>
              <div className="flex justify-between">
                <span>Currently Speaking:</span>
                <span>{users.filter(u => u.isSpeaking).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Connection:</span>
                <span className="text-green-400">WebRTC P2P</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Voice;
