import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { prompt, template, engine, provider = 'openai', model = 'gpt-4o' } = await req.json();

    if (!prompt || !template || !engine) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt, template, engine' },
        { status: 400 }
      );
    }

    const systemPrompt = getSystemPrompt(template, engine);
    const generatedCode = await generateCode(systemPrompt, prompt, provider, model);

    return NextResponse.json({ code: generatedCode });
  } catch (error: any) {
    console.error('Code Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate code' },
      { status: 500 }
    );
  }
}

function getSystemPrompt(template: string, engine: string): string {
  const basePrompt = `You are an expert game developer specializing in ${engine === 'unity' ? 'Unity with C#' : 'Godot with GDScript'} for Android game development.`;

  const templatePrompts: Record<string, string> = {
    fps: `${basePrompt} Generate complete, production-ready code for a First Person Shooter game. Include player movement, camera control, shooting mechanics, enemy AI, and health system. Ensure all code is optimized for Android devices.`,
    racing: `${basePrompt} Generate complete code for a racing game with vehicle physics, steering controls, acceleration, track system, and lap timing. Optimize for mobile touch controls.`,
    puzzle: `${basePrompt} Generate code for a puzzle game with grid-based mechanics, match detection, scoring system, and level progression. Include touch input handling for Android.`,
    rpg: `${basePrompt} Generate code for an RPG with character stats, inventory system, quest management, turn-based or real-time combat, and save/load functionality.`,
    platformer: `${basePrompt} Generate code for a 3D platformer with character controller, jumping mechanics, collectibles, enemy interactions, and level design tools.`,
    custom: basePrompt
  };

  return templatePrompts[template] || templatePrompts.custom;
}

async function generateCode(systemPrompt: string, userPrompt: string, provider: string, model: string): Promise<any> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user', 
        content: `${userPrompt}\n\nProvide complete, well-structured code files. Format your response as JSON with this structure:
{
  "files": [
    {
      "filename": "PlayerController.cs",
      "content": "// Complete file content here",
      "language": "csharp"
    }
  ],
  "instructions": "Setup and usage instructions"
}` 
      }
    ],
    temperature: 0.7,
    max_tokens: 8000,
    response_format: { type: "json_object" }
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) {
    throw new Error('No code generated');
  }

  return JSON.parse(response);
}
