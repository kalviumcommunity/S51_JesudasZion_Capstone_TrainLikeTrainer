'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

/* ── Minimal Clean Wireframe Icosahedron ─────────────────────── */
function WireframeGeometrySphere() {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.25;
      meshRef.current.rotation.x = t * 0.15;
      meshRef.current.position.y = Math.sin(t * 0.6) * 0.1;
    }
  });

  return (
    <group>
      {/* Primary Pure Wireframe Icosahedron - matching user image reference */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.7, 1]} />
        <meshBasicMaterial
          color="#E5E5E5"
          wireframe
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

/* ── Scene Container ────────────────────────────────────────── */
export default function Hero3D({ className = '' }) {
  return (
    <div className={`w-full h-full ${className}`} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <WireframeGeometrySphere />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          dampingFactor={0.08}
          enableDamping
        />
      </Canvas>
    </div>
  );
}
