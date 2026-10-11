export type Message = { id: string; role: 'user' | 'assistant'; content: string; timestamp: number; citations?: string[] };
export type DocumentRecord = { id: string; name: string; text: string; size: number; pages?: number; uploadedAt: number };
export type Thread = { id: string; title: string; messages: Message[]; documents: DocumentRecord[]; updatedAt: number };
