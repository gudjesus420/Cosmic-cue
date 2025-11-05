import { memo } from 'react';
import { useGameStore } from '../store';
import { Enemy } from './Enemy';

export const Enemies = memo(() => {
  const enemies = useGameStore((state) => state.enemies);
  return (
    <group>
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} enemy={enemy} />
      ))}
    </group>
  );
});
