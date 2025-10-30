import { NextRequest, NextResponse } from 'next/server';
import { MovieService } from '@/lib/movie-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Searching movies in database: "${query}"`);

    // Search movies from database
    const movies = await MovieService.searchMovies(query, limit);
    
    console.log(`✅ Found ${movies.length} movies in database`);

    return NextResponse.json({
      movies,
      total: movies.length,
      query
    });
  } catch (error) {
    console.error('❌ Movie search error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🎬 Creating new movie:', body.title);

    // Film zaten var mı kontrol et
    const exists = await MovieService.movieExists(body.title, body.year);
    if (exists) {
      return NextResponse.json(
        { error: 'Movie already exists' },
        { status: 409 }
      );
    }

    const movie = await MovieService.createMovie(body);
    
    console.log('✅ Movie created successfully:', movie.id);

    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    console.error('❌ Movie creation error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}