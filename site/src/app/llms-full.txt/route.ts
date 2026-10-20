import { llmsFull } from '@/lib/llms';

// İçerik site.json'dan geliyor; derlemede bir kez üretilir.
export const dynamic = 'force-static';

export function GET() {
  return new Response(llmsFull(), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
