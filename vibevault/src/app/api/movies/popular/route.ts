import { NextRequest, NextResponse } from 'next/server';
import { MovieService } from '@/lib/movie-service';
import { CacheService } from '@/lib/cache-service';

export async function GET(request: NextRequest) {
  try {
    console.log('🎬 Fetching spotlight movies...');

    // Check cache first
    const cachedMovieIds = await CacheService.getPopularMoviesCache();
    
    if (cachedMovieIds) {
      // Get movies from cache
      const movies = await MovieService.getMoviesByIds(cachedMovieIds);
      console.log(`✅ Returning ${movies.length} cached spotlight movies`);
      
      return NextResponse.json({
        success: true,
        movies: movies,
        cached: true,
        cacheAge: 'fresh'
      });
    }

    // Cache miss or expired - generate new spotlight movies
    console.log('🔄 Cache miss - generating new spotlight movies');
    
    // Get all movies and select popular ones (high rated, recent, etc.)
    const allMovies = await MovieService.getAllMovies(1000);
    
    if (allMovies.length === 0) {
      console.log('❌ No movies found in database');
      return NextResponse.json({
        success: false,
        movies: [],
        error: 'No movies found in database'
      });
    }

    // Filter and sort for spotlight movies
    const spotlightMovies = allMovies
      .filter(movie => {
        // Filter criteria for spotlight movies
        const rating = parseFloat(movie.imdbRating || '0');
        const year = parseInt(movie.year || '0');
        const currentYear = new Date().getFullYear();
        
        return rating >= 7.0 || year >= currentYear - 5; // High rated or recent
      })
      .sort((a, b) => {
        // Sort by rating first, then by year
        const ratingA = parseFloat(a.imdbRating || '0');
        const ratingB = parseFloat(b.imdbRating || '0');
        
        if (ratingA !== ratingB) {
          return ratingB - ratingA; // Higher rating first
        }
        
        const yearA = parseInt(a.year || '0');
        const yearB = parseInt(b.year || '0');
        return yearB - yearA; // Newer first
      })
      .slice(0, 3); // Top 3 spotlight movies

    // Cache the results
    const movieIds = spotlightMovies.map(movie => movie.id);
    await CacheService.setPopularMoviesCache(movieIds);

    console.log(`✅ Generated and cached ${spotlightMovies.length} spotlight movies`);

    return NextResponse.json({
      success: true,
      movies: spotlightMovies,
      cached: false,
      cacheAge: 'new'
    });
  } catch (error) {
    console.error('❌ Error fetching spotlight movies:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch spotlight movies' },
      { status: 500 }
    );
  }
}
