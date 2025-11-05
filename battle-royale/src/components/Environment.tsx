import { useMemo } from 'react';
import { MeshStandardMaterial, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useGameStore } from '../store';

const floorMaterial = new MeshStandardMaterial({ color: '#0f172a', metalness: 0.2, roughness: 0.8 });
const zoneGlowMaterial = new MeshStandardMaterial({ color: '#38bdf8', emissive: '#0ea5e9', emissiveIntensity: 0.4, transparent: true, opacity: 0.2 });

export const Environment = () => {
  const zoneRadius = useGameStore((state) => state.zone.radius);
  const zoneCenter = useGameStore((state) => state.zone.center);
  const zoneGlowRef = useMemo(() => ({ current: null as THREE.Mesh | null }), []);
  const tempVector = useMemo(() => new Vector3(), []);

  useFrame(() => {
    const mesh = zoneGlowRef.current;
    if (!mesh) return;
    const scale = zoneRadius * 1.05;
    mesh.scale.set(scale, 1, scale);
    tempVector.set(zoneCenter[0], 0.02, zoneCenter[2]);
    mesh.position.copy(tempVector);
  });

  return (
    <group>
      <ambientLight intensity={0.3} color="#bfdbfe" />
      <hemisphereLight skyColor="#38bdf8" groundColor="#0f172a" intensity={0.6} />
      <directionalLight position={[25, 40, 15]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[500, 64]} />
        <primitive object={floorMaterial} attach="material" />
      </mesh>
      <mesh ref={zoneGlowRef as any} rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[1, 64]} />
        <primitive object={zoneGlowMaterial} attach="material" />
      </mesh>
      <Stars radius={300} depth={60} count={2000} factor={4} saturation={0} fade speed={0.6} />
    </group>
  );
};
