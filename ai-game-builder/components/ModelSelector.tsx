'use client';

import { useState } from 'react';
import { AIModel, AIProvider } from '@/lib/types';
import { AI_MODELS } from '@/lib/ai-models';

interface ModelSelectorProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
}

export default function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(selectedModel.provider);

  const providers: AIProvider[] = ['openai', 'claude', 'gemini', 'grok'];
  const filteredModels = AI_MODELS.filter(m => m.provider === selectedProvider);

  const handleModelSelect = (model: AIModel) => {
    onModelChange(model);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors font-medium text-sm"
      >
        {selectedModel.name} ▼
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 z-50">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Select AI Model
            </h3>

            <div className="flex gap-2 mb-4">
              {providers.map((provider) => (
                <button
                  key={provider}
                  onClick={() => setSelectedProvider(provider)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedProvider === provider
                      ? 'bg-blue-500 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedModel.id === model.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                      : 'bg-zinc-50 dark:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600'
                  }`}
                >
                  <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                    {model.name}
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                    {model.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
