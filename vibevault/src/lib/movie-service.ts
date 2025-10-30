import { prisma } from '@/lib/db';

export interface MovieData {
  title: string;
  year: string;
  genre?: string;
  director?: string;
  plot?: string;
  poster?: string;
  imdbRating?: string;
  runtime?: string;
  language?: string;
  country?: string;
}

export interface MovieSearchResult {
  id: string;
  title: string;
  year: string;
  genre?: string | null;
  director?: string | null;
  plot?: string | null;
  poster?: string | null;
  imdbRating?: string | null;
  runtime?: string | null;
  language?: string | null;
  country?: string | null;
  createdAt: Date;
}

export class MovieService {
  // Film ekleme
  static async createMovie(movieData: MovieData) {
    return await prisma.movie.create({
      data: movieData
    });
  }

  // Film arama
  static async searchMovies(query: string, limit: number = 10): Promise<MovieSearchResult[]> {
    const movies = await prisma.movie.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { director: { contains: query } },
          { genre: { contains: query } },
          { plot: { contains: query } }
        ]
      },
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    return movies;
  }

  // Film detayları
  static async getMovieById(id: string): Promise<MovieSearchResult | null> {
    const movie = await prisma.movie.findUnique({
      where: { id }
    });

    return movie;
  }

  // Film güncelleme
  static async updateMovie(id: string, movieData: Partial<MovieData>) {
    return await prisma.movie.update({
      where: { id },
      data: movieData
    });
  }

  // Film silme
  static async deleteMovie(id: string) {
    return await prisma.movie.delete({
      where: { id }
    });
  }

  // Tüm filmler
  static async getAllMovies(limit: number = 20, offset: number = 0): Promise<MovieSearchResult[]> {
    const movies = await prisma.movie.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' }
    });

    return movies;
  }

  // Popüler filmler (rating'e göre)
  static async getPopularMovies(limit: number = 10): Promise<MovieSearchResult[]> {
    const movies = await prisma.movie.findMany({
      where: {
        imdbRating: { not: null }
      },
      take: limit,
      orderBy: { imdbRating: 'desc' }
    });

    return movies;
  }

  // Yeni eklenen filmler
  static async getRecentMovies(limit: number = 10): Promise<MovieSearchResult[]> {
    const movies = await prisma.movie.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    return movies;
  }

  // Film var mı kontrol et
  static async movieExists(title: string, year: string): Promise<boolean> {
    const movie = await prisma.movie.findFirst({
      where: {
        title: title,
        year: year
      }
    });

    return !!movie;
  }

  // ID'lere göre filmler getir
  static async getMoviesByIds(ids: string[]): Promise<MovieSearchResult[]> {
    const movies = await prisma.movie.findMany({
      where: {
        id: { in: ids }
      },
      orderBy: { createdAt: 'desc' }
    });

    return movies;
  }
}
