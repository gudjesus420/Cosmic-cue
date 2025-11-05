import { useMemo } from 'react';
import { MeshStandardMaterial } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store';
import type { EnemyState } from '../types';

const enemyMaterial = new MeshStandardMaterial({
  color: '#f97316',
  metalness: 0.3,
  roughness: 0.6,
});

interface EnemyProps {
  enemy: EnemyState;
}

export const Enemy = ({ enemy }: EnemyProps) => {
  const meshRef = useMemo(() => ({ current: null as THREE.Mesh | null }), []);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.position.set(enemy.position[0], enemy.position[1], enemy.position[2]);
  });

  return (
    <mesh ref={meshRef as any} castShadow>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <primitive object={enemyMaterial} attach="material" />
    </mesh>
  );
};
