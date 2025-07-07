// src/VoiceChat.tsx
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://54.169.92.65:3000/"); // Replace with actual VPS IP or domain

const VoiceChat: React.FC = () => {
  const [peers, setPeers] = useState<any[]>([]);
  const userAudio = useRef<HTMLAudioElement>(null);
  const peerRefs = useRef<{ [key: string]: any }>({});
  const streamRef = useRef<MediaStream | null>(null);
  const roomId = "global-room"; // You can make dynamic later

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      streamRef.current = stream;
      userAudio.current!.srcObject = stream;

      socket.emit("join-room", { roomId, userName: socket.id });

      socket.on("all-users", (users) => {
        const peerList = users.map((user: any) => {
          const peer = createPeer(user.id, socket.id, stream);
          peerRefs.current[user.id] = peer;
          return { peer, id: user.id };
        });
        setPeers(peerList);
      });

      socket.on("user-joined", (payload) => {
        const peer = addPeer(payload.signal, payload.id, stream);
        peerRefs.current[payload.id] = peer;

        setPeers((prev) => [...prev, { peer, id: payload.id }]);
      });

      socket.on("receiving-returned-signal", (payload) => {
        const peer = peerRefs.current[payload.id];
        peer.signal(payload.signal);
      });

      socket.on("user-left", (id) => {
        if (peerRefs.current[id]) {
          peerRefs.current[id].destroy();
        }
        setPeers((prev) => prev.filter((p) => p.id !== id));
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  function createPeer(userToSignal: string, callerID: string, stream: MediaStream) {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (signal) => {
      socket.emit("sending-signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal: any, callerID: string, stream: MediaStream) {
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (signal) => {
      socket.emit("returning-signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  const toggleMute = () => {
    const audioTrack = streamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
    }
  };

  return (
    <div className="p-6 text-white bg-gradient-to-br from-purple-800 to-indigo-900 min-h-screen">
      <h1 className="text-3xl mb-4">Voice Room</h1>
      <button
        onClick={toggleMute}
        className="bg-pink-500 px-4 py-2 rounded hover:bg-pink-600 transition"
      >
        Toggle Mute
      </button>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <audio ref={userAudio} autoPlay muted />
        {peers.map(({ peer, id }) => (
          <AudioPeer key={id} peer={peer} />
        ))}
      </div>
    </div>
  );
};

const AudioPeer: React.FC<{ peer: any }> = ({ peer }) => {
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    peer.on("stream", (stream: MediaStream) => {
      ref.current!.srcObject = stream;
    });
  }, [peer]);

  return <audio ref={ref} autoPlay />;
};

export default VoiceChat;
