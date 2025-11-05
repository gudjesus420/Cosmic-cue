import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Vector3 } from 'three';
import { useGameStore } from './store';
import type { Vec3 } from './types';

const easeDamp = (current: number, target: number, lambda: number, delta: number) => {
  return current + (target - current) * (1 - Math.exp(-lambda * delta));
};

export const usePlayerCamera = () => {
  const cameraRef = useRef<PerspectiveCamera | null>(null);
  const { camera } = useThree();
  const position = useGameStore((state) => state.player.position);
  const aim = useGameStore((state) => state.player.aim);

  useEffect(() => {
    if (camera instanceof PerspectiveCamera) {
      cameraRef.current = camera;
    }
  }, [camera]);

  useFrame((_, delta) => {
    if (!cameraRef.current) return;
    const desiredPosition: Vec3 = [position[0] - aim[0] * 12, position[1] + 6, position[2] - aim[2] * 12];
    const desiredTarget = new Vector3(position[0], position[1], position[2]);

    cameraRef.current.position.set(
      easeDamp(cameraRef.current.position.x, desiredPosition[0], 4, delta),
      easeDamp(cameraRef.current.position.y, desiredPosition[1], 4, delta),
      easeDamp(cameraRef.current.position.z, desiredPosition[2], 4, delta),
    );

    cameraRef.current.lookAt(desiredTarget);
  });
};

export const useGameLoop = () => {
  const tick = useGameStore((state) => state.actions.tick);
  useFrame((_, delta) => {
    tick(delta);
  });
};
