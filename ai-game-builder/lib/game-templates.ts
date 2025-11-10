import { GameTemplate } from './types';

export const GAME_TEMPLATES: GameTemplate[] = [
  {
    id: 'fps-unity',
    name: 'First Person Shooter',
    description: 'Classic FPS with player movement, shooting mechanics, and enemy AI',
    type: 'fps',
    engine: 'unity'
  },
  {
    id: 'racing-unity',
    name: 'Racing Game',
    description: 'Arcade-style racing with vehicle physics and track system',
    type: 'racing',
    engine: 'unity'
  },
  {
    id: 'puzzle-unity',
    name: 'Puzzle Game',
    description: 'Match-3 or physics-based puzzle mechanics',
    type: 'puzzle',
    engine: 'unity'
  },
  {
    id: 'rpg-unity',
    name: 'RPG Adventure',
    description: 'Role-playing game with inventory, quests, and combat',
    type: 'rpg',
    engine: 'unity'
  },
  {
    id: 'platformer-unity',
    name: '3D Platformer',
    description: 'Character controller with jumping, climbing, and collectibles',
    type: 'platformer',
    engine: 'unity'
  },
  {
    id: 'fps-godot',
    name: 'First Person Shooter (Godot)',
    description: 'FPS built with Godot Engine using GDScript',
    type: 'fps',
    engine: 'godot'
  },
  {
    id: 'platformer-godot',
    name: '3D Platformer (Godot)',
    description: 'Platformer game using Godot\'s physics engine',
    type: 'platformer',
    engine: 'godot'
  }
];

export const getTemplatesByEngine = (engine: 'unity' | 'godot') => {
  return GAME_TEMPLATES.filter(template => template.engine === engine);
};

export const getTemplateById = (id: string) => {
  return GAME_TEMPLATES.find(template => template.id === id);
};
