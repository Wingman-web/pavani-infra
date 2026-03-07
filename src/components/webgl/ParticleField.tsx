"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function GoldParticles({ count = 3000 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const { positions, velocities, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread particles in a diamond-like distribution
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 4 + 0.5;
      const height = (Math.random() - 0.5) * 6;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3;

      vel[i * 3] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;

      sz[i] = Math.random() * 0.03 + 0.005;
    }
    return { positions: pos, velocities: vel, sizes: sz };
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    const geometry = points.current.geometry;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      posArray[i3] += velocities[i3] + Math.sin(time * 0.3 + i * 0.1) * 0.0005;
      posArray[i3 + 1] += velocities[i3 + 1] + Math.cos(time * 0.2 + i * 0.05) * 0.0003;
      posArray[i3 + 2] += velocities[i3 + 2];

      // Soft boundary — wrap particles
      if (Math.abs(posArray[i3]) > 5) posArray[i3] *= -0.95;
      if (Math.abs(posArray[i3 + 1]) > 4) posArray[i3 + 1] *= -0.95;
      if (Math.abs(posArray[i3 + 2]) > 3) posArray[i3 + 2] *= -0.95;
    }

    posAttr.needsUpdate = true;
    points.current.rotation.y = time * 0.02;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, sizes]);

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.025}
        color="#DFC063"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FloatingDiamond() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.y = time * 0.15;
    meshRef.current.rotation.z = Math.sin(time * 0.3) * 0.1;
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.15;
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[0.8, 0]} />
      <meshBasicMaterial
        color="#DFC063"
        wireframe
        transparent
        opacity={0.12}
      />
    </mesh>
  );
}

export default function ParticleField() {
  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.1} />
        <GoldParticles count={2500} />
        <FloatingDiamond />
      </Canvas>
    </div>
  );
}
