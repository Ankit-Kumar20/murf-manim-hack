# Mona

An AI-powered educational platform that creates comprehensive learning experiences through animated visualizations, written articles, audio narration, and interactive conversations. Built with Next.js and integrated with multiple AI services for generating educational content.

## 🎯 Features

- **🎬 Video Generation**: Create Manim-powered mathematical animations with synchronized audio narration
- **📝 Article Generation**: Generate structured educational articles with AI-powered content
- **🎵 Audio Narration**: Convert articles to natural speech using Murf AI's text-to-speech
- **💬 Interactive Chatbot**: Engage in conversational learning with AI-powered explanations
- **🌐 Multilingual Support**: Translate content and generate audio in multiple languages
- **🎨 Visual Learning**: Dynamic mathematical visualizations using Manim animation engine
- **📚 Content Library**: Browse and manage generated educational materials
- **🔒 Secure Sandbox**: Execute code safely in isolated E2B containers
- **⚡ Real-time Generation**: Dynamic content creation based on user input
- **🎭 Modern UI**: Responsive interface with shader backgrounds and smooth animations

## 📱 Pages & Routes

- **Home (/)** - Landing page with service overview and quick actions
- **Explain (/explain/[topic])** - Generate animated videos for mathematical concepts
- **Article (/article)** - Create structured educational articles
- **Library (/library)** - Browse and manage generated content
- **Translation Demo (/translation-demo)** - Test multilingual capabilities
- **Loading (/loading)** - Processing states during content generation

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Paper Design Shaders, Motion (animations)
- **AI Services**:
  - **OpenRouter**: Primary AI provider (GPT-4, Gemini, Claude)
  - **Google AI**: Alternative AI provider for enhanced responses
  - **Murf AI**: Professional text-to-speech and voice synthesis
