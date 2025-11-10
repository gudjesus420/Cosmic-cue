'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import GameTemplates from '@/components/GameTemplates';
import CodeGenerator from '@/components/CodeGenerator';
import CodeEditor from '@/components/CodeEditor';
import ThreePreview from '@/components/ThreePreview';
import { GameTemplate, GeneratedCode } from '@/lib/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chat' | 'templates' | 'code'>('chat');
  const [selectedTemplate, setSelectedTemplate] = useState<GameTemplate | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedCode[]>([]);

  const handleTemplateSelect = (template: GameTemplate) => {
    setSelectedTemplate(template);
    setActiveTab('code');
  };

  const handleCodeGenerated = (files: GeneratedCode[]) => {
    setGeneratedFiles(files);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                🎮 AI Game Builder
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                Build playable 3D Android games with AI assistance
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                <div className="font-medium">Supported AI Models:</div>
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs">
                    OpenAI
                  </span>
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs">
                    Claude
                  </span>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                    Gemini
                  </span>
                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-xs">
                    Grok
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              💬 AI Chat
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'templates'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              📋 Templates
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'code'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              💻 Code & Preview
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChatInterface />
            </div>
            <div>
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  🚀 Quick Start Guide
                </h3>
                <ol className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-500">1.</span>
                    <span>Add your API keys to <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">.env.local</code></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-500">2.</span>
                    <span>Select an AI model (OpenAI, Claude, Gemini, or Grok)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-500">3.</span>
                    <span>Describe your game idea in the chat</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-500">4.</span>
                    <span>Use voice input for hands-free interaction</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-500">5.</span>
                    <span>Browse templates for quick starts</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-500">6.</span>
                    <span>Generate and download complete game code</span>
                  </li>
                </ol>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">✨ Features</h3>
                <ul className="space-y-2 text-sm">
                  <li>✅ Multiple AI models support</li>
                  <li>✅ Voice chat capabilities</li>
                  <li>✅ Unity & Godot templates</li>
                  <li>✅ Real-time code generation</li>
                  <li>✅ 3D preview visualization</li>
                  <li>✅ Android-optimized code</li>
                  <li>✅ Export to project files</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div>
            <GameTemplates onSelectTemplate={handleTemplateSelect} />
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CodeGenerator
                selectedTemplate={selectedTemplate}
                onCodeGenerated={handleCodeGenerated}
              />
              <ThreePreview />
            </div>
            <CodeEditor files={generatedFiles} />
          </div>
        )}
      </main>

      <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            Built with Next.js, TypeScript, Tailwind CSS, Three.js, and AI
          </p>
          <p className="mt-2">
            Configure your API keys in <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">.env.local</code>
          </p>
        </div>
      </footer>
    </div>
  );
}
