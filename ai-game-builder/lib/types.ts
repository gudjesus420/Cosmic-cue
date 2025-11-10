export type AIProvider = 'openai' | 'claude' | 'gemini' | 'grok';

export type AIModel = {
  id: string;
  name: string;
  provider: AIProvider;
  description: string;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};

export type GameTemplate = {
  id: string;
  name: string;
  description: string;
  type: 'fps' | 'racing' | 'puzzle' | 'rpg' | 'platformer' | 'custom';
  engine: 'unity' | 'godot';
  thumbnail?: string;
};

export type GeneratedCode = {
  filename: string;
  content: string;
  language: 'csharp' | 'gdscript' | 'xml' | 'json';
};

export type ProjectExport = {
  name: string;
  engine: 'unity' | 'godot';
  files: GeneratedCode[];
  assets?: string[];
};
