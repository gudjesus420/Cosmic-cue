'use client';

import { useState } from 'react';
import { GameTemplate, GeneratedCode } from '@/lib/types';
import { AI_MODELS } from '@/lib/ai-models';

interface CodeGeneratorProps {
  selectedTemplate: GameTemplate | null;
  onCodeGenerated: (files: GeneratedCode[]) => void;
}

export default function CodeGenerator({ selectedTemplate, onCodeGenerated }: CodeGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);

  const handleGenerate = async () => {
    if (!selectedTemplate || !prompt.trim()) {
      alert('Please select a template and enter a description');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          template: selectedTemplate.type,
          engine: selectedTemplate.engine,
          provider: selectedModel.provider,
          model: selectedModel.id
        })
      });

      if (!response.ok) {
        throw new Error('Code generation failed');
      }

      const data = await response.json();
      
      if (data.code && data.code.files) {
        onCodeGenerated(data.code.files);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Code generation error:', error);
      alert('Failed to generate code. Please check your API keys and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
        Code Generator
      </h2>

      {selectedTemplate ? (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="font-semibold text-blue-900 dark:text-blue-100">
            {selectedTemplate.name}
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            {selectedTemplate.description}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            Engine: {selectedTemplate.engine.toUpperCase()}
          </div>
        </div>
      ) : (
        <div className="mb-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-center text-zinc-600 dark:text-zinc-400">
          Please select a template first
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          AI Model
        </label>
        <select
          value={selectedModel.id}
          onChange={(e) => {
            const model = AI_MODELS.find(m => m.id === e.target.value);
            if (model) setSelectedModel(model);
          }}
          className="w-full p-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {AI_MODELS.map(model => (
            <option key={model.id} value={model.id}>
              {model.name} ({model.provider})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Game Description
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your game in detail... (e.g., 'Create a space shooter with power-ups, multiple enemy types, and a boss battle')"
          className="w-full p-3 border border-zinc-300 dark:border-zinc-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          rows={6}
          disabled={isGenerating || !selectedTemplate}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating || !selectedTemplate || !prompt.trim()}
        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⚙️</span>
            Generating Code...
          </span>
        ) : (
          '🚀 Generate Game Code'
        )}
      </button>

      {isGenerating && (
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⏳ This may take 30-60 seconds. The AI is generating complete game code for you...
          </p>
        </div>
      )}
    </div>
  );
}
