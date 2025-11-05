import { memo, useMemo } from 'react';
import { Color, MeshBasicMaterial, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store';

const smokeMaterialTemplate = new MeshBasicMaterial({ color: new Color('#f8fafc'), transparent: true, opacity: 0.35 });
const healMaterialTemplate = new MeshBasicMaterial({ color: new Color('#c084fc'), transparent: true, opacity: 0.5 });

export const Fields = memo(() => {
  const fields = useGameStore((state) => state.fields);
  const meshRefs = useMemo(() => new Map<string, THREE.Mesh>(), []);
  const tempVector = useMemo(() => new Vector3(), []);

  useFrame(() => {
    fields.forEach((field) => {
      const mesh = meshRefs.get(field.id);
      if (!mesh) return;
      const lifeProgress = field.age / field.ttl;
      const scale = 1 - lifeProgress * 0.4;
      mesh.scale.set(field.radius * scale, 1, field.radius * scale);
      const baseMaterial = mesh.material as MeshBasicMaterial;
      baseMaterial.opacity = (field.type === 'smoke' ? 0.35 : 0.5) * (1 - lifeProgress * 0.6);
      tempVector.set(field.position[0], 0.05, field.position[2]);
      mesh.position.copy(tempVector);
    });
  });

  return (
    <group>
      {fields.map((field) => (
        <mesh
          key={field.id}
          ref={(mesh) => {
            if (!mesh) {
              meshRefs.delete(field.id);
              return;
            }
            meshRefs.set(field.id, mesh);
            const material = field.type === 'smoke' ? smokeMaterialTemplate.clone() : healMaterialTemplate.clone();
            mesh.material = material;
          }}
          rotation-x={-Math.PI / 2}
          position={[field.position[0], 0.05, field.position[2]]}
        >
          <circleGeometry args={[1, 32]} />
        </mesh>
      ))}
    </group>
  );
});
