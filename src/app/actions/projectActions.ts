'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Purge a project row out of public.projects and broadcast an immutable telemetry trace
 */
export async function deleteProjectAction(formData: FormData) {
  const projectId = formData.get('projectId') as string;
  const operatorId = formData.get('operatorId') as string;

  if (!projectId || !operatorId) {
    throw new Error('Required execution coordinates missing from payload pipeline.');
  }

  try {
    // 1. Fetch targeted project details prior to record purge to preserve metadata for the log stream
    const projectTarget = await prisma.project.findUnique({
      where: { id: projectId },
      select: { name: true }
    });

    if (!projectTarget) return;

    // 2. Clear out the targeted project row (triggers Cascade rules on foreign constraints)
    await prisma.project.delete({
      where: { id: projectId }
    });

    // 3. Compile system event log entry directly into public.activity_logs
    await prisma.activityLog.create({
      data: {
        id: `act_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`,
        userId: operatorId,
        action: `Deleted project matrix environment "${projectTarget.name}"`,
        entityType: 'PROJECT',
        entityId: projectId
      }
    });

    // 4. Force Next.js Router cache to flush and sync UI records instantly
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/projects');
  } catch (err: any) {
    console.error('Failed to complete project row purge:', err);
    throw new Error(err.message || 'Database write rejection encountered.');
  }
}
