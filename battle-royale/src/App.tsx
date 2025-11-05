import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Player } from './components/Player';
import { Enemies } from './components/Enemies';
import { Zone } from './components/Zone';
import { Environment } from './components/Environment';
import { Projectiles } from './components/Projectiles';
import { Fields } from './components/Fields';
import { HUD } from './components/HUD';
import { MobileControls } from './components/MobileControls';
import { useGameStore } from './store';
import { useGameLoop, usePlayerCamera } from './hooks';
import './App.css';

const useKeyboardControls = () => {
  const applyInput = useGameStore((state) => state.actions.applyInput);
  const fireSmoke = useGameStore((state) => state.actions.fireSmokeBomb);
  const fireHeal = useGameStore((state) => state.actions.fireHealingJoint);

  useEffect(() => {
    const keysPressed = new Set<string>();

    const getMoveVector = () => {
      const forward = (keysPressed.has('KeyW') ? 1 : 0) - (keysPressed.has('KeyS') ? 1 : 0);
      const right = (keysPressed.has('KeyD') ? 1 : 0) - (keysPressed.has('KeyA') ? 1 : 0);
      return [right, 0, -forward] as const;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.add(event.code);
      if (event.code === 'Space') {
        fireSmoke();
      }
      if (event.code === 'KeyQ') {
        fireHeal();
      }
      applyInput({ move: getMoveVector() });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.delete(event.code);
      applyInput({ move: getMoveVector() });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [applyInput, fireSmoke, fireHeal]);
};

const usePointerAim = () => {
  const applyInput = useGameStore((state) => state.actions.applyInput);
  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      const element = event.target as HTMLElement;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const aim = [(x - 0.5) * 2, 0, (0.5 - y) * 2] as const;
      applyInput({ aim });
    };

    window.addEventListener('pointermove', handleMove);

    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, [applyInput]);
};

export const App = () => {
  const isDowned = useGameStore((state) => state.player.isDowned);
  const resetGame = useGameStore((state) => state.actions.resetGame);
  const playerRef = useRef<THREE.Mesh | null>(null);
  useKeyboardControls();
  usePointerAim();
  useGameLoop();
  usePlayerCamera();

  const canvasClass = useMemo(() => `game-canvas ${isDowned ? 'downed' : ''}`, [isDowned]);

  return (
    <div className="app">
      <Canvas className={canvasClass} shadows camera={{ position: [0, 12, 26], fov: 60 }}>
        <Suspense fallback={null}>
          <Environment />
          <Player ref={playerRef} />
          <Enemies />
          <Zone />
          <Projectiles />
          <Fields />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      </Canvas>
      <HUD />
      <MobileControls />
      {isDowned && (
        <div className="downed-overlay">
          <h1>You got smoked 💨</h1>
          <button type="button" onClick={resetGame}>
            Try again
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
