const OMDB_API_KEY = process.env.OMDB_API_KEY || 'demo';

export interface MovieSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface MovieDetails extends MovieSearchResult {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export class OMDbAPI {
  private static baseUrl = 'https://www.omdbapi.com/';

  static async searchMovies(query: string, page: number = 1): Promise<{
    Search: MovieSearchResult[];
    totalResults: string;
    Response: string;
  }> {
    // Demo mode - return mock data
    if (OMDB_API_KEY === 'demo') {
      return {
        Search: [
          {
            Title: "Inception",
            Year: "2010",
            imdbID: "tt1375666",
            Type: "movie",
            Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg"
          },
          {
            Title: "The Matrix",
            Year: "1999",
            imdbID: "tt0133093",
            Type: "movie",
            Poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg"
          },
          {
            Title: "Interstellar",
            Year: "2014",
            imdbID: "tt0816692",
            Type: "movie",
            Poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg"
          }
        ],
        totalResults: "3",
        Response: "True"
      };
    }

    if (!OMDB_API_KEY) {
      throw new Error('OMDb API key is not configured');
    }

    const params = new URLSearchParams({
      apikey: OMDB_API_KEY,
      s: query,
      page: page.toString(),
      type: 'movie'
    });

    const response = await fetch(`${this.baseUrl}?${params}`);
    
    if (!response.ok) {
      throw new Error(`OMDb API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.Response === 'False') {
      throw new Error(data.Error || 'No movies found');
    }

    return data;
  }

  static async getMovieDetails(imdbID: string): Promise<MovieDetails> {
    // Demo mode - return mock data
    if (OMDB_API_KEY === 'demo') {
      const mockMovies: Record<string, MovieDetails> = {
        'tt1375666': {
          Title: "Inception",
          Year: "2010",
          imdbID: "tt1375666",
          Type: "movie",
          Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
          Rated: "PG-13",
          Released: "16 Jul 2010",
          Runtime: "148 min",
          Genre: "Action, Sci-Fi, Thriller",
          Director: "Christopher Nolan",
          Writer: "Christopher Nolan",
          Actors: "Leonardo DiCaprio, Marion Cotillard, Tom Hardy",
          Plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
          Language: "English, Japanese, French",
          Country: "United States, United Kingdom",
          Awards: "Won 4 Oscars. 157 wins & 220 nominations total",
          Ratings: [
            { Source: "Internet Movie Database", Value: "8.8/10" },
            { Source: "Rotten Tomatoes", Value: "87%" },
            { Source: "Metacritic", Value: "74/100" }
          ],
          Metascore: "74",
          imdbRating: "8.8",
          imdbVotes: "2,500,000",
          DVD: "07 Dec 2010",
          BoxOffice: "$292,576,195",
          Production: "N/A",
          Website: "N/A",
          Response: "True"
        },
        'tt0133093': {
          Title: "The Matrix",
          Year: "1999",
          imdbID: "tt0133093",
          Type: "movie",
          Poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
          Rated: "R",
          Released: "31 Mar 1999",
          Runtime: "136 min",
          Genre: "Action, Sci-Fi",
          Director: "Lana Wachowski, Lilly Wachowski",
          Writer: "Lilly Wachowski, Lana Wachowski",
          Actors: "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
          Plot: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
          Language: "English",
          Country: "United States, Australia",
          Awards: "Won 4 Oscars. 42 wins & 52 nominations total",
          Ratings: [
            { Source: "Internet Movie Database", Value: "8.7/10" },
            { Source: "Rotten Tomatoes", Value: "88%" },
            { Source: "Metacritic", Value: "73/100" }
          ],
          Metascore: "73",
          imdbRating: "8.7",
          imdbVotes: "1,900,000",
          DVD: "21 Sep 1999",
          BoxOffice: "$171,479,930",
          Production: "N/A",
          Website: "N/A",
          Response: "True"
        },
        'tt0816692': {
          Title: "Interstellar",
          Year: "2014",
          imdbID: "tt0816692",
          Type: "movie",
          Poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
          Rated: "PG-13",
          Released: "07 Nov 2014",
          Runtime: "169 min",
          Genre: "Adventure, Drama, Sci-Fi",
          Director: "Christopher Nolan",
          Writer: "Jonathan Nolan, Christopher Nolan",
          Actors: "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
          Plot: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
          Language: "English",
          Country: "United States, United Kingdom, Canada",
          Awards: "Won 1 Oscar. 44 wins & 148 nominations total",
          Ratings: [
            { Source: "Internet Movie Database", Value: "8.6/10" },
            { Source: "Rotten Tomatoes", Value: "73%" },
            { Source: "Metacritic", Value: "74/100" }
          ],
          Metascore: "74",
          imdbRating: "8.6",
          imdbVotes: "1,800,000",
          DVD: "31 Mar 2015",
          BoxOffice: "$188,020,017",
          Production: "N/A",
          Website: "N/A",
          Response: "True"
        }
      };

      const movie = mockMovies[imdbID];
      if (!movie) {
        throw new Error('Movie not found');
      }
      return movie;
    }

    if (!OMDB_API_KEY) {
      throw new Error('OMDb API key is not configured');
    }

    const params = new URLSearchParams({
      apikey: OMDB_API_KEY,
      i: imdbID,
      plot: 'full'
    });

    const response = await fetch(`${this.baseUrl}?${params}`);
    
    if (!response.ok) {
      throw new Error(`OMDb API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.Response === 'False') {
      throw new Error(data.Error || 'Movie not found');
    }

    return data;
  }
}
