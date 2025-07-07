
import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { useState } from 'react';

interface UserCardProps {
  name: string;
  isConnected: boolean;
  isSpeaking?: boolean;
  avatar?: string;
}

const UserCard = ({ name, isConnected, isSpeaking = false, avatar }: UserCardProps) => {
  const [isMuted, setIsMuted] = useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <motion.div
      className={`relative bg-white/5 backdrop-blur-lg border rounded-2xl p-6 h-full transition-all duration-300 ${
        isSpeaking ? 'border-green-400 bg-green-400/10' : 'border-white/10'
      } ${isConnected ? 'opacity-100' : 'opacity-50'}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Speaking indicator */}
      {isSpeaking && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/20 to-blue-400/20"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}

      <div className="flex flex-col items-center space-y-4">
        {/* Avatar */}
        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
          isSpeaking 
            ? 'bg-gradient-to-br from-green-400 to-blue-400 text-white animate-pulse-glow' 
            : 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
        }`}>
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
          ) : (
            getInitials(name)
          )}
        </div>

        {/* Name */}
        <h3 className="font-space text-lg font-semibold text-white text-center">
          {name}
        </h3>

        {/* Connection status */}
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-400' : 'bg-red-400'
          }`} />
          <span className="text-sm text-gray-300">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Mic button */}
        {isConnected && (
          <motion.button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-full transition-all duration-300 ${
              isMuted 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default UserCard;
