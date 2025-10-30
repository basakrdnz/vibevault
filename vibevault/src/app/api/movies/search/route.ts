import { NextRequest, NextResponse } from 'next/server';
import { OMDbAPI } from '@/lib/omdb-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = searchParams.get('page') || '1';

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Searching movies for: "${query}", page: ${page}`);

    const results = await OMDbAPI.searchMovies(query, parseInt(page));
    
    console.log(`✅ Found ${results.Search?.length || 0} movies`);

    return NextResponse.json(results);
  } catch (error) {
    console.error('❌ Movie search error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
