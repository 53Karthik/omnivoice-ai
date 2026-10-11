# OmniVoice AI

A **locally runnable Next.js Gemini-powered chatbot** with browser voice recognition, speech synthesis, document upload / extraction, report question answering and chat history.

## Requirements
- Node.js 20.9+ (Node 22 LTS recommended)
- A Google AI Studio Gemini API key: https://aistudio.google.com/apikey
- Chrome or Edge for best browser speech recognition support

## Windows setup (VS Code terminal / PowerShell)

1. Extract ZIP, open the **omnivoice-ai** directory in VS Code.
2. Open Terminal > New Terminal.
3. Install dependencies:
   ```powershell
   npm install
   ```
4. Create `.env.local` by copying `.env.example`:
   ```powershell
   Copy-Item .env.example .env.local
   ```
5. Open `.env.local` and replace `replace_with_your_key` with your own API key. **Never commit or share this key.**
6. Start the app:
   ```powershell
   npm run dev
   ```
7. Open http://localhost:3000

If Google returns a `model not found` / access error, change `GEMINI_MODEL` in `.env.local` to a currently available Flash model listed in your Google AI Studio account, and restart `npm run dev`.

## How to use
- Type a prompt and press Enter (Shift+Enter adds a newline).
- Click the **microphone** to dictate your question; browser speech recognition inserts the text. Click send to ask Gemini.
- Enable **Voice on** to automatically read AI responses aloud, or click the speaker icon below a response.
- Click the **paperclip** to upload PDF, DOCX, TXT, MD, CSV or XLS/XLSX (up to 4 MB each).
- With **Docs on**, questions are supplemented with selected text excerpts from all files attached to the current conversation; Gemini is told to cite their names and pages when possible.
- Create / delete conversations via the sidebar. Export a conversation to Markdown via the header download icon.

## Architecture
- `app/page.tsx`: responsive React chat UI; Web Speech APIs; conversation management.
- `app/api/chat/route.ts`: server-only Gemini generateContent REST call; safely reads GEMINI_API_KEY from server environment.
- `app/api/extract/route.ts`: server-only document text extraction (pdf-parse, mammoth, SheetJS).
- `lib/retrieval.ts`: lightweight **keyword-ranked chunk retrieval**. No vector DB or embeddings in this starter.
- `lib/types.ts`: TypeScript message / document types.

## Limitations / honest scope
- This is a **working MVP**, not the full production feature wishlist. No sign-up/auth, server database, OCR for scanned PDFs, live web search, multilingual voice selection, data visualization, or PPTX parser yet.
- Browser voice input requires permissions and browser speech recognition support; speech recognition availability may depend on the browser's remote speech service. Microphone produces a transcription; hit Send to submit it. Speech output uses browser voices.
- Conversation and extracted document text are stored in **localStorage**, not a secure multi-user backend. Do not upload confidential documents to this starter: document text is sent to Gemini with the questions, and localStorage is accessible to scripts on the same origin. Browser storage quota limits long documents.
- The API uses ranked excerpts from each document (not full embedding-based RAG); for large files it may miss facts. PDFs without selectable text cannot be read without OCR. Citation labels are file/page references from PDF extraction, not clickable source highlights, and page extraction may not capture some layouts accurately.
- Each uploaded file is capped at 4 MB and extracted document text at 220,000 characters. Context passed per question is capped at ~28,000 characters. Avoid uploading many large files.
- The free-tier Gemini API has model-specific eligibility, data usage terms, quotas and rate limits which Google can change. Check https://ai.google.dev/gemini-api/docs/pricing.
- No API key is included; you must configure your own. The app cannot be tested end-to-end against Gemini without your key.
- If exposing this application publicly, add authentication, server-side session storage, rate limiting, upload malware checks and tighter controls on payload sizes before deploying.

## Quick verification
Run `npm run typecheck` and `npm run build` after installing dependencies. Visit the page, add your Gemini key, send a general question, attach a text PDF or TXT and ask for a summary, then test the microphone using Chrome.
