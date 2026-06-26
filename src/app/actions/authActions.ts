'use server';

import { prisma } from '@/lib/prisma';
import { ProjectStatus, TaskPriority, TaskStatus, UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * 🛠️ Helper: Append row to activity_logs table
 */
async function logActivity(userId: string, action: string, entityType: string, entityId: string) {
  try {
    await prisma.activityLog.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        action,
        entityType,
        entityId
      }
    });
  } catch (err) {
    console.error('Audit logger failure:', err);
  }
}

/**
 * 🔐 Action 1: Register Account via Landing Page (public.users Schema)
 */
export async function registerAccountAction(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as UserRole;

  if (!id || !name || !email) return { success: false, error: 'Missing required field arrays.' };

  try {
    const existing = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (existing) return { success: false, error: 'Email constraint violation. Key exists.' };

    const user = await prisma.user.create({
      data: {
        id: id.trim(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: role || 'MEMBER'
      }
    });

    await logActivity(user.id, 'USER_REGISTERED', 'USER', user.id);

    const cookieStore = await cookies();
    cookieStore.set('active_session_email', user.email, { path: '/' });

    return { success: true };
  } catch (error) {
    console.error('Registration failed:', error);
    return { success: false, error: 'Database verification failure.' };
  }
}

/**
 * 🔐 Action 2: Existing Login Context Verification
 */
export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  if (!email) return { success: false, error: 'Email input required.' };

  try {
    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!user) return { success: false, error: 'Identity credentials rejected.' };

    await logActivity(user.id, 'USER_LOGIN', 'USER', user.id);

    const cookieStore = await cookies();
    cookieStore.set('active_session_email', user.email, { path: '/' });

    return { success: true };
  } catch (error) {
    return { success: false, error: 'System connection drop.' };
  }
}

/**
 * 🚪 Action 3: Clear Active Session Context (Logout)
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  const email = cookieStore.get('active_session_email')?.value;

  if (email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await logActivity(user.id, 'USER_LOGOUT', 'USER', user.id);
    }
  }

  cookieStore.delete('active_session_email');
  redirect('/');
}

/**
 * 🏗️ Action 4: Deploy Project Matrix Row
 */
export async function createProjectAction(formData: FormData): Promise<void> {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;
  const status = formData.get('status') as ProjectStatus;
  const createdBy = formData.get('createdBy') as string;

  if (!name || !createdBy) return;

  try {
    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'NOT_STARTED',
        createdById: createdBy,
      },
    });

    await logActivity(createdBy, 'CREATE_PROJECT', 'PROJECT', project.id);
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Failed to commit project row:', error);
  }
}

/**
 * 👥 Action 5: Create User Row (Restored for DashboardClient.tsx compatibility)
 */
export async function createUserAction(formData: FormData): Promise<void> {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as UserRole;
  const operatorId = formData.get('operatorId') as string;

  if (!id || !name || !email) return;

  try {
    const user = await prisma.user.create({
      data: {
        id: id.trim(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: role || 'MEMBER',
      },
    });

    if (operatorId) {
      await logActivity(operatorId, 'CREATE_USER_NODE', 'USER', user.id);
    }
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Failed to insert user profile entry:', error);
  }
}

/**
 * 🗑️ Action 6: Delete User Row (Restored for DashboardClient.tsx compatibility)
 */
export async function deleteUserAction(formData: FormData): Promise<void> {
  const userId = formData.get('userId') as string;
  const operatorId = formData.get('operatorId') as string;
  
  if (!userId) return;

  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    
    if (operatorId) {
      await logActivity(operatorId, 'DELETE_USER_NODE', 'USER', userId);
    }
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Failed to remove user node:', error);
  }
}

/**
 * 📝 Action 7: Task Commit Row Linkage
 */
export async function createTaskAction(formData: FormData): Promise<void> {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const status = formData.get('status') as TaskStatus; 
  const priority = formData.get('priority') as TaskPriority;
  const assignedTo = formData.get('assignedTo') as string;
  const dueDate = formData.get('dueDate') as string;
  const projectId = formData.get('projectId') as string;
  const operatorId = formData.get('operatorId') as string;

  if (!title || !projectId) return;

  try {
    const task = await prisma.task.create({
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

    if (operatorId) {
      await logActivity(operatorId, 'CREATE_TASK', 'TASK', task.id);
    }
    revalidatePath(`/dashboard/projects/${projectId}`);
  } catch (error) {
    console.error('Prisma Task Insertion Failure:', error);
  }
}

/**
 * 🗑️ Action 8: Drop Task Row Entity
 */
export async function deleteTaskAction(formData: FormData): Promise<void> {
  const taskId = formData.get('taskId') as string;
  const projectId = formData.get('projectId') as string;
  const operatorId = formData.get('operatorId') as string;

  if (!taskId || !projectId) return;

  try {
    await prisma.task.delete({ where: { id: taskId } });
    if (operatorId) {
      await logActivity(operatorId, 'DELETE_TASK', 'TASK', taskId);
    }
    revalidatePath(`/dashboard/projects/${projectId}`);
  } catch (error) {
    console.error('Failed to drop task row entity:', error);
  }
}

/**
 * 💬 Action 9: Inject Comment Row
 */
export async function createCommentAction(formData: FormData): Promise<void> {
  const taskId = formData.get('taskId') as string;
  const userId = formData.get('userId') as string;
  const commentText = formData.get('comment') as string;
  const projectId = formData.get('projectId') as string;

  if (!taskId || !userId || !commentText) return;

  try {
    const comment = await prisma.comment.create({
      data: {
        id: crypto.randomUUID(),
        taskId: taskId,
        userId: userId,
        comment: commentText.trim(),
      },
    });

    await logActivity(userId, 'CREATE_COMMENT', 'COMMENT', comment.id);
    revalidatePath(`/dashboard/projects/${projectId}`);
  } catch (error) {
    console.error('Failed to commit comment row context:', error);
  }
}

/**
 * 🗑️ Action 10: Purge Comment row
 */
export async function deleteCommentAction(formData: FormData): Promise<void> {
  const commentId = formData.get('commentId') as string;
  const projectId = formData.get('projectId') as string;
  const operatorId = formData.get('operatorId') as string;

  if (!commentId) return;

  try {
    await prisma.comment.delete({ where: { id: commentId } });
    if (operatorId) {
      await logActivity(operatorId, 'DELETE_COMMENT', 'COMMENT', commentId);
    }
    revalidatePath(`/dashboard/projects/${projectId}`);
  } catch (error) {
    console.error('Schema extraction error during comment deletion phase:', error);
  }
}