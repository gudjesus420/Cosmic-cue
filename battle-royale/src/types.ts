export type Vec3 = [number, number, number];

export interface PlayerState {
  position: Vec3;
  velocity: Vec3;
  aim: Vec3;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  inventory: {
    smokeBombs: number;
    healingJoints: number;
  };
  isDowned: boolean;
}

export interface EnemyState {
  id: string;
  position: Vec3;
  velocity: Vec3;
  health: number;
  maxHealth: number;
  state: 'idle' | 'chasing' | 'searching';
  targetLostTimer: number;
}

export type ProjectileType = 'smoke' | 'heal';

export interface ProjectileState {
  id: string;
  type: ProjectileType;
  position: Vec3;
  direction: Vec3;
  speed: number;
  age: number;
  ttl: number;
}

export type FieldType = 'smoke' | 'heal';

export interface FieldState {
  id: string;
  type: FieldType;
  position: Vec3;
  radius: number;
  age: number;
  ttl: number;
}

export interface ZoneState {
  center: Vec3;
  radius: number;
  shrinkRate: number;
  minRadius: number;
}

export interface GameSettings {
  enemyCount: number;
  zoneShrinkInterval: number;
  zoneShrinkAmount: number;
}

export interface InputState {
  move: Vec3;
  aim: Vec3;
  firing: boolean;
}

export interface GameMeta {
  isPaused: boolean;
  elapsedTime: number;
  wave: number;
  notifications: string[];
}

export interface GameState {
  player: PlayerState;
  enemies: EnemyState[];
  projectiles: ProjectileState[];
  fields: FieldState[];
  zone: ZoneState;
  settings: GameSettings;
  input: InputState;
  meta: GameMeta;
  actions: GameActions;
}

export interface GameActions {
  applyInput: (partial: Partial<InputState>) => void;
  fireSmokeBomb: () => void;
  fireHealingJoint: () => void;
  damagePlayer: (amount: number) => void;
  healPlayer: (amount: number) => void;
  damageEnemy: (id: string, amount: number) => void;
  spawnNotification: (message: string) => void;
  tick: (delta: number) => void;
  resetGame: () => void;
}
