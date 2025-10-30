import { NextRequest, NextResponse } from 'next/server';
import { MovieService } from '@/lib/movie-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category') || 'all';

    console.log(`🎲 Fetching ${limit} random movies from database, category: ${category}`);

    // Get all movies from database
    const allMovies = await MovieService.getAllMovies(1000); // Get all movies for better randomization
    
    if (allMovies.length === 0) {
      console.log('❌ No movies found in database');
      return NextResponse.json({
        success: false,
        movies: [],
        total: 0,
        category,
        error: 'No movies found in database'
      });
    }

    console.log(`📊 Found ${allMovies.length} movies in database`);

    // Filter by category if specified
    let filteredMovies = allMovies;
    if (category !== 'all') {
      filteredMovies = allMovies.filter(movie => 
        movie.genre?.toLowerCase().includes(category.toLowerCase())
      );
      console.log(`🎯 Filtered to ${filteredMovies.length} movies in category: ${category}`);
    }

    // If not enough movies in category, fallback to all movies
    if (filteredMovies.length < limit) {
      console.log(`⚠️ Not enough movies in category, using all ${allMovies.length} movies`);
      filteredMovies = allMovies;
    }

    // Shuffle and select random movies
    const shuffledMovies = shuffleArray([...filteredMovies]);
    const randomMovies = shuffledMovies.slice(0, limit);

    console.log(`✅ Returning ${randomMovies.length} random movies from database`);

    return NextResponse.json({
      success: true,
      movies: randomMovies,
      total: randomMovies.length,
      category,
      source: 'database'
    });
  } catch (error) {
    console.error('❌ Random movies error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
