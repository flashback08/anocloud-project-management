'use server';

import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export async function verifyUserContext(emailInput: string): Promise<AuthResponse> {
  try {
    if (!emailInput || !emailInput.includes('@')) {
      return { success: false, error: 'Malformed system profile email structure.' };
    }

    // Direct, optimized query against your live Supabase DB instance
    const dbUser = await prisma.user.findUnique({
      where: {
        email: emailInput.trim().toLowerCase(),
      },
    });

    if (!dbUser) {
      return { success: false, error: 'Identity parameters rejected by data cluster.' };
    }

    return {
      success: true,
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
      },
    };
  } catch (err) {
    console.error('Database connection error details:', err);
    return { success: false, error: 'Internal infrastructure node communication breakdown.' };
  }
}