// src/VideoCall.tsx
import React, { useEffect, useState, useRef } from "react";
import Peer, { MediaConnection } from "peerjs";
import io, { Socket } from "socket.io-client";

const VideoCall: React.FC = () => {
  const [peerId, setPeerId] = useState<string>(""); // Store peerId as a string
  const [isCallInProgress, setIsCallInProgress] = useState<boolean>(false); // State to track call progress
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null); // Store remote stream
  const [localStream, setLocalStream] = useState<MediaStream | null>(null); // Store local stream
  const [targetId, setTargetId] = useState<string>(""); // Store target peer ID

  // Refs for video elements
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // Socket and Peer refs
  const socket = useRef<Socket>(io.connect("http://localhost:9000")).current;
  const peer = useRef<Peer | null>(null);

  // Set up the PeerJS connection
  useEffect(() => {
    peer.current = new Peer(undefined, {
      host: "localhost",
      port: 9000,
      path: "/myapp",
    });

    peer.current.on("open", (id: string) => {
      setPeerId(id);
      console.log("My peer ID is: " + id);
    });

    peer.current.on("call", (call: MediaConnection) => {
      // Answer incoming call
      if (localStream) {
        call.answer(localStream);
        call.on("stream", (stream: MediaStream) => {
          setRemoteStream(stream);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
          }
        });
      }
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing media devices:", err));

    return () => {
      // Clean up resources on unmount
      if (peer.current) peer.current.destroy();
      if (socket) socket.disconnect();
    };
  }, [localStream]);

  const startCall = () => {
    if (targetId && localStream) {
      setIsCallInProgress(true);
      const call = peer.current!.call(targetId, localStream);
      call.on("stream", (stream: MediaStream) => {
        setRemoteStream(stream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      });

      // Send the offer to the target user (you can handle signaling better in a real app)
      socket.emit("offer", {
        target: targetId,
        sdp: call.peerConnection.localDescription,
      });
    }
  };

  const handleAnswerCall = () => {
    if (localStream && peer.current) {
      setIsCallInProgress(true);
      socket.emit("answer", {
        target: targetId,
        sdp: peer.current.localDescription,
      });
    }
  };

  // Send ICE candidates
  const handleIceCandidate = (candidate: RTCIceCandidate) => {
    socket.emit("ice-candidate", {
      target: targetId,
      candidate: candidate,
    });
  };

  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
    }
    setIsCallInProgress(false);
  };

  return (
    <div>
      <h1>Video Call</h1>
      <div>
        <input
          type="text"
          placeholder="Enter target peer ID"
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
        />
        {!isCallInProgress ? (
          <button onClick={startCall}>Start Call</button>
        ) : (
          <button onClick={handleEndCall}>End Call</button>
        )}
      </div>
      <div>
        <h3>Local Video</h3>
        <video ref={localVideoRef} autoPlay muted width="300" height="200" />
        <h3>Remote Video</h3>
        <video ref={remoteVideoRef} autoPlay width="300" height="200" />
      </div>
    </div>
  );
};

export default VideoCall;
