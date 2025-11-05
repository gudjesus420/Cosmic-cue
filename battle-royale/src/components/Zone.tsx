import { useMemo } from 'react';
import { DoubleSide, MeshBasicMaterial } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store';

const zoneMaterial = new MeshBasicMaterial({ color: '#22d3ee', wireframe: true, transparent: true, opacity: 0.4, side: DoubleSide });

export const Zone = () => {
  const zone = useGameStore((state) => state.zone);
  const meshRef = useMemo(() => ({ current: null as THREE.Mesh | null }), []);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.scale.set(zone.radius, 1, zone.radius);
  });

  return (
    <mesh ref={meshRef as any} rotation-x={-Math.PI / 2} position={[zone.center[0], 0.01, zone.center[2]]} receiveShadow>
      <circleGeometry args={[1, 64]} />
      <primitive object={zoneMaterial} attach="material" />
    </mesh>
  );
};
