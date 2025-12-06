import { NextResponse } from 'next/server';
import { generateScaffold } from '@/lib/scaffold';

export async function POST(req: Request) {
  try {
    const { productName, requirements, todos, readme } = (await req.json()) as {
      productName: string;
      requirements: string;
      todos: string;
      readme: string;
    };

    const files = generateScaffold({
      productName,
      requirementsMd: requirements,
      todosMd: todos,
      readmeMd: readme,
    });

    return NextResponse.json({ files });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: e.message || 'Preview error' }, { status: 500 });
  }
}

