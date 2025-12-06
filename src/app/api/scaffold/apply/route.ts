import { NextResponse } from 'next/server';
import { createRepository, createOrUpdateFile } from '@/lib/github';

export async function POST(req: Request) {
  try {
    const { name, description, files, create } = (await req.json()) as {
      name: string;
      description?: string;
      files: { path: string; content: string }[];
      create?: boolean; // default true
    };
    if (!name || !files || !Array.isArray(files)) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    // Create repo first (optional)
    if (create !== false) {
      await createRepository({ name, description, private: true });
    }

    // Apply scaffold files
    for (const f of files) {
      await createOrUpdateFile({ repo: name, path: f.path, content: f.content, message: `chore: scaffold ${f.path}` });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: e.message || 'Apply error' }, { status: 500 });
  }
}
