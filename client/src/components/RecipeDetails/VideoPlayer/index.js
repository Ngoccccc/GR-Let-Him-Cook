import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./VideoPlayer.css";
const VideoPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        preload: "auto",
      });

      playerRef.current.src({ src: videoUrl, type: "video/mp4" });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [videoUrl]);

  return (
    <div className="video-container">
      <div data-vjs-player>
        <video ref={videoRef} className="video-js vjs-default-skin" />
      </div>
    </div>
  );
};

export default VideoPlayer;
