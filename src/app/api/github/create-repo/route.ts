import { createRepository, createOrUpdateFile } from '@/lib/github';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, description, readme } = (await req.json()) as {
      name: string;
      description?: string;
      readme?: string;
    };
    const data = await createRepository({ name, description, private: true });

    if (readme && name) {
      await createOrUpdateFile({
        repo: name,
        path: 'README.md',
        content: readme,
        message: 'docs: add README',
      });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || 'Error creating repository' },
      { status: 500 }
    );
  }
}
