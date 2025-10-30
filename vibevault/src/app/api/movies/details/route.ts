import { NextRequest, NextResponse } from 'next/server';
import { OMDbAPI } from '@/lib/omdb-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imdbID = searchParams.get('id');

    if (!imdbID) {
      return NextResponse.json(
        { error: 'IMDb ID parameter is required' },
        { status: 400 }
      );
    }

    console.log(`🎬 Getting movie details for IMDb ID: ${imdbID}`);

    const movieDetails = await OMDbAPI.getMovieDetails(imdbID);
    
    console.log(`✅ Retrieved details for: ${movieDetails.Title}`);

    return NextResponse.json(movieDetails);
  } catch (error) {
    console.error('❌ Movie details error:', error);
    
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
