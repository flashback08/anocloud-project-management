import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { text, taskId, userId } = await request.json();

    // Enforce schema parameters matching 'not null' table rules
    if (!text || !taskId || !userId) {
      return NextResponse.json(
        { error: 'Parameters violation: text, taskId, and userId are required fields.' },
        { status: 400 }
      );
    }

    // Mutate record node directly into public.comments schema
    const comment = await prisma.comment.create({
      data: {
        id: `cmt_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`, // Generate text primary key explicitly
        comment: text,  // Maps cleanly to 'comment' column
        taskId: taskId, // Maps cleanly to 'task_id' relational column
        userId: userId, // Maps cleanly to 'user_id' relational column
      },
      include: {
        user: {
          select: {
            name: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json(comment);
  } catch (err: any) {
    console.error('Supabase Write Exception:', err);
    return NextResponse.json(
      { error: err.message || 'Database record mutation failure across schema boundaries.' },
      { status: 500 }
    );
  }
}