import React, { useEffect, useRef, useState } from 'react';
import * as blazeface from '@tensorflow-models/blazeface';
import * as tf from '@tensorflow/tfjs';
import './WebcamPage.css';

export default function WebcamPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [faceCount, setFaceCount] = useState(0);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch(() => {
        // ignore
      });
  }, []);

  useEffect(() => {
    const setupBackend = async () => {
      const success = await tf.setBackend('webgl');
      if (!success) {
        await tf.setBackend('cpu');
      }
      await tf.ready();
    };
    setupBackend();
  }, []);

  useEffect(() => {
    let animationId: number;
    let model: blazeface.BlazeFaceModel | null = null;

    const detect = async () => {
      if (!model || !videoRef.current || !canvasRef.current) {
        animationId = requestAnimationFrame(detect);
        return;
      }
      const faces = await model.estimateFaces(videoRef.current, false);
      setFaceCount(faces.length);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 2;
      faces.forEach((face) => {
        const [x1, y1] = face.topLeft as [number, number];
        const [x2, y2] = face.bottomRight as [number, number];
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      });
      animationId = requestAnimationFrame(detect);
    };

    blazeface.load().then((loaded) => {
      model = loaded;
      animationId = requestAnimationFrame(detect);
    });

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="webcam-page">
      <div className="webcam-container">
        <video ref={videoRef} className="webcam-video" playsInline />
        <canvas ref={canvasRef} className="webcam-canvas" />
        <div className="face-count">{faceCount}</div>
      </div>
    </div>
  );
}
