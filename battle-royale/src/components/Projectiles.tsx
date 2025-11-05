import { memo, useMemo } from 'react';
import { Color, MeshStandardMaterial } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store';

const smokeMaterialTemplate = new MeshStandardMaterial({ color: new Color('#e2e8f0'), transparent: true, opacity: 0.6 });
const healMaterialTemplate = new MeshStandardMaterial({ color: new Color('#a855f7'), emissive: '#c084fc', emissiveIntensity: 0.9 });

export const Projectiles = memo(() => {
  const projectiles = useGameStore((state) => state.projectiles);
  const meshRefs = useMemo(() => new Map<string, THREE.Mesh>(), []);

  useFrame(() => {
    projectiles.forEach((projectile) => {
      const mesh = meshRefs.get(projectile.id);
      if (!mesh) return;
      mesh.position.set(projectile.position[0], projectile.position[1], projectile.position[2]);
    });
  });

  return (
    <group>
      {projectiles.map((projectile) => (
        <mesh
          key={projectile.id}
          ref={(mesh) => {
            if (!mesh) {
              meshRefs.delete(projectile.id);
              return;
            }
            meshRefs.set(projectile.id, mesh);
            const material =
              projectile.type === 'smoke' ? smokeMaterialTemplate.clone() : healMaterialTemplate.clone();
            mesh.material = material;
          }}
          position={[projectile.position[0], projectile.position[1], projectile.position[2]]}
          castShadow
        >
          <sphereGeometry args={[0.6, 16, 16]} />
        </mesh>
      ))}
    </group>
  );
});
