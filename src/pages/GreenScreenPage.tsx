import React, { useEffect, useRef } from 'react';
import * as bodyPix from '@tensorflow-models/body-pix';
import '@tensorflow/tfjs';
import './GreenScreenPage.css';

export default function GreenScreenPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    let animationId: number;
    let model: bodyPix.BodyPix | null = null;

    const process = async () => {
      if (!model || !videoRef.current || !canvasRef.current) {
        animationId = requestAnimationFrame(process);
        return;
      }
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) {
        animationId = requestAnimationFrame(process);
        return;
      }
      const segmentation = await model.segmentPerson(videoRef.current);
      const mask = bodyPix.toMask(segmentation, { r: 255, g: 255, b: 255, a: 0 }, { r: 0, g: 255, b: 0, a: 255 });
      bodyPix.drawMask(canvasRef.current, videoRef.current, mask, 1, 0, false);
      animationId = requestAnimationFrame(process);
    };

    bodyPix.load().then((loaded) => {
      model = loaded;
      process();
    });

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="green-screen-page">
      <div className="gs-container">
        <video ref={videoRef} className="hidden-video" playsInline />
        <canvas ref={canvasRef} className="gs-canvas" />
      </div>
    </div>
  );
}
