import { AIModel } from './types';

export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    description: 'Most capable OpenAI model for complex game development tasks'
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    description: 'Faster and more affordable OpenAI model'
  },
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'claude',
    description: 'Anthropic\'s most intelligent model with excellent coding abilities'
  },
  {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    provider: 'claude',
    description: 'Fast and efficient Claude model'
  },
  {
    id: 'gemini-2.0-flash-exp',
    name: 'Gemini 2.0 Flash',
    provider: 'gemini',
    description: 'Google\'s latest experimental model with multimodal capabilities'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'gemini',
    description: 'Google\'s production-ready model with large context window'
  },
  {
    id: 'grok-beta',
    name: 'Grok Beta',
    provider: 'grok',
    description: 'xAI\'s conversational model with real-time knowledge'
  }
];

export const getModelsByProvider = (provider: string) => {
  return AI_MODELS.filter(model => model.provider === provider);
};

export const getModelById = (id: string) => {
  return AI_MODELS.find(model => model.id === id);
};
