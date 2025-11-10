'use client';

import { useState } from 'react';
import { GameTemplate } from '@/lib/types';
import { GAME_TEMPLATES } from '@/lib/game-templates';

interface GameTemplatesProps {
  onSelectTemplate: (template: GameTemplate) => void;
}

export default function GameTemplates({ onSelectTemplate }: GameTemplatesProps) {
  const [selectedEngine, setSelectedEngine] = useState<'unity' | 'godot'>('unity');

  const filteredTemplates = GAME_TEMPLATES.filter(t => t.engine === selectedEngine);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
        Game Templates
      </h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedEngine('unity')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            selectedEngine === 'unity'
              ? 'bg-blue-500 text-white'
              : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
          }`}
        >
          Unity (C#)
        </button>
        <button
          onClick={() => setSelectedEngine('godot')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            selectedEngine === 'godot'
              ? 'bg-blue-500 text-white'
              : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
          }`}
        >
          Godot (GDScript)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className="text-left p-6 bg-zinc-50 dark:bg-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors border-2 border-transparent hover:border-blue-500"
          >
            <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              {template.name}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              {template.description}
            </div>
            <div className="mt-3 inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
              {template.type.toUpperCase()}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
