'use server';

import { prisma } from '@/lib/prisma';
import { ProjectStatus, TaskPriority, TaskStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

/**
 * 🏗️ Action 1: Write complete project blueprint to Supabase
 */
export async function createProjectAction(formData: FormData): Promise<void> {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;
  const status = formData.get('status') as ProjectStatus;
  const createdById = formData.get('createdById') as string;

  if (!name || !createdById) return;

  try {
    await prisma.project.create({
      data: {
        name,
        description: description || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'NOT_STARTED',
        createdById: createdById,
      },
    });
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Failed to commit project row:', error);
  }
}

/**
 * 📝 Action 2: Write a task row conforming explicitly to the Task schema
 */
export async function createTaskAction(formData: FormData): Promise<void> {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const status = formData.get('status') as TaskStatus; 
  const priority = formData.get('priority') as TaskPriority;
  const assignedTo = formData.get('assignedTo') as string;
  const dueDate = formData.get('dueDate') as string;
  const projectId = formData.get('projectId') as string;

  if (!title || !projectId) {
    console.error('Critical mismatch: Task requires a Title and parent Project ID.');
    return;
  }

  try {
    await prisma.task.create({
      data: {
        title,
        description: description || null,
        status: status || 'TO_DO',
        priority: priority || 'MEDIUM',
        assignedTo: assignedTo && assignedTo !== 'UNASSIGNED' ? assignedTo : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: projectId,
      },
    });

    // Revalidate the workspace layout parameters cache dynamically
    revalidatePath(`/dashboard/projects/${projectId}`);
  } catch (error) {
    console.error('Prisma Task Insertion Engine Failure:', error);
  }
}