# FlowRead - Project Documentation for Claude

## Project Overview

FlowRead is an English learning application that helps users understand English through "meaning flow" rather than translation. The core philosophy is: **"訳すな。意味の流れで、理解せよ。"** (Don't translate. Understand the flow of meaning.)

## Tech Stack

- **Framework**: Next.js 16.1.4 (App Router)
- **Language**: TypeScript (strict mode)
- **UI**: React 19.2.3 + Tailwind CSS v4
- **Data Storage**: localStorage
- **AI Integration**: Local LLM servers (OpenAI-compatible API)
  - llama.cpp server (default, port 8080)
  - LM Studio (port 1234)
  - Ollama (port 11434)

## Directory Structure

```
flow-read/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home (tabbed: materials/review)
│   ├── globals.css
│   ├── learn/[materialId]/     # Learning page
│   ├── review/                 # Flashcard review page
│   └── settings/               # Settings (tabbed: AI/data)
├── components/
│   ├── learning/
│   │   ├── FlowDisplay.tsx     # Main text display with chunk highlighting
│   │   ├── AISupport.tsx       # AI assistance panel
│   │   └── WordCard.tsx        # Marked word card with AI lookup
│   ├── ui/
│   │   └── FlowReadIcon.tsx    # App logo icon
│   └── AddMaterialModal.tsx    # Modal for adding custom materials
├── lib/
│   ├── types/
│   │   ├── index.ts            # Re-exports
│   │   ├── chunk.ts            # Chunk, FlowGuide types
│   │   ├── material.ts         # Material, Sentence types
│   │   ├── progress.ts         # Progress tracking types
│   │   └── settings.ts         # AI settings types
│   ├── hooks/
│   │   ├── useLlamaAI.ts       # llama.cpp API hook
│   │   └── useSettings.ts      # Settings management hook
│   ├── storage/
│   │   ├── settings.ts         # localStorage for settings
│   │   ├── marked-words.ts     # localStorage for marked words
│   │   ├── materials.ts        # localStorage for user materials
│   │   └── backup.ts           # Export/import backup (JSON)
│   └── utils/
│       ├── chunk-colors.ts     # Color utilities for chunk roles
│       └── parse-text.ts       # Text parsing for material creation
└── data/
    └── sample-materials/
        ├── north-wind-and-sun.ts      # Aesop's Fables
        ├── little-red-riding-hood.ts  # Grimm's Fairy Tales
        └── gettysburg-address.ts      # Lincoln's speech
```

## Core Data Models

### Chunk (意味のかたまり)
```typescript
type ChunkRole = 'subject' | 'verb' | 'object' | 'complement' |
                 'modifier' | 'time' | 'place' | 'reason' |
                 'condition' | 'connector' | 'intro';

interface Chunk {
  id: string;
  text: string;           // English text
  order: number;
  guide: {
    role: ChunkRole;      // Grammatical role
    questionForm: string; // e.g., "誰が？", "どうした？"
    flowHint: string;     // e.g., "物語の主役たちが登場"
  };
}
```

### Material (教材)
```typescript
interface Material {
  id: string;
  title: string;
  description?: string;
  source?: string;
  sentences: Sentence[];
  isBuiltIn: boolean;
  createdAt: number;
  updatedAt: number;
}
```

## Key Features

1. **Flow Display**: Shows full text with chunk-by-chunk highlighting
2. **Keyboard Navigation**: Arrow keys to move through chunks
3. **Chunk Tooltip**: Shows role, question form, and flow hint
4. **Word Marking**: Right-click to mark words with three statuses:
   - **知らなかった (new)**: First time seeing this word (blue highlight)
   - **忘れてしまった (forgotten)**: Seen before but forgot (amber highlight)
   - **覚えた (mastered)**: Learned through review (green highlight)
   - Keyboard shortcuts: `1` for new, `2` for forgotten
   - Persisted to localStorage per material
5. **AI Support**: Local LLM integration for explanations (llama.cpp, LM Studio, Ollama)
6. **Word Lookup**: AI-powered definitions with English definitions and context
7. **Custom Materials**: Add your own English texts via modal dialog
   - Auto-splits text into sentences
   - Saved to localStorage
   - Deletable from home page
8. **Flashcard Review**: Review marked words with flashcards (`/review`)
   - Shuffle words randomly
   - Filter by type (new/forgotten/mastered)
   - Show context on demand
   - AI lookup for word explanations
   - Mark as "覚えた" when mastered (doesn't delete, changes status)
9. **Backup & Restore**: Export/import learning data (JSON)
   - Export: Download all data from Settings
   - Import: Drag & drop on home page or Settings
   - Includes: marked words, user materials, settings

## Design Principles

- **No Direct Translation**: Never show direct Japanese translations
- **Flow-Based Understanding**: Guide users to understand meaning progression
- **Question-Driven**: Use questions like "誰が？" "どうした？" to prompt understanding
- **Context Preservation**: Always show words in their original context
- **AI as Learning Partner**: AI explains nuance, not just definitions

## Color Coding

- **Subject (主語)**: Blue
- **Verb (動詞)**: Green
- **Object (目的語)**: Amber/Yellow
- **Others**: Gray

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
```

## AI Configuration

The app supports multiple local LLM providers with OpenAI-compatible API:

| Provider   | Default Endpoint           | Description |
|------------|---------------------------|-------------|
| llama.cpp  | `http://localhost:8080`   | Default, lightweight |
| LM Studio  | `http://localhost:1234`   | GUI-based model management |
| Ollama     | `http://localhost:11434`  | Easy CLI setup |

Configure in Settings page (`/settings`):
- Select provider and it auto-detects available models
- Manual endpoint configuration supported

## Built-in Materials

All materials are public domain:

| Title | Source | Sentences |
|-------|--------|-----------|
| 北風と太陽 | Aesop's Fables | 9 |
| 赤ずきん | Grimm's Fairy Tales | 12 |
| ゲティスバーグ演説 | Abraham Lincoln (1863) | 16 |

## Language

- UI text: Japanese
- Code comments: Japanese (some English)
- Commit messages: English with Japanese co-author
