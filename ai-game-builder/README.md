# 🎮 AI Game Builder

A powerful, customizable AI assistant for building playable 3D Android games. Supports multiple AI models (OpenAI, Claude, Gemini, Grok), voice chat, and generates production-ready code for Unity and Godot engines.

## ✨ Features

- **🤖 Multiple AI Models**: Choose from OpenAI GPT-4, Claude 3.5, Gemini 2.0, or Grok
- **🎤 Voice Chat**: Hands-free interaction with voice input and text-to-speech
- **🎯 Game Templates**: Pre-built templates for FPS, Racing, Puzzle, RPG, and Platformer games
- **💻 Code Generation**: AI-powered generation of complete, production-ready game code
- **🎨 Code Editor**: Built-in Monaco editor with syntax highlighting
- **🌐 3D Preview**: Real-time Three.js visualization
- **📱 Android Optimized**: All generated code is optimized for Android devices
- **🔧 Unity & Godot**: Support for both major game engines
- **📦 Export**: Download individual files or complete project packages

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- API keys for at least one AI provider:
  - OpenAI API key (for GPT models)
  - Anthropic API key (for Claude)
  - Google API key (for Gemini)
  - xAI API key (for Grok)

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd ai-game-builder
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API keys**:
   
   Edit `.env.local` and add your API keys:
   ```env
   # Required: Add at least one AI provider API key
   OPENAI_API_KEY=sk-your-openai-key-here
   ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
   GOOGLE_API_KEY=your-google-api-key-here
   XAI_API_KEY=your-xai-grok-key-here

   # Optional: For GitHub integration
   GITHUB_TOKEN=your-github-token-here

   # Optional: For Firebase integration
   FIREBASE_API_KEY=your-firebase-api-key-here
   FIREBASE_PROJECT_ID=your-firebase-project-id-here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Use

### 1. AI Chat Interface

- Select your preferred AI model from the dropdown
- Enable voice chat for hands-free interaction
- Describe your game idea in natural language
- Get instant responses with code suggestions and guidance

### 2. Game Templates

- Browse pre-built templates for different game genres
- Choose between Unity (C#) or Godot (GDScript)
- Select a template to auto-fill the code generator

### 3. Code Generation

- Select a game template
- Choose your AI model
- Describe your game in detail
- Click "Generate Game Code" and wait 30-60 seconds
- Review, edit, and download the generated code

### 4. 3D Preview

- View real-time 3D visualizations
- Interact with the preview scene
- Test game concepts before implementation

## 🎯 Example Prompts

Here are some example prompts to get you started:

**FPS Game**:
```
Create a first-person shooter with:
- WASD movement and mouse look
- Shooting mechanics with raycast
- Enemy AI that follows and attacks the player
- Health system with UI
- Ammo counter and reload system
- Mobile touch controls for Android
```

**Racing Game**:
```
Build a racing game with:
- Car physics with acceleration and steering
- 3 different tracks
- Lap timing system
- Mobile tilt controls
- Boost power-ups
- Checkpoint system
```

**Puzzle Game**:
```
Create a match-3 puzzle game with:
- Grid-based gameplay
- Touch input for swapping tiles
- Match detection algorithm
- Score system with combos
- Level progression
- Particle effects for matches
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js
- **Code Editor**: Monaco Editor
- **AI SDKs**:
  - OpenAI SDK
  - Anthropic SDK
  - Google Generative AI SDK
  - xAI (OpenAI-compatible API)

## 📁 Project Structure

```
ai-game-builder/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # AI chat endpoint
│   │   ├── generate-code/route.ts # Code generation endpoint
│   │   └── voice/
│   │       ├── transcribe/route.ts # Speech-to-text
│   │       └── synthesize/route.ts # Text-to-speech
│   ├── layout.tsx
│   ├── page.tsx                    # Main application page
│   └── globals.css
├── components/
│   ├── ChatInterface.tsx           # AI chat UI
│   ├── ModelSelector.tsx           # AI model picker
│   ├── VoiceInput.tsx              # Voice recording
│   ├── GameTemplates.tsx           # Template browser
│   ├── CodeGenerator.tsx           # Code generation UI
│   ├── CodeEditor.tsx              # Monaco editor wrapper
│   └── ThreePreview.tsx            # 3D visualization
├── lib/
│   ├── types.ts                    # TypeScript types
│   ├── ai-models.ts                # AI model definitions
│   └── game-templates.ts           # Game template data
├── .env.local                      # API keys (not in git)
└── package.json
```

## 🔑 Getting API Keys

### OpenAI
1. Visit [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to API Keys section
4. Create a new secret key

### Anthropic (Claude)
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to API Keys
4. Generate a new key

### Google (Gemini)
1. Visit [ai.google.dev](https://ai.google.dev)
2. Sign in with Google account
3. Get API key from Google AI Studio

### xAI (Grok)
1. Visit [x.ai](https://x.ai)
2. Sign up for API access
3. Generate API key from dashboard

## 🎮 Supported Game Types

### Unity (C#)
- First Person Shooter
- Racing Game
- Puzzle Game
- RPG Adventure
- 3D Platformer

### Godot (GDScript)
- First Person Shooter
- 3D Platformer
- (More templates coming soon)

## 🔧 Advanced Configuration

### Custom AI Models

Edit `lib/ai-models.ts` to add custom models:

```typescript
{
  id: 'custom-model-id',
  name: 'Custom Model Name',
  provider: 'openai', // or 'claude', 'gemini', 'grok'
  description: 'Model description'
}
```

### Custom Game Templates

Edit `lib/game-templates.ts` to add custom templates:

```typescript
{
  id: 'custom-template',
  name: 'Custom Game Type',
  description: 'Template description',
  type: 'custom',
  engine: 'unity' // or 'godot'
}
```

## 🐛 Troubleshooting

### API Key Errors
- Ensure your API keys are correctly set in `.env.local`
- Restart the development server after changing environment variables
- Check that your API keys have sufficient credits/quota

### Voice Input Not Working
- Grant microphone permissions in your browser
- Ensure you're using HTTPS or localhost
- Check browser console for errors

### Code Generation Fails
- Verify your selected AI model's API key is valid
- Check your internet connection
- Try a different AI model
- Simplify your prompt if it's too complex

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 🌟 Acknowledgments

- OpenAI for GPT models
- Anthropic for Claude
- Google for Gemini
- xAI for Grok
- Three.js community
- Next.js team

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Happy Game Building! 🎮✨**
