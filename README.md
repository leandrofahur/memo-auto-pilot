# 🧠 MemoAutoPilot — AI Meeting Assistant with Transcription & Summarization

[![Node.js Version](https://img.shields.io/badge/node.js-18%2B-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14%2B-black.svg)](https://nextjs.org/)
[![LangChain](https://img.shields.io/badge/LangChain-powered-blueviolet.svg)](https://www.langchain.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> **Listen, Transcribe, and Understand:** MemoAutoPilot is your intelligent meeting assistant built with Next.js and LangChain. Upload a recording, and let the AI generate clean notes and smart summaries — all in a modern web app.


## 📝 Overview
**MemoAutoPilot** turns your meeting recordings into readable, actionable notes using cutting-edge AI tools.  
It leverages **OpenAI Whisper** (or compatible speech models) for transcription and **LangChain** for intelligent summarization and Q&A — all wrapped in a user-friendly Next.js frontend.

Whether you're capturing 1-on-1s, team standups, or hour-long sessions, MemoAutoPilot helps you focus on the conversation, not the keyboard.


## ✨ Key Features

- 🎙️ **Upload Meeting Audio** (`.mp3`, `.wav`, etc.)
- 🧠 **AI Transcription** using Whisper or STT APIs
- ✍️ **Smart Summaries** with LangChain agents or chains
- 🔁 **Follow-up Q&A** over the transcript (optional)
- 📄 **Download Notes & Transcript**
- 🌐 100% Web-based — no installs needed


## 🏗️ Architecture
### Tech Stack
| Layer         | Technology                                  |
|---------------|----------------------------------------------|
| Frontend      | Next.js 14 (App Router), TailwindCSS, Shadcn |
| Backend API   | Node.js (via Next.js API routes)             |
| Transcription | Whisper (OpenAI or Local)                    |
| Summarization | LangChain (MapReduce / ConversationalChain) |
| Storage       | Local (upload folder) or Cloud (optional)    |
| Hosting       | Vercel, Render, or any Node-capable platform |


## 🦜 LangChain Usage
MemoAutoPilot uses LangChain for:
- **Summarizing long transcripts**
- **Condensing bullet points**
- **Answering questions about the meeting**

Chain types:
- `MapReduceSummarizationChain`
- `RetrievalQAChain` (for chat over transcript)
- `LLMChain` with custom prompts


## 🔍 Project Structure
```bash
memoautopilot/
├── app/                # Next.js App Router
│   └── api/
│       └── transcribe/route.ts     # Audio → transcript
│       └── summarize/route.ts      # Transcript → summary
├── components/         # UI components
├── lib/                # LangChain, transcription helpers
├── public/             # Static assets, sample audio
├── uploads/            # Uploaded audio files
├── .env                # API keys, config
└── README.md
```


## API Endpoints 🚧
| Method | Endpoint | Description |
|--------|----------|-------------|
|        |          |             |


## 👨‍💻 Contributors
We welcome all contributors! Here are our current team members:

| Avatar | Name | Role | GitHub |
|--------|------|------|--------|
| <img src="https://avatars.githubusercontent.com/u/46628080?u=7c2c2d90408b1a731118b5b3512d9da890cf2d45&v=4" width="40" /> | **Leandro Miranda Fahur Machado** | Software Engineer | [@leandrofahur](https://github.com/leandrofahur) |

### Want to Join?
We're always looking for contributors! Contact me on [LinkedIn](https://www.linkedin.com/in/leandro-miranda-fahur-machado/) to get started.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.