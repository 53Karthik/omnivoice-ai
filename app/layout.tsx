import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'OmniVoice AI | Your intelligent companion', description:'Voice AI assistant with Gemini-powered document conversations'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
