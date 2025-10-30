import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Test user count
    const userCount = await prisma.user.count();
    const movieCount = await prisma.movie.count();
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      users: userCount,
      movies: movieCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}