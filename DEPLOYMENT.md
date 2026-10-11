# Test and deploy OmniVoice AI

1. Run `npm install`.
2. Copy `.env.example` to `.env.local`. Set your own GEMINI_API_KEY. Never commit this file.
3. Run `npm run dev`, then visit http://localhost:3000.
4. Test a chat, a small TXT upload, a document question, microphone input in Chrome, read aloud, and Markdown export.
5. Run `npm run typecheck` and `npm run build`.
6. Create an empty GitHub repository. In this project directory run:

```powershell
git init -b main
git add .
git commit -m "Initial OmniVoice AI app"
git remote add origin https://github.com/YOUR_USERNAME/omnivoice-ai.git
git push -u origin main
```

7. In Vercel, add a project and import that GitHub repository. Use the Next.js preset and the repository root.
8. Set GEMINI_API_KEY and GEMINI_MODEL=gemini-2.5-flash in Vercel project environment variables for the environments you deploy. Do not use NEXT_PUBLIC_ for the API key. Deploy or redeploy after setting them.
9. Test the deployed app, then replace submission-assets/01-url.txt with the actual URL.
10. Add real screenshots to 05-screenshots and a recording to 06-app-video. The folder includes a 1024 x 1024 PNG icon.
11. Zip only submission-assets using Compress-Archive -Path .\submission-assets\* -DestinationPath .\submission-assets.zip -Force.

The interface lives in app/page.tsx, so an empty components folder is valid. The app needs no .env to render, but Gemini responses require the server API key. Files are limited to 4 MB to fit Vercel function payload limits. Chat history and document text remain in browser localStorage and selected excerpts are sent to Google. The dependency audit reports 13 vulnerabilities (6 moderate, 7 high), including the xlsx parser; review and remediate before public launch. There is no authentication or rate limiting; a public deployment exposes your paid API usage to visitors. Use Vercel deployment protection for a private test or add access controls before a public launch.
