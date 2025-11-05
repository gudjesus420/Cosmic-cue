import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type {
  EnemyState,
  FieldState,
  GameActions,
  GameSettings,
  GameState,
  InputState,
  PlayerState,
  ProjectileState,
  Vec3,
  ZoneState,
} from './types';

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const normalize = (vec: Vec3): Vec3 => {
  const length = Math.hypot(vec[0], vec[1], vec[2]);
  if (length === 0) return [0, 0, 0];
  return [vec[0] / length, vec[1] / length, vec[2] / length];
};

const scale = (vec: Vec3, scalar: number): Vec3 => [vec[0] * scalar, vec[1] * scalar, vec[2] * scalar];
const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

const INITIAL_SETTINGS: GameSettings = {
  enemyCount: 8,
  zoneShrinkInterval: 20,
  zoneShrinkAmount: 12,
};

const INITIAL_PLAYER = (position: Vec3): PlayerState => ({
  position,
  velocity: [0, 0, 0],
  aim: [0, 0, -1],
  health: 100,
  maxHealth: 100,
  stamina: 100,
  maxStamina: 100,
  inventory: {
    smokeBombs: 5,
    healingJoints: 3,
  },
  isDowned: false,
});

const INITIAL_ZONE: ZoneState = {
  center: [0, 0, 0],
  radius: 90,
  shrinkRate: INITIAL_SETTINGS.zoneShrinkAmount,
  minRadius: 18,
};

const INITIAL_INPUT: InputState = {
  move: [0, 0, 0],
  aim: [0, 0, -1],
  firing: false,
};

const INITIAL_META = {
  isPaused: false,
  elapsedTime: 0,
  wave: 1,
  notifications: [] as string[],
};

const randomInCircle = (radius: number): Vec3 => {
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.sqrt(Math.random()) * radius;
  return [Math.cos(angle) * distance, 0, Math.sin(angle) * distance];
};

const spawnEnemies = (count: number): EnemyState[] => {
  return Array.from({ length: count }, () => {
    const position = randomInCircle(60 + Math.random() * 25);
    return {
      id: nanoid(),
      position,
      velocity: [0, 0, 0],
      health: 80,
      maxHealth: 80,
      state: 'searching',
      targetLostTimer: 0,
    } as EnemyState;
  });
};

const integrate = (position: Vec3, velocity: Vec3, delta: number): Vec3 => {
  return [position[0] + velocity[0] * delta, position[1] + velocity[1] * delta, position[2] + velocity[2] * delta];
};

const distance = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

const createField = (type: FieldState['type'], position: Vec3): FieldState => ({
  id: nanoid(),
  type,
  position,
  radius: type === 'smoke' ? 12 : 8,
  age: 0,
  ttl: type === 'smoke' ? 12 : 6,
});

const createProjectile = (type: ProjectileState['type'], position: Vec3, direction: Vec3): ProjectileState => ({
  id: nanoid(),
  type,
  position,
  direction: normalize(direction),
  speed: type === 'smoke' ? 26 : 18,
  age: 0,
  ttl: 5,
});

const DECELERATION = 10;
const PLAYER_SPEED = 22;
const ENEMY_SPEED = 11;
const FIRE_COOLDOWN = 0.6;
const ZONE_TICK = 1;

interface InternalState {
  fireCooldown: number;
  zoneTimer: number;
}

const initialInternalState: InternalState = {
  fireCooldown: 0,
  zoneTimer: INITIAL_SETTINGS.zoneShrinkInterval,
};

