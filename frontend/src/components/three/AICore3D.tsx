import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Torus, Html } from '@react-three/drei';
import * as THREE from 'three';

function CoreMesh({ mouse }: { mouse: { x: number; y: number } }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.5;
      coreRef.current.rotation.x = THREE.MathUtils.lerp(coreRef.current.rotation.x, mouse.y * 0.4, 0.05);
      coreRef.current.rotation.y = THREE.MathUtils.lerp(coreRef.current.rotation.y, mouse.x * 0.4, 0.05);
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.6;
      ring1Ref.current.rotation.y += delta * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += delta * 0.4;
      ring2Ref.current.rotation.z += delta * 0.5;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += delta * 0.3;
      ring3Ref.current.rotation.z += delta * 0.7;
    }
  });

  return (
    <group>
      {/* Central Glowing AI Core */}
      <Sphere ref={coreRef} args={[1.2, 32, 32]}>
        <meshStandardMaterial
          color="#6366f1"
          emissive="#4f46e5"
          emissiveIntensity={1.8}
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
        />
      </Sphere>

      {/* Rotating Cybernetic Rings */}
      <Torus ref={ring1Ref} args={[1.8, 0.03, 16, 100]}>
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.2} />
      </Torus>
      <Torus ref={ring2Ref} args={[2.3, 0.03, 16, 100]}>
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1.0} />
      </Torus>
      <Torus ref={ring3Ref} args={[2.8, 0.02, 16, 100]}>
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
      </Torus>

      {/* Floating Labels with Connection Markers */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Html position={[2.5, 1.6, 0]} center>
          <div className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider font-semibold uppercase bg-primary/20 backdrop-blur-md border border-primary/40 text-indigo-300 shadow-glow pointer-events-none whitespace-nowrap animate-pulse">
            ◈ Code Analysis
          </div>
        </Html>
      </Float>

      <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.6}>
        <Html position={[-2.6, 1.2, 0]} center>
          <div className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider font-semibold uppercase bg-cyan-500/20 backdrop-blur-md border border-cyan-500/40 text-cyan-300 shadow-glow-cyan pointer-events-none whitespace-nowrap">
            ✦ Test Generation
          </div>
        </Html>
      </Float>

      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4}>
        <Html position={[2.4, -1.5, 0]} center>
          <div className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider font-semibold uppercase bg-rose-500/20 backdrop-blur-md border border-rose-500/40 text-rose-300 shadow-glow-rose pointer-events-none whitespace-nowrap">
            ⚠ Bug Detection
          </div>
        </Html>
      </Float>

      <Float speed={2.2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Html position={[-2.5, -1.4, 0]} center>
          <div className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider font-semibold uppercase bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 pointer-events-none whitespace-nowrap">
            ✓ AI Root Cause
          </div>
        </Html>
      </Float>
    </group>
  );
}

function ParticleField({ count = 80 }) {
  const points = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      coords[i * 3] = (Math.random() - 0.5) * 10;
      coords[i * 3 + 1] = (Math.random() - 0.5) * 10;
      coords[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return coords;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#818cf8" transparent opacity={0.6} />
    </points>
  );
}

export const AICore3D: React.FC<{ className?: string }> = ({ className }) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMouse({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (reducedMotion) {
    return (
      <div className={`relative flex items-center justify-center ${className || 'h-[400px]'}`}>
        <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-primary to-accent-cyan shadow-glow flex items-center justify-center border border-white/20">
          <span className="text-xl font-bold font-mono tracking-widest text-white">BUGLENS AI</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className || 'h-[460px]'}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#818cf8" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#06b6d4" />
        
        <CoreMesh mouse={mouse} />
        <ParticleField count={90} />
      </Canvas>
    </div>
  );
};
