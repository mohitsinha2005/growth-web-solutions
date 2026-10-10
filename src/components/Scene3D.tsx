import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Globe() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s, d) => {
    if (!ref.current) return;
    ref.current.rotation.y += d * 0.15;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, s.pointer.y * 0.3, 0.05);
  });
  return (
    <group ref={ref} position={[2.6, 0, -1]}>
      <mesh>
        <icosahedronGeometry args={[1.8, 3]} />
        <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.35} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.6, 48, 48]} />
        <meshStandardMaterial color="#0b1a33" emissive="#0e2a5c" metalness={0.6} roughness={0.3} />
      </mesh>
      <Float speed={2} floatIntensity={1}>
        <mesh rotation={[1.2, 0, 0]}>
          <torusGeometry args={[2.6, 0.015, 16, 120]} />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>
        <mesh rotation={[0.4, 0.8, 0]}>
          <torusGeometry args={[3.0, 0.01, 16, 120]} />
          <meshBasicMaterial color="#60a5fa" />
        </mesh>
      </Float>
    </group>
  );
}

function Stars() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const a = new Float32Array(2500 * 3);
    for (let i = 0; i < a.length; i++) a[i] = (Math.random() - 0.5) * 20;
    return a;
  }, []);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y -= d * 0.02; });
  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#7dd3fc" size={0.03} sizeAttenuation depthWrite={false} />
    </Points>
  );
}

export default function Scene3D() {
  return (
    <Canvas eventSource={typeof document !== "undefined" ? document.body : undefined} camera={{ position: [0, 0, 7], fov: 55 }} dpr={[1, 1.75]}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={40} color="#60a5fa" />
      <pointLight position={[-5, -3, 2]} intensity={20} color="#22d3ee" />
      <Stars />
      <Globe />
    </Canvas>
  );
}
