import { forwardRef, useMemo } from 'react';
import { MeshStandardMaterial, Quaternion, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store';

const bodyMaterial = new MeshStandardMaterial({
  color: '#4ade80',
  metalness: 0.1,
  roughness: 0.6,
});

export const Player = forwardRef<THREE.Mesh>((_, ref) => {
  const position = useGameStore((state) => state.player.position);
  const aim = useGameStore((state) => state.player.aim);
  const [lookVector, quaternion] = useMemo(() => [new Vector3(), new Quaternion()], []);

  useFrame(() => {
    const mesh = (ref as React.MutableRefObject<THREE.Mesh | null>).current;
    if (!mesh) return;
    mesh.position.set(position[0], position[1], position[2]);
    lookVector.set(aim[0], 0, aim[2]).normalize();
    quaternion.setFromUnitVectors(new Vector3(0, 0, 1), lookVector);
    mesh.quaternion.slerp(quaternion, 0.25);
  });

  return (
    <mesh ref={ref} castShadow>
      <capsuleGeometry args={[0.8, 1.4, 8, 16]} />
      <primitive object={bodyMaterial} attach="material" />
    </mesh>
  );
});
