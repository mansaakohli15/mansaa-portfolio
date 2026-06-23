// src/components/RobotHead.jsx
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const MODEL_URL =
  "https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb";

const VIOLET = 0xa78bfa;
const VIOLET_DEEP = 0x6d28d9;
const CYAN = 0x67e8f9;
const CHROME = 0xe7e5ff;

export default function RobotHead() {
  const mountRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let w = mount.clientWidth;
    let h = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = null;

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 100);
    camera.position.set(0, 3.2, 10);
    camera.lookAt(0, 1.4, 0);

    scene.add(new THREE.HemisphereLight(0xc8b8ff, 0x0a0820, 0.45));

    const key = new THREE.DirectionalLight(0xffffff, 1.25);
    key.position.set(4, 7, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.radius = 8;
    key.shadow.bias = -0.0005;
    scene.add(key);

    const rimViolet = new THREE.PointLight(VIOLET, 22, 16, 2);
    rimViolet.position.set(-3.5, 2.8, 1.8);
    scene.add(rimViolet);

    const rimCyan = new THREE.PointLight(CYAN, 16, 16, 2);
    rimCyan.position.set(3.6, 2.2, 2.2);
    scene.add(rimCyan);

    const underGlow = new THREE.PointLight(VIOLET_DEEP, 10, 8, 2);
    underGlow.position.set(0, -0.5, 2);
    scene.add(underGlow);

    const podiumGroup = new THREE.Group();
    scene.add(podiumGroup);

    const podium = new THREE.Mesh(
      new THREE.CylinderGeometry(2.0, 2.2, 0.18, 64),
      new THREE.MeshPhysicalMaterial({
        color: 0x140b2e, metalness: 0.4, roughness: 0.15,
        transmission: 0.4, thickness: 0.6, clearcoat: 1, clearcoatRoughness: 0.1,
        emissive: VIOLET_DEEP, emissiveIntensity: 0.25,
      }),
    );
    podium.position.y = -0.09;
    podium.receiveShadow = true;
    podiumGroup.add(podium);

    const glowDisc = new THREE.Mesh(
      new THREE.CircleGeometry(1.85, 64),
      new THREE.MeshBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    glowDisc.rotation.x = -Math.PI / 2;
    glowDisc.position.y = 0.011;
    podiumGroup.add(glowDisc);

    const ringGeo = new THREE.RingGeometry(2.05, 2.12, 128);
    const ringMat = new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.7, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.02;
    podiumGroup.add(ring);

    const ring2 = new THREE.Mesh(
      new THREE.RingGeometry(2.25, 2.28, 128),
      new THREE.MeshBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.35, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.02;
    podiumGroup.add(ring2);

    const shadowGround = new THREE.Mesh(
      new THREE.CircleGeometry(6, 64),
      new THREE.ShadowMaterial({ opacity: 0.45 }),
    );
    shadowGround.rotation.x = -Math.PI / 2;
    shadowGround.position.y = -0.18;
    shadowGround.receiveShadow = true;
    scene.add(shadowGround);

    const particleCount = 90;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 2.2 + Math.random() * 2.5;
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.random() * 4;
      positions[i * 3 + 2] = Math.sin(a) * r;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: CYAN, size: 0.04, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false }));
    scene.add(particles);

    let mixer = null;
    let robot = null;
    let headBone = null;
    const clock = new THREE.Clock();

    new GLTFLoader().load(
      MODEL_URL,
      (gltf) => {
        robot = gltf.scene;
        robot.scale.setScalar(0.55);
        robot.position.set(0, 0, 0);

        robot.traverse((obj) => {
          if (obj.isMesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
            const mat = obj.material;
            if (mat && mat.color) {
              const c = new THREE.Color();
              c.copy(mat.color);
              const hsl = { h: 0, s: 0, l: 0 };
              c.getHSL(hsl);
              if (hsl.h > 0.08 && hsl.h < 0.18 && hsl.s > 0.3) {
                mat.color.setHex(CHROME); mat.metalness = 0.85; mat.roughness = 0.25;
              } else if (hsl.l < 0.35) {
                mat.color.setHex(VIOLET_DEEP); mat.metalness = 0.7; mat.roughness = 0.4;
              } else if (hsl.l < 0.2) {
                mat.color.setHex(CYAN);
                if ("emissive" in mat) { mat.emissive = new THREE.Color(CYAN); mat.emissiveIntensity = 1.5; }
              }
            }
            if (mat && "envMapIntensity" in mat) mat.envMapIntensity = 1.3;
          }
          if (obj.isBone && /head/i.test(obj.name)) headBone = obj;
        });

        scene.add(robot);
        mixer = new THREE.AnimationMixer(robot);
        const byName = Object.fromEntries(gltf.animations.map((c) => [c.name, c]));
        const idle = byName["Idle"] || gltf.animations[0];
        if (idle) mixer.clipAction(idle).play();

        const wave = byName["Wave"];
        if (wave) {
          const playWave = () => {
            const a = mixer.clipAction(wave);
            a.reset(); a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true;
            a.fadeIn(0.3).play();
            setTimeout(() => a.fadeOut(0.5), 2400);
            setTimeout(playWave, 10000 + Math.random() * 5000);
          };
          setTimeout(playWave, 3000);
        }
      },
      undefined,
      (err) => console.warn("Robot model failed to load", err),
    );

    const onMove = (e) => {
      const rect = mount.getBoundingClientRect();
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove);

    const onResize = () => {
      w = mount.clientWidth; h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    let raf = 0;
    const animate = () => {
      const dt = clock.getDelta();
      const t = clock.elapsedTime;

      if (mixer) mixer.update(dt);

      if (headBone) {
        const ty = pointer.current.x * 0.55;
        const tx = -pointer.current.y * 0.32;
        headBone.rotation.y += (ty - headBone.rotation.y) * 0.08;
        headBone.rotation.x += (tx - headBone.rotation.x) * 0.08;
      }

      if (robot) {
        robot.position.y = Math.sin(t * 1.2) * 0.05;
        robot.rotation.y = Math.sin(t * 0.35) * 0.1;
      }

      ring.rotation.z = t * 0.4;
      ring2.rotation.z = -t * 0.25;
      ringMat.opacity = 0.55 + Math.sin(t * 2) * 0.2;
      glowDisc.material.opacity = 0.2 + Math.sin(t * 1.6) * 0.05;

      const pos = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += 0.004;
        if (pos[i * 3 + 1] > 4) pos[i * 3 + 1] = 0;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y = t * 0.05;

      rimViolet.intensity = 20 + Math.sin(t * 1.1) * 4;
      rimCyan.intensity = 14 + Math.cos(t * 1.3) * 3;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.parentNode?.removeChild(renderer.domElement);
      scene.traverse((obj) => {
        if (obj.isMesh || obj.isPoints) {
          obj.geometry?.dispose?.();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material?.dispose?.();
        }
      });
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div aria-hidden className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(55% 50% at 50% 45%, rgba(167,139,250,0.25) 0%, rgba(103,232,249,0.10) 38%, rgba(10,8,26,0) 72%)", filter: "blur(6px)" }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-25"
        style={{ background: "repeating-linear-gradient(180deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 3px)" }} />
      <div ref={mountRef} className="relative w-full h-full" style={{ minHeight: 420 }} />
    </div>
  );
}