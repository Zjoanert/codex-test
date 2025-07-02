import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './TrainCabPage.css';

export default function TrainCabPage() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const loader = new THREE.CubeTextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.setPath(
      'https://raw.githubusercontent.com/mrdoob/three.js/r148/examples/textures/cube/Bridge2/'
    );
    const envMap = loader.load([
      'posx.jpg',
      'negx.jpg',
      'posy.jpg',
      'negy.jpg',
      'posz.jpg',
      'negz.jpg',
    ]);
    scene.background = envMap;
    scene.environment = envMap;

    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(10, 20, 10);
    dir.castShadow = true;
    dir.shadow.mapSize.set(2048, 2048);
    scene.add(dir);

    const groundGeo = new THREE.PlaneGeometry(200, 200);
    const texLoader = new THREE.TextureLoader();
    texLoader.setCrossOrigin('anonymous');
    const grassTex = texLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/r148/examples/textures/terrain/grasslight-big.jpg'
    );
    grassTex.wrapS = THREE.RepeatWrapping;
    grassTex.wrapT = THREE.RepeatWrapping;
    grassTex.repeat.set(40, 40);
    const groundMat = new THREE.MeshStandardMaterial({ map: grassTex });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
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
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x666666,
      metalness: 0.8,
      roughness: 0.3,
    });
    const leftRail = new THREE.Mesh(
      new THREE.TubeGeometry(leftCurve, 400, 0.07, 8, true),
      railMat
    );
    leftRail.castShadow = true;
    leftRail.receiveShadow = true;
    const rightRail = new THREE.Mesh(
      new THREE.TubeGeometry(rightCurve, 400, 0.07, 8, true),
      railMat
    );
    rightRail.castShadow = true;
    rightRail.receiveShadow = true;
    const leftRail2 = new THREE.Mesh(
      new THREE.TubeGeometry(leftCurve2, 400, 0.07, 8, true),
      railMat
    );
    leftRail2.castShadow = true;
    leftRail2.receiveShadow = true;
    const rightRail2 = new THREE.Mesh(
      new THREE.TubeGeometry(rightCurve2, 400, 0.07, 8, true),
      railMat
    );
    rightRail2.castShadow = true;
    rightRail2.receiveShadow = true;
    scene.add(leftRail);
    scene.add(rightRail);
    scene.add(leftRail2);
    scene.add(rightRail2);

    const sleeperMat = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      roughness: 0.8,
    });
    const sleeperGeo = new THREE.BoxGeometry(2 * offset, 0.15, 0.5);
    for (let i = 0; i < 200; i++) {
      const t = i / 200;
      const pos = baseCurve.getPointAt(t);
      const tangent = baseCurve.getTangentAt(t);
      const angle = Math.atan2(tangent.x, tangent.z);
      const sleeper = new THREE.Mesh(sleeperGeo, sleeperMat);
      sleeper.castShadow = true;
      sleeper.receiveShadow = true;
      sleeper.position.copy(pos);
      sleeper.rotation.y = angle;
      scene.add(sleeper);

      const pos2 = baseCurve2.getPointAt(t);
      const tangent2 = baseCurve2.getTangentAt(t);
      const angle2 = Math.atan2(tangent2.x, tangent2.z);
      const sleeper2 = new THREE.Mesh(sleeperGeo, sleeperMat);
      sleeper2.castShadow = true;
      sleeper2.receiveShadow = true;
      sleeper2.position.copy(pos2);
      sleeper2.rotation.y = angle2;
      scene.add(sleeper2);
    }

    const train = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 2),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    body.castShadow = true;
    body.receiveShadow = true;
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
    otherBody.castShadow = true;
    otherBody.receiveShadow = true;
    otherBody.position.set(0, 0.5, 0);
    otherTrain.add(otherBody);
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.2, 2),
      new THREE.MeshStandardMaterial({ color: 0x0000aa })
    );
    roof.castShadow = true;
    roof.receiveShadow = true;
    roof.position.set(0, 1.1, 0);
    otherTrain.add(roof);
    const windowGeo = new THREE.BoxGeometry(0.25, 0.25, 0.02);
    const windowMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.3 });
    [-0.5, 0, 0.5].forEach((z) => {
      const left = new THREE.Mesh(windowGeo, windowMat);
      left.castShadow = true;
      left.position.set(-0.51, 0.7, z);
      otherTrain.add(left);
      const right = new THREE.Mesh(windowGeo, windowMat);
      right.castShadow = true;
      right.position.set(0.51, 0.7, z);
      right.rotation.y = Math.PI;
      otherTrain.add(right);
    });
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

      const t2 = otherProgress % 1;
      const revT = 1 - t2;
      const pos2 = baseCurve2.getPointAt(revT);
      const tangent2 = baseCurve2.getTangentAt(revT).multiplyScalar(-1);
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
