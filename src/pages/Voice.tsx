import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import UserCard from '@/components/UserCard';
import AnimatedBackground from '@/components/AnimatedBackground';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const socket = io("http://54.169.92.65:3000"); // your VPS IP

interface User {
  id: string;
  name: string;
  peer?: any;
  isConnected: boolean;
  isSpeaking: boolean;
}

const Voice = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userName, setUserName] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const userAudio = useRef<HTMLAudioElement>(null);
  const peerRefs = useRef<{ [key: string]: any }>({});
  const streamRef = useRef<MediaStream | null>(null);

  const roomId = "global-room";

  useEffect(() => {
    if (!hasJoined) return;

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      streamRef.current = stream;
      if (userAudio.current) userAudio.current.srcObject = stream;

      socket.emit("join-room", { roomId, userName });

      socket.on("all-users", (others) => {
        const newPeers = others.map((user: any) => {
          const peer = createPeer(user.id, socket.id, stream);
          peerRefs.current[user.id] = peer;
          return { id: user.id, name: user.name || user.id, peer, isConnected: true, isSpeaking: false };
        });
        setUsers([{ id: socket.id, name: userName, isConnected: true, isSpeaking: false }, ...newPeers]);
      });

      socket.on("user-joined", ({ id }) => {
        const peer = addPeer(id, stream);
        peerRefs.current[id] = peer;
        setUsers((prev) => [...prev, { id, name: id, peer, isConnected: true, isSpeaking: false }]);
      });

      socket.on("receiving-returned-signal", ({ signal, id }) => {
        const peer = peerRefs.current[id];
        peer?.signal(signal);
      });

      socket.on("user-left", (id) => {
        if (peerRefs.current[id]) {
          peerRefs.current[id].destroy();
          delete peerRefs.current[id];
        }
        setUsers((prev) => prev.filter((u) => u.id !== id));
      });
    }).catch(() => alert("Microphone access is required!"));

    return () => {
      socket.disconnect();
      Object.values(peerRefs.current).forEach((p) => p.destroy());
    };
  }, [hasJoined]);

  const createPeer = (userToSignal: string, callerID: string, stream: MediaStream) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (signal) => {
      socket.emit("sending-signal", { userToSignal, callerID, signal });
    });
    return peer;
  };

  const addPeer = (callerID: string, stream: MediaStream) => {
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (signal) => {
      socket.emit("returning-signal", { signal, callerID });
    });
    peer.on("stream", (stream: MediaStream) => {
      const audio = document.createElement("audio");
      audio.srcObject = stream;
      audio.autoplay = true;
      audio.play().catch(() => {});
    });
    return peer;
  };

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Enter Your Name</h1>
        <input
          className="p-2 text-black rounded mb-4"
          type="text"
          placeholder="Your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button
          className="bg-green-600 px-4 py-2 rounded"
          onClick={() => setHasJoined(true)}
          disabled={!userName}
        >
          Join Voice
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 p-6">
        <motion.div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-white text-3xl font-bold">Voice Room</h1>
            <p className="text-gray-300">{users.length} of 4 connected</p>
          </div>
          <Link to="/">
            <motion.button className="bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Leave Room
            </motion.button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {users.map((user) => (
            <UserCard
              key={user.id}
              name={user.name}
              isConnected={user.isConnected}
              isSpeaking={user.isSpeaking}
            />
          ))}
        </div>
      </div>

      <audio ref={userAudio} autoPlay muted />
    </div>
  );
};

export default Voice;
