import { useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Slider from '@radix-ui/react-slider';
import * as Toast from '@radix-ui/react-toast';
import { useGameStore } from '../store';

const formatNumber = (value: number) => Math.round(value);

export const HUD = () => {
  const health = useGameStore((state) => state.player.health);
  const maxHealth = useGameStore((state) => state.player.maxHealth);
  const stamina = useGameStore((state) => state.player.stamina);
  const maxStamina = useGameStore((state) => state.player.maxStamina);
  const smokeBombs = useGameStore((state) => state.player.inventory.smokeBombs);
  const healingJoints = useGameStore((state) => state.player.inventory.healingJoints);
  const zoneRadius = useGameStore((state) => state.zone.radius);
  const wave = useGameStore((state) => state.meta.wave);
  const notifications = useGameStore((state) => state.meta.notifications);
  const enemiesRemaining = useGameStore((state) => state.enemies.length);
  const resetGame = useGameStore((state) => state.actions.resetGame);
  const settings = useGameStore((state) => state.settings);
  const updateSettings = useGameStore((state) => state.actions.applyInput);

  const healthPercent = useMemo(() => (health / maxHealth) * 100, [health, maxHealth]);
  const staminaPercent = useMemo(() => (stamina / maxStamina) * 100, [stamina, maxStamina]);

  return (
    <div className="hud">
      <div className="hud-bar">
        <label htmlFor="health">Health</label>
        <div className="hud-progress">
          <div className="hud-progress-value" style={{ width: `${healthPercent}%` }}>
            {formatNumber(health)}
          </div>
        </div>
      </div>
      <div className="hud-bar">
        <label htmlFor="stamina">Stamina</label>
        <div className="hud-progress stamina">
          <div className="hud-progress-value" style={{ width: `${staminaPercent}%` }}>
            {formatNumber(stamina)}
          </div>
        </div>
      </div>
      <div className="hud-inventory">
        <span>Smoke: {smokeBombs}</span>
        <span>Heal: {healingJoints}</span>
      </div>
      <div className="hud-meta">
        <span>Zone radius: {formatNumber(zoneRadius)}</span>
        <span>Wave: {wave}</span>
        <span>Enemies: {enemiesRemaining}</span>
      </div>
      <Dialog.Root>
        <Dialog.Trigger className="hud-settings">Settings ⚙️</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="hud-modal-overlay" />
          <Dialog.Content className="hud-modal">
            <Dialog.Title>Game Settings</Dialog.Title>
            <fieldset>
              <label>Enemy count</label>
              <Slider.Root className="slider" defaultValue={[settings.enemyCount]} max={20} step={1}>
                <Slider.Track className="slider-track">
                  <Slider.Range className="slider-range" />
                </Slider.Track>
                <Slider.Thumb className="slider-thumb" aria-label="Enemy count" />
              </Slider.Root>
            </fieldset>
            <button type="button" className="control-button" onClick={resetGame}>
              Restart
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Toast.Provider swipeDirection="right">
        <div className="hud-toasts">
          {notifications.map((notification) => (
            <Toast.Root key={notification} className="hud-toast">
              <Toast.Title>{notification}</Toast.Title>
            </Toast.Root>
          ))}
        </div>
        <Toast.Viewport className="hud-toast-viewport" />
      </Toast.Provider>
    </div>
  );
};
