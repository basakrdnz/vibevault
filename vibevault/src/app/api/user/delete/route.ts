import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function DELETE() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Delete all user-related data in correct order (due to foreign key constraints)
    await prisma.$transaction(async (tx) => {
      // Delete mood entries
      await tx.moodEntry.deleteMany({
        where: { userId }
      });

      // Delete movie discoveries
      await tx.movieDiscovery.deleteMany({
        where: { userId }
      });

      // Delete watchlist items
      await tx.watchlistItem.deleteMany({
        where: { userId }
      });

      // Delete sessions
      await tx.session.deleteMany({
        where: { userId }
      });

      // Delete accounts
      await tx.account.deleteMany({
        where: { userId }
      });

      // Finally delete the user
      await tx.user.delete({
        where: { id: userId }
      });
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Account and all associated data have been permanently deleted' 
    });
  } catch (error) {
    console.error('Error deleting user account:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