export const useGameStore = create(
  subscribeWithSelector<GameState & InternalState & { resetInternal: () => void }>((set, get) => ({
    player: INITIAL_PLAYER([0, 2, 20]),
    enemies: spawnEnemies(INITIAL_SETTINGS.enemyCount),
    projectiles: [],
    fields: [],
    zone: INITIAL_ZONE,
    settings: INITIAL_SETTINGS,
    input: INITIAL_INPUT,
    meta: INITIAL_META,
    fireCooldown: initialInternalState.fireCooldown,
    zoneTimer: initialInternalState.zoneTimer,
    resetInternal: () => set({
      fireCooldown: initialInternalState.fireCooldown,
      zoneTimer: INITIAL_SETTINGS.zoneShrinkInterval,
    }),
    actions: {
      applyInput(partial) {
        set(({ input }) => ({
          input: {
            ...input,
            ...partial,
            move: partial.move ? normalize(partial.move) : input.move,
            aim: partial.aim ? normalize(partial.aim) : input.aim,
          },
        }));
      },
      fireSmokeBomb() {
        const state = get();
        if (state.player.inventory.smokeBombs <= 0 || state.fireCooldown > 0) return;
        const projectile = createProjectile('smoke', state.player.position, state.player.aim);
        set(({ projectiles, player }) => ({
          projectiles: [...projectiles, projectile],
          player: {
            ...player,
            inventory: {
              ...player.inventory,
              smokeBombs: player.inventory.smokeBombs - 1,
            },
          },
          fireCooldown: FIRE_COOLDOWN,
        }));
        get().actions.spawnNotification('Smoke bomb deployed 🌫️');
      },
      fireHealingJoint() {
        const state = get();
        if (state.player.inventory.healingJoints <= 0 || state.fireCooldown > 0) return;
        const projectile = createProjectile('heal', state.player.position, state.player.aim);
        set(({ projectiles, player }) => ({
          projectiles: [...projectiles, projectile],
          player: {
            ...player,
            inventory: {
              ...player.inventory,
              healingJoints: player.inventory.healingJoints - 1,
            },
          },
          fireCooldown: FIRE_COOLDOWN,
        }));
        get().actions.spawnNotification('Healing joint ignited ✨');
      },
      damagePlayer(amount) {
        set(({ player }) => {
          const health = clamp(player.health - amount, 0, player.maxHealth);
          return {
            player: {
              ...player,
              health,
              isDowned: health <= 0,
            },
          };
        });
      },
      healPlayer(amount) {
        set(({ player }) => ({
          player: {
            ...player,
            health: clamp(player.health + amount, 0, player.maxHealth),
          },
        }));
      },
      damageEnemy(id, amount) {
        set(({ enemies }) => {
          return {
            enemies: enemies
              .map((enemy) => {
                if (enemy.id !== id) return enemy;
                const health = clamp(enemy.health - amount, 0, enemy.maxHealth);
                return {
                  ...enemy,
                  health,
                };
              })
              .filter((enemy) => enemy.health > 0),
          };
        });
      },
      spawnNotification(message) {
        set(({ meta }) => ({
          meta: {
            ...meta,
            notifications: [...meta.notifications, message].slice(-4),
          },
        }));
      },
      tick(delta) {
        const state = get();
        if (state.meta.isPaused || state.player.isDowned) return;

        const updates: Partial<GameState & InternalState> = {};
        if (state.fireCooldown > 0) {
          updates.fireCooldown = Math.max(0, state.fireCooldown - delta);
        }

        set((current) => {
          const { player, input } = current;

          const desiredVelocity = scale(input.move, PLAYER_SPEED);
          const velocityDiff: Vec3 = [
            desiredVelocity[0] - player.velocity[0],
            desiredVelocity[1] - player.velocity[1],
            desiredVelocity[2] - player.velocity[2],
          ];

          const newVelocity: Vec3 = [
            player.velocity[0] + velocityDiff[0] * Math.min(1, delta * DECELERATION),
            player.velocity[1] + velocityDiff[1] * Math.min(1, delta * DECELERATION),
            player.velocity[2] + velocityDiff[2] * Math.min(1, delta * DECELERATION),
          ];

          const newPosition = integrate(player.position, newVelocity, delta);
          const centerDistance = distance(newPosition, current.zone.center);
          let adjustedPosition = newPosition;
          if (centerDistance > current.zone.radius) {
            const directionFromCenter = normalize([
              newPosition[0] - current.zone.center[0],
              newPosition[1] - current.zone.center[1],
              newPosition[2] - current.zone.center[2],
            ]);
            adjustedPosition = add(current.zone.center, scale(directionFromCenter, current.zone.radius));
            current.actions.damagePlayer(12 * delta);
          }

          const stamina = clamp(
            current.player.stamina + (input.move[0] || input.move[1] || input.move[2] ? -20 : 10) * delta,
            0,
            current.player.maxStamina,
          );
          const staminaFactor = stamina > 20 ? 1 : stamina / 20;

          return {
            ...updates,
            player: {
              ...player,
              position: adjustedPosition,
              velocity: scale(newVelocity, staminaFactor),
              aim: input.aim,
              stamina,
            },
          };
        });

        // Update enemies and other systems outside inner set to prevent stale state
        const { enemies, zone } = get();
        const playerPosition = state.player.position;
        const updatedEnemies = enemies.map((enemy) => {
          const toPlayer = [
            playerPosition[0] - enemy.position[0],
            playerPosition[1] - enemy.position[1],
            playerPosition[2] - enemy.position[2],
          ] as Vec3;
          const distToPlayer = Math.hypot(toPlayer[0], toPlayer[1], toPlayer[2]);

          let newState = enemy.state;
          let newVelocity: Vec3 = enemy.velocity;

          if (distToPlayer < 60) {
            newState = 'chasing';
            const direction = normalize(toPlayer);
            newVelocity = scale(direction, ENEMY_SPEED);
          } else {
            newState = 'searching';
            newVelocity = scale(normalize([Math.sin(state.meta.elapsedTime + enemy.id.length), 0, Math.cos(enemy.id.length)]), 4);
          }

          let adjustedPosition = integrate(enemy.position, newVelocity, delta);
          const distToCenter = distance(adjustedPosition, zone.center);
          if (distToCenter > zone.radius) {
            const directionFromCenter = normalize([
              adjustedPosition[0] - zone.center[0],
              adjustedPosition[1] - zone.center[1],
              adjustedPosition[2] - zone.center[2],
            ]);
            adjustedPosition = add(zone.center, scale(directionFromCenter, zone.radius - 1));
          }

          return {
            ...enemy,
            state: newState,
            velocity: newVelocity,
            position: adjustedPosition,
            targetLostTimer: newState === 'chasing' ? 0 : enemy.targetLostTimer + delta,
          };
        });

        set({ enemies: updatedEnemies });

        const now = get();
        const updatedProjectiles = now.projectiles
          .map((projectile) => {
            const newPosition = integrate(projectile.position, scale(projectile.direction, projectile.speed), delta);
            const age = projectile.age + delta;
            if (age >= projectile.ttl) {
              return null;
            }
            return {
              ...projectile,
              position: newPosition,
              age,
            };
          })
          .filter((projectile): projectile is ProjectileState => projectile !== null);

        const newFields: FieldState[] = [];
        updatedProjectiles.forEach((projectile) => {
          const distToPlayer = distance(projectile.position, now.player.position);
          if (distToPlayer < 3) {
            if (projectile.type === 'heal') {
              now.actions.healPlayer(20);
              newFields.push(createField('heal', projectile.position));
              now.actions.spawnNotification('Healing vibes ✅');
            } else {
              newFields.push(createField('smoke', projectile.position));
              now.actions.spawnNotification('Smoke screen active 🌫️');
            }
          }
        });

        const fields = [...now.fields, ...newFields]
          .map((field) => ({
            ...field,
            age: field.age + delta,
          }))
          .filter((field) => field.age < field.ttl);

        set({
          projectiles: updatedProjectiles.filter((projectile) => distance(projectile.position, now.player.position) >= 3),
          fields,
        });

        const { zoneTimer } = get();
        const newZoneTimer = zoneTimer - delta;
        if (newZoneTimer <= 0 && zone.radius > zone.minRadius) {
          set(({ zone }) => ({
            zone: {
              ...zone,
              radius: Math.max(zone.minRadius, zone.radius - zone.shrinkRate),
            },
            zoneTimer: INITIAL_SETTINGS.zoneShrinkInterval,
          }));
          get().actions.spawnNotification('Zone shrinking! ⚠️');
        } else {
          set({ zoneTimer: newZoneTimer });
        }

        set(({ meta }) => ({
          meta: {
            ...meta,
            elapsedTime: meta.elapsedTime + delta,
          },
        }));
      },
      resetGame() {
        set({
          player: INITIAL_PLAYER([0, 2, 20]),
          enemies: spawnEnemies(INITIAL_SETTINGS.enemyCount),
          projectiles: [],
          fields: [],
          zone: INITIAL_ZONE,
          input: INITIAL_INPUT,
          meta: INITIAL_META,
        });
        get().resetInternal();
      },
    },
  }))
);

export const useGameState = <T,>(selector: (state: GameState) => T) =>
  useGameStore((state) => selector(state));
