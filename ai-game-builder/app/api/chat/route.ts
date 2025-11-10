import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { messages, model, provider } = await req.json();

    if (!messages || !model || !provider) {
      return NextResponse.json(
        { error: 'Missing required fields: messages, model, provider' },
        { status: 400 }
      );
    }

    let response: string;

    switch (provider) {
      case 'openai':
        response = await handleOpenAI(messages, model);
        break;
      case 'claude':
        response = await handleClaude(messages, model);
        break;
      case 'gemini':
        response = await handleGemini(messages, model);
        break;
      case 'grok':
        response = await handleGrok(messages, model);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid provider' },
          { status: 400 }
        );
    }

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

async function handleOpenAI(messages: any[], model: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const openai = new OpenAI({ apiKey });
  
  const completion = await openai.chat.completions.create({
    model,
    messages: messages.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    temperature: 0.7,
    max_tokens: 4000
  });

  return completion.choices[0]?.message?.content || 'No response generated';
}

async function handleClaude(messages: any[], model: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Anthropic API key not configured');
  }

  const anthropic = new Anthropic({ apiKey });

  const systemMessage = messages.find(m => m.role === 'system');
  const userMessages = messages.filter(m => m.role !== 'system');

  const response = await anthropic.messages.create({
    model,
    max_tokens: 4000,
    system: systemMessage?.content || 'You are an expert AI assistant for building 3D Android games.',
    messages: userMessages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }))
  });

  return response.content[0].type === 'text' ? response.content[0].text : 'No response generated';
}

async function handleGemini(messages: any[], model: string): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('Google API key not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const geminiModel = genAI.getGenerativeModel({ model });

  const systemMessage = messages.find(m => m.role === 'system');
  const chatHistory = messages
    .filter(m => m.role !== 'system')
    .map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

  const lastMessage = chatHistory.pop();
  
  const chat = geminiModel.startChat({
    history: chatHistory,
    generationConfig: {
      maxOutputTokens: 4000,
      temperature: 0.7,
    },
  });

  const result = await chat.sendMessage(lastMessage?.parts[0].text || '');
  return result.response.text();
}

async function handleGrok(messages: any[], model: string): Promise<string> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    throw new Error('xAI API key not configured');
  }

  // Grok uses OpenAI-compatible API
  const openai = new OpenAI({
    apiKey,
    baseURL: 'https://api.x.ai/v1'
  });

  const completion = await openai.chat.completions.create({
    model,
    messages: messages.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    temperature: 0.7,
    max_tokens: 4000
  });

  return completion.choices[0]?.message?.content || 'No response generated';
}