- **Sandbox & Execution**: E2B Code Interpreter for secure code execution
- **Animation**: Manim (Mathematical Animation Engine) for video generation
- **Storage**: Vercel Blob for file storage and delivery
- **Package Manager**: Bun (with npm fallback)
- **Development**: ESLint, Turbopack for fast builds

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** or **Bun** (recommended for faster installs)
- **E2B Account** - [Sign up at e2b.dev](https://e2b.dev) for sandbox execution
- **OpenRouter API Key** - [Get API key at openrouter.ai](https://openrouter.ai) for AI content generation
- **Murf AI API Key** - [Sign up at murf.ai](https://murf.ai) for text-to-speech
- **Vercel Blob Token** - For file storage (optional, can use local storage)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Ankit-Kumar20/murf-manim-hack.git
   cd murf-manim-hack
   ```

2. **Install dependencies**

   ```bash
   bun install
   # or
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with your API keys:

   ```env
   E2B_API_KEY=your_e2b_api_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   MURF_AI_API_KEY=your_murf_ai_api_key
   BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
   ```

4. **Run the development server**

   ```bash
   bun dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🐳 E2B Sandbox Setup

This project uses a custom E2B sandbox environment with Manim pre-installed.

### Sandbox Template: `q6wznn8hq65ffgkd0tqh`

The sandbox includes:

- Python 3.10
- Manim with all dependencies
- FFmpeg for video processing
- Cairo and Pango for rendering

### Building the Sandbox Template

If you need to rebuild the sandbox template:

```bash
e2b template build
```

The template configuration is defined in:

- `e2b.Dockerfile` - Docker configuration with Manim installation
- `e2b.toml` - E2B template configuration

## 📁 Project Structure

```
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── api/                      # API routes
│   │   │   ├── chatbot/              # Conversational AI endpoint
│   │   │   ├── code-execution/       # Code execution in sandbox
│   │   │   ├── generate-article/     # Article generation
│   │   │   ├── generate-audio/       # Text-to-speech audio generation
│   │   │   ├── generate-lesson/      # Lesson plan generation
│   │   │   ├── generate-manim/       # Manim code generation
│   │   │   ├── test-env/             # Environment testing
│   │   │   ├── test-voices/          # Voice testing
│   │   │   ├── translate/            # Translation services
│   │   │   └── voices/               # Voice options
│   │   ├── article/                  # Article generation pages
│   │   ├── explain/                  # Concept explanation pages
│   │   ├── library/                  # Content library
│   │   ├── translation-demo/         # Translation demonstration
│   │   ├── loading/                  # Loading states
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Homepage
│   │   ├── globals.css               # Global styles
│   │   └── favicon.ico               # App favicon
│   ├── components/                   # React components
│   │   ├── ArticleDisplay.tsx        # Article rendering
│   │   ├── ConceptInputForm.tsx      # Input forms
│   │   ├── ContentModeSelector.tsx   # Content type selection
│   │   ├── EnhancedArticleDisplay.tsx # Advanced article display
│   │   ├── EnhancedLessonBreakdown.tsx # Lesson components
│   │   ├── Footer.tsx                # Site footer
│   │   ├── LanguageSelector.tsx      # Language selection
│   │   ├── LessonArticleDisplay.tsx  # Lesson article display
│   │   ├── LessonBreakdown.tsx       # Lesson breakdown
│   │   ├── Navbar.tsx                # Navigation
│   │   ├── ShaderBackground.tsx      # Background effects
│   │   ├── SimpleEnhancedArticleDisplay.tsx # Simplified display
│   │   ├── SubmittedTopicTitle.tsx   # Topic display
│   │   ├── TypewriterText.tsx        # Animated text
│   │   └── VideoWithAudio.tsx        # Video with audio sync
│   └── utils/                        # Utility functions
│       ├── blobStorage.ts            # File storage utilities
│       ├── clearCache.ts             # Cache management
│       ├── formatManimCode.ts        # Manim code formatting
│       ├── lessonBreakdown.ts        # Lesson processing
│       ├── murfTTS.ts                # Text-to-speech integration
│       ├── sandbox.ts                # E2B sandbox integration
│       ├── structuredManimGenerator.ts # Manim code generation
│       ├── translation.ts            # Translation utilities
│       └── voiceNarration.ts         # Voice narration
├── public/                           # Static assets
│   ├── audio/                        # Generated audio files
│   ├── videos/                       # Generated video files
│   ├── *.svg                         # UI icons
│   └── *.ico                         # Favicons
├── e2b.Dockerfile                    # E2B sandbox configuration
├── e2b.toml                          # E2B template settings
├── StringTheoryScene.py              # Example Manim scene
└── package.json                      # Dependencies and scripts
```

## 🔧 API Endpoints

### Core Generation Endpoints

#### `/api/generate-manim`

Generates Manim animation code for mathematical concepts.

**Request:**

```json
{
  "topic": "quadratic functions",
  "details": "Show the graph transformation"
}
```

**Response:**

```json
{
  "success": true,
  "code": "from manim import *\n\nclass QuadraticFunction(Scene):\n    def construct(self):\n        ...",
  "explanation": "This animation demonstrates..."
}
```

#### `/api/generate-article`

Creates structured educational articles with AI-generated content.

**Request:**

```json
{
  "topic": "machine learning",
  "audience": "beginners",
  "sections": ["introduction", "basics", "applications"]
}
```

#### `/api/generate-lesson`

Generates comprehensive lesson plans with breakdown and activities.

#### `/api/generate-audio`

Converts articles to speech using Murf AI's text-to-speech.

**Request:**

```json
{
  "articleContent": {
    "title": "Introduction to Algebra",
    "introduction": "...",
    "sections": [...],
    "conclusion": "..."
  },
  "languages": ["en", "es"],
  "voiceOptions": {
    "voice": "en-US-female-1",
    "speed": 1.0
  }
}
```

### Interactive Features

#### `/api/chatbot`

Provides conversational AI for educational topics with session management.

**Request:**

```json
{
  "message": "Explain derivatives",
  "sessionId": "unique-session-123",
  "topic": "calculus"
}
```

#### `/api/translate`

Translates text and articles to multiple languages.

**Request:**

```json
{
  "type": "article",
  "targetLanguage": "es",
  "data": {
    "articleContent": {...}
  }
}
```

### Utility Endpoints

#### `/api/code-execution`

Executes code safely in E2B sandbox environment.

#### `/api/voices`

Retrieves available voice options for text-to-speech.

#### `/api/test-voices`

Tests voice synthesis with sample text.

#### `/api/test-env`

Environment testing and validation.

## 💡 Usage Examples

### Creating Educational Videos

1. Navigate to `/explain`
2. Enter a mathematical concept (e.g., "quadratic equations")
3. Choose visualization options
4. Generate Manim animation with AI narration

### Generating Articles

1. Go to `/article`
2. Specify topic and audience level
3. Select article structure
4. Generate comprehensive educational content

### Multilingual Content

1. Create content in any supported language
2. Use translation API to convert to multiple languages
3. Generate audio narration in target languages
4. Access content library for all versions

### Interactive Learning

1. Use chatbot for conversational explanations
2. Generate lesson breakdowns with activities
3. Create video + audio combinations
4. Save everything to your personal library

## 🎨 Components

### Core UI Components

- **ConceptInputForm** - Interactive form for submitting concepts to visualize
- **ContentModeSelector** - Toggle between different content generation modes
- **LanguageSelector** - Select target languages for translation
- **Navbar** - Main navigation component
- **Footer** - Site footer with links

### Content Display Components

- **ArticleDisplay** - Basic article rendering
- **EnhancedArticleDisplay** - Advanced article display with formatting
- **SimpleEnhancedArticleDisplay** - Lightweight article display
- **LessonArticleDisplay** - Specialized display for lesson content
- **LessonBreakdown** - Interactive lesson breakdown component
- **EnhancedLessonBreakdown** - Advanced lesson breakdown with activities

### Interactive Components

- **VideoWithAudio** - Synchronized video and audio playback
- **TypewriterText** - Animated typewriter text effect
- **SubmittedTopicTitle** - Displays current topic being processed
- **ShaderBackground** - Dynamic WebGL shader background effects

## 🔒 Security Features

- **Sandboxed Execution**: All code runs in isolated E2B containers
- **Input Validation**: Robust validation of user inputs
- **Rate Limiting**: API endpoints are rate-limited
- **Error Handling**: Comprehensive error handling and logging

## 🐛 Troubleshooting

### Common Issues

1. **E2B Sandbox Fails to Start**

   - Ensure your E2B API key is valid
   - Check that the template `q6wznn8hq65ffgkd0tqh` exists
   - Rebuild the template if necessary

2. **Manim Import Errors**

   - Verify the sandbox template includes all Manim dependencies
   - Check the Docker build logs for any installation issues

3. **API Key Errors**
   - Ensure all required environment variables are set
   - Verify API keys are valid and have sufficient quotas

### Testing the Sandbox

Test the Manim environment using the example scene:

```bash
python StringTheoryScene.py
```

Or use the built-in API testing endpoints:

- `/api/test-env` - Environment validation
- `/api/test-voices` - Voice synthesis testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

### Documentation

- [E2B Documentation](https://e2b.dev/docs) - Sandbox execution platform
- [Manim Documentation](https://docs.manim.community/) - Mathematical animation engine
- [Next.js Documentation](https://nextjs.org/docs) - React framework
- [OpenRouter Documentation](https://openrouter.ai/docs) - AI model provider
- [Murf AI Documentation](https://docs.murf.ai/) - Text-to-speech service
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob) - File storage

### Related Tools

- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [Paper Design Shaders](https://github.com/paper-design/shaders) - WebGL shader effects
- [Motion](https://motion.dev/) - Animation library

### Development

- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - Type safety
- [Bun Documentation](https://bun.sh/docs) - Fast JavaScript runtime

## 📧 Support

For support, please open an issue on GitHub or contact the development team.
