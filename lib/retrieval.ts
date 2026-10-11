import type { DocumentRecord } from './types';
export type Excerpt = { source: string; chunk: string; score: number };
const words = (s: string) => new Set((s.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) ?? []).filter(w => !['this','that','what','from','with','about','which','there','have','report','document','tell','please'].includes(w)));
export function findRelevant(question: string, docs: DocumentRecord[], limit = 9): Excerpt[] {
  const query = words(question);
  const broad = /summari[sz]e|overview|entire|whole|main findings|key points/i.test(question);
  const all: Excerpt[] = [];
  for (const doc of docs) {
    const sections = doc.text.split(/(?=\[Page \d+\])/g);
    for (const section of sections) {
      for (let start = 0; start < section.length; start += 2400) {
        const chunk = section.slice(start, start + 3000).trim();
        if (!chunk) continue;
        const page = section.match(/^\[Page (\d+)\]/)?.[1];
        const tokens = words(chunk);
        let score = 0;
        for (const token of query) if (tokens.has(token)) score += 1;
        all.push({ source: `${doc.name}${page ? `, page ${page}` : ''}`, chunk, score });
      }
    }
  }
  all.sort((a, b) => (b.score - a.score));
  if (broad) return all.filter((_, i) => i % Math.max(1, Math.floor(all.length / limit)) === 0).slice(0, limit);
  return all.slice(0, limit);
}
