import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store';
import type { Vec3 } from '../types';

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const vectorFromTouch = (rect: DOMRect, x: number, y: number, maxDistance: number): Vec3 => {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = clamp(x - centerX, -maxDistance, maxDistance);
  const dy = clamp(y - centerY, -maxDistance, maxDistance);
  return [dx / maxDistance, 0, -dy / maxDistance];
};

interface JoystickProps {
  id: string;
  onChange: (vec: Vec3) => void;
  onEnd: () => void;
}

const Joystick = ({ id, onChange, onEnd }: JoystickProps) => {
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);
  const maxDistance = 50;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchMove = (event: TouchEvent) => {
      const touch = Array.from(event.touches).find((t) => t.identifier === Number(id));
      if (!touch || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const vec = vectorFromTouch(rect, touch.clientX, touch.clientY, maxDistance);
      onChange(vec);
      if (handleRef.current) {
        handleRef.current.style.transform = `translate(${vec[0] * maxDistance}px, ${-vec[2] * maxDistance}px)`;
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const relevant = Array.from(event.changedTouches).some((t) => t.identifier === Number(id));
      if (!relevant) return;
      onEnd();
      setActive(false);
      if (handleRef.current) {
        handleRef.current.style.transform = 'translate(0px, 0px)';
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touch = Array.from(event.touches).find((t) => t.target === container);
      if (!touch) return;
      setActive(true);
    };

    container.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [containerRef, handleRef, id, onChange, onEnd]);

  return (
    <div
      ref={containerRef}
      className={`touch-joystick ${active ? 'active' : ''}`}
      role="region"
      aria-label="Virtual joystick"
      data-touch-id={id}
    >
      <div ref={handleRef} className="touch-handle" />
    </div>
  );
};

export const MobileControls = () => {
  const applyInput = useGameStore((state) => state.actions.applyInput);
  const fireSmoke = useGameStore((state) => state.actions.fireSmokeBomb);
  const fireHeal = useGameStore((state) => state.actions.fireHealingJoint);

  return (
    <div className="mobile-controls">
      <Joystick
        id="0"
        onChange={(move) => applyInput({ move })}
        onEnd={() => applyInput({ move: [0, 0, 0] })}
      />
      <Joystick
        id="1"
        onChange={(aim) => applyInput({ aim })}
        onEnd={() => applyInput({ aim: [0, 0, -1] })}
      />
      <div className="mobile-buttons">
        <button type="button" className="control-button smoke" onClick={fireSmoke}>
          Smoke
        </button>
        <button type="button" className="control-button heal" onClick={fireHeal}>
          Heal
        </button>
      </div>
    </div>
  );
};
