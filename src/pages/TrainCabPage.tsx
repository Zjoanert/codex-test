import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './TrainCabPage.css';

export default function TrainCabPage() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(10, 20, 10);
    scene.add(dir);

    const groundGeo = new THREE.PlaneGeometry(200, 200);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x228b22 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const radius = 50;
    const baseCurve = new THREE.CatmullRomCurve3(
      Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        return new THREE.Vector3(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        );
      }),
      true
    );

    const radius2 = 60;
    const baseCurve2 = new THREE.CatmullRomCurve3(
      Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        return new THREE.Vector3(
          Math.cos(angle) * radius2,
          0,
          Math.sin(angle) * radius2
        );
      }),
      true
    );

    const offset = 1;
    const up = new THREE.Vector3(0, 1, 0);
    const leftPts: THREE.Vector3[] = [];
    const rightPts: THREE.Vector3[] = [];
    const leftPts2: THREE.Vector3[] = [];
    const rightPts2: THREE.Vector3[] = [];
    for (let i = 0; i <= 200; i++) {
      const t = i / 200;
      const pos = baseCurve.getPointAt(t);
      const tangent = baseCurve.getTangentAt(t);
      const normal = new THREE.Vector3().crossVectors(up, tangent).normalize();
      leftPts.push(pos.clone().add(normal.clone().multiplyScalar(offset)));
      rightPts.push(pos.clone().add(normal.clone().multiplyScalar(-offset)));

      const pos2 = baseCurve2.getPointAt(t);
      const tangent2 = baseCurve2.getTangentAt(t);
      const normal2 = new THREE.Vector3().crossVectors(up, tangent2).normalize();
      leftPts2.push(pos2.clone().add(normal2.clone().multiplyScalar(offset)));
      rightPts2.push(pos2.clone().add(normal2.clone().multiplyScalar(-offset)));
    }

    const leftCurve = new THREE.CatmullRomCurve3(leftPts, true);
    const rightCurve = new THREE.CatmullRomCurve3(rightPts, true);
    const leftCurve2 = new THREE.CatmullRomCurve3(leftPts2, true);
    const rightCurve2 = new THREE.CatmullRomCurve3(rightPts2, true);
    const railMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const leftRail = new THREE.Mesh(
      new THREE.TubeGeometry(leftCurve, 400, 0.05, 8, true),
      railMat
    );
    const rightRail = new THREE.Mesh(
      new THREE.TubeGeometry(rightCurve, 400, 0.05, 8, true),
      railMat
    );
    const leftRail2 = new THREE.Mesh(
      new THREE.TubeGeometry(leftCurve2, 400, 0.05, 8, true),
      railMat
    );
    const rightRail2 = new THREE.Mesh(
      new THREE.TubeGeometry(rightCurve2, 400, 0.05, 8, true),
      railMat
    );
    scene.add(leftRail);
    scene.add(rightRail);
    scene.add(leftRail2);
    scene.add(rightRail2);

    const sleeperMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const sleeperGeo = new THREE.BoxGeometry(2 * offset, 0.1, 0.4);
    for (let i = 0; i < 200; i++) {
      const t = i / 200;
      const pos = baseCurve.getPointAt(t);
      const tangent = baseCurve.getTangentAt(t);
      const angle = Math.atan2(tangent.x, tangent.z);
      const sleeper = new THREE.Mesh(sleeperGeo, sleeperMat);
      sleeper.position.copy(pos);
      sleeper.rotation.y = angle;
      scene.add(sleeper);

      const pos2 = baseCurve2.getPointAt(t);
      const tangent2 = baseCurve2.getTangentAt(t);
      const angle2 = Math.atan2(tangent2.x, tangent2.z);
      const sleeper2 = new THREE.Mesh(sleeperGeo, sleeperMat);
      sleeper2.position.copy(pos2);
      sleeper2.rotation.y = angle2;
      scene.add(sleeper2);
    }

    const train = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 2),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    body.position.set(0, 0.5, 0);
    train.add(body);
    camera.position.set(0, 0.6, 0.8);
    train.add(camera);
    scene.add(train);

    const otherTrain = new THREE.Group();
    const otherBody = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 2),
      new THREE.MeshStandardMaterial({ color: 0x0000ff })
    );
    otherBody.position.set(0, 0.5, 0);
    otherTrain.add(otherBody);
    scene.add(otherTrain);

    let progress = 0;
    let otherProgress = 0;
    let frameId: number;

    const animate = () => {
      progress += 0.0005;
      otherProgress += 0.0005;
      const t = progress % 1;
      const pos = baseCurve.getPointAt(t);
      const tangent = baseCurve.getTangentAt(t);
      const angle = Math.atan2(tangent.x, tangent.z);
      train.position.copy(pos);
      train.rotation.y = angle;

      const t2 = 1 - (otherProgress % 1);
      const pos2 = baseCurve2.getPointAt(t2);
      const tangent2 = baseCurve2.getTangentAt(t2);
      const angle2 = Math.atan2(tangent2.x, tangent2.z);
      otherTrain.position.copy(pos2);
      otherTrain.rotation.y = angle2;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="cab-container" />;
}
