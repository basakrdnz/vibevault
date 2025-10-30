import { NextRequest, NextResponse } from 'next/server';
import { MovieService } from '@/lib/movie-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log(`🎬 Getting movie details for ID: ${id}`);

    const movie = await MovieService.getMovieById(id);
    
    if (!movie) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      );
    }

    console.log(`✅ Retrieved details for: ${movie.title}`);

    return NextResponse.json(movie);
  } catch (error) {
    console.error('❌ Movie details error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    console.log(`🎬 Updating movie: ${id}`);

    const movie = await MovieService.updateMovie(id, body);
    
    console.log(`✅ Movie updated successfully: ${movie.title}`);

    return NextResponse.json(movie);
  } catch (error) {
    console.error('❌ Movie update error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log(`🎬 Deleting movie: ${id}`);

    await MovieService.deleteMovie(id);
    
    console.log(`✅ Movie deleted successfully: ${id}`);

    return NextResponse.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('❌ Movie deletion error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
