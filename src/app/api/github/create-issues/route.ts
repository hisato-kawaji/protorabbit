import { NextResponse } from 'next/server';
import { getOctokit, getRepoOwner } from '@/lib/github';

function stripCodeBlocks(md: string) {
  return md.replace(/```[\s\S]*?```/g, '');
}

function parseTodos(md: string): { title: string; body?: string }[] {
  const cleaned = stripCodeBlocks(md || '');
  const lines = cleaned.split(/\r?\n/);
  const tasks: { title: string; body?: string }[] = [];

  // 1) チェックボックス形式を優先的に取得 (- [ ] / - [x] / * [ ] ...)
  for (const line of lines) {
    const m = line.match(/^\s*[-*]\s*\[(?:\s|x|X)\]\s*(.+)$/);
    if (m) tasks.push({ title: m[1].trim() });
  }
  if (tasks.length > 0) return tasks;

  // 2) 通常の箇条書き (- Task / * Task)
  for (const line of lines) {
    if (/^\s*[-*]\s+\S/.test(line)) {
      const t = line.replace(/^\s*[-*]\s+/, '').trim();
      if (t) tasks.push({ title: t });
    }
  }
  if (tasks.length > 0) return tasks;

  // 3) 番号付き (1. Task)
  for (const line of lines) {
    const m = line.match(/^\s*\d+\.\s+(.+)$/);
    if (m) tasks.push({ title: m[1].trim() });
  }
  return tasks;
}

export async function POST(req: Request) {
  try {
    const { name, todos } = (await req.json()) as { name: string; todos: string };
    if (!name || !todos) return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });

    const client = await getOctokit();
    const owner = await getRepoOwner();
    const tasks = parseTodos(todos);
    const urls: string[] = [];
    for (const t of tasks) {
      const res = await client.issues.create({ owner, repo: name, title: t.title, body: t.body });
      urls.push(res.data.html_url);
    }
    return NextResponse.json({ count: urls.length, urls });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: e.message || 'Issues error' }, { status: 500 });
  }
}
