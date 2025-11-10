'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { GeneratedCode } from '@/lib/types';

interface CodeEditorProps {
  files: GeneratedCode[];
  onFilesChange?: (files: GeneratedCode[]) => void;
}

export default function CodeEditor({ files, onFilesChange }: CodeEditorProps) {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');

  if (files.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 text-center">
        <div className="text-zinc-400 dark:text-zinc-600">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-lg">No code generated yet</p>
          <p className="text-sm mt-2">Use the chat or templates to generate game code</p>
        </div>
      </div>
    );
  }

  const currentFile = files[selectedFileIndex];

  const getLanguage = (lang: string) => {
    const languageMap: Record<string, string> = {
      csharp: 'csharp',
      gdscript: 'python',
      xml: 'xml',
      json: 'json'
    };
    return languageMap[lang] || 'plaintext';
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined && onFilesChange) {
      const updatedFiles = [...files];
      updatedFiles[selectedFileIndex] = {
        ...updatedFiles[selectedFileIndex],
        content: value
      };
      onFilesChange(updatedFiles);
    }
  };

  const downloadFile = (file: GeneratedCode) => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAllFiles = () => {
    files.forEach(file => downloadFile(file));
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-2 overflow-x-auto">
          {files.map((file, index) => (
            <button
              key={index}
              onClick={() => setSelectedFileIndex(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedFileIndex === index
                  ? 'bg-blue-500 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {file.filename}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
            className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm"
          >
            {theme === 'vs-dark' ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => downloadFile(currentFile)}
            className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm"
          >
            💾 Save
          </button>
          <button
            onClick={downloadAllFiles}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            📦 Download All
          </button>
        </div>
      </div>

      <div className="h-[600px]">
        <Editor
          height="100%"
          language={getLanguage(currentFile.language)}
          value={currentFile.content}
          onChange={handleCodeChange}
          theme={theme}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on'
          }}
        />
      </div>
    </div>
  );
}
