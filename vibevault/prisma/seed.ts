import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const sampleMovies = [
  {
    title: "Inception",
    year: "2010",
    genre: "Action, Sci-Fi, Thriller",
    director: "Christopher Nolan",
    plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    imdbRating: "8.8",
    runtime: "148 min",
    language: "English",
    country: "United States"
  },
  {
    title: "The Matrix",
    year: "1999",
    genre: "Action, Sci-Fi",
    director: "Lana Wachowski, Lilly Wachowski",
    plot: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
    poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    imdbRating: "8.7",
    runtime: "136 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Interstellar",
    year: "2014",
    genre: "Adventure, Drama, Sci-Fi",
    director: "Christopher Nolan",
    plot: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
    poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    imdbRating: "8.6",
    runtime: "169 min",
    language: "English",
    country: "United States"
  },
  {
    title: "The Dark Knight",
    year: "2008",
    genre: "Action, Crime, Drama",
    director: "Christopher Nolan",
    plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
    imdbRating: "9.0",
    runtime: "152 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Pulp Fiction",
    year: "1994",
    genre: "Crime, Drama",
    director: "Quentin Tarantino",
    plot: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    imdbRating: "8.9",
    runtime: "154 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Forrest Gump",
    year: "1994",
    genre: "Drama, Romance",
    director: "Robert Zemeckis",
    plot: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
    poster: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    imdbRating: "8.8",
    runtime: "142 min",
    language: "English",
    country: "United States"
  },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    year: "2001",
    genre: "Action, Adventure, Drama",
    director: "Peter Jackson",
    plot: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
    poster: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTU5MzU@._V1_SX300.jpg",
    imdbRating: "8.8",
    runtime: "178 min",
    language: "English",
    country: "New Zealand"
  },
  {
    title: "The Godfather",
    year: "1972",
    genre: "Crime, Drama",
    director: "Francis Ford Coppola",
    plot: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    imdbRating: "9.2",
    runtime: "175 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Titanic",
    year: "1997",
    genre: "Drama, Romance",
    director: "James Cameron",
    plot: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
    poster: "https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg",
    imdbRating: "7.8",
    runtime: "194 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Avatar",
    year: "2009",
    genre: "Action, Adventure, Fantasy",
    director: "James Cameron",
    plot: "A paraplegic marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
    poster: "https://m.media-amazon.com/images/M/MV5BMTYwOTEwNjAzMl5BMl5BanBnXkFtZTcwODc5MTUwMw@@._V1_SX300.jpg",
    imdbRating: "7.8",
    runtime: "162 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Spider-Man: Into the Spider-Verse",
    year: "2018",
    genre: "Animation, Action, Adventure",
    director: "Bob Persichetti, Peter Ramsey, Rodney Rothman",
    plot: "Teen Miles Morales becomes Spider-Man of his reality, crossing his path with five counterparts from other dimensions to stop a threat for all realities.",
    poster: "https://m.media-amazon.com/images/M/MV5BMjMwNDkxMTgzOF5BMl5BanBnXkFtZTgwNTkwNTQ3NjM@._V1_SX300.jpg",
    imdbRating: "8.4",
    runtime: "117 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Parasite",
    year: "2019",
    genre: "Comedy, Drama, Thriller",
    director: "Bong Joon Ho",
    plot: "A poor family, the Kims, con their way into becoming the servants of a rich family, the Parks. But their easy life gets complicated when their deception is threatened with exposure.",
    poster: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
    imdbRating: "8.5",
    runtime: "132 min",
    language: "Korean",
    country: "South Korea"
  },
  {
    title: "Top Gun: Maverick",
    year: "2022",
    genre: "Action, Drama",
    director: "Joseph Kosinski",
    plot: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.",
    poster: "https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_SX300.jpg",
    imdbRating: "8.3",
    runtime: "131 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Dune",
    year: "2021",
    genre: "Action, Adventure, Drama",
    director: "Denis Villeneuve",
    plot: "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
    poster: "https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg",
    imdbRating: "8.0",
    runtime: "155 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Everything Everywhere All at Once",
    year: "2022",
    genre: "Action, Adventure, Comedy",
    director: "Daniel Kwan, Daniel Scheinert",
    plot: "A middle-aged Chinese immigrant is swept up in an insane adventure in which she alone can save the world by exploring other universes connecting with the lives she could have led.",
    poster: "https://m.media-amazon.com/images/M/MV5BYTdiOTIyZTQtNmQ1OS00NjZlLWIyMTgtYzk5Y2M3ZDVmNjhkXkEyXkFqcGdeQXVyMTAzMDg4NzU0._V1_SX300.jpg",
    imdbRating: "8.1",
    runtime: "139 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Black Panther",
    year: "2018",
    genre: "Action, Adventure, Drama",
    director: "Ryan Coogler",
    plot: "T'Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people into a new future and must confront a challenger from his country's past.",
    poster: "https://m.media-amazon.com/images/M/MV5BMTg1MTY2MjYzNV5BMl5BanBnXkFtZTgwMTc4NTMwNDI@._V1_SX300.jpg",
    imdbRating: "7.3",
    runtime: "134 min",
    language: "English",
    country: "United States"
  },
  {
    title: "La La Land",
    year: "2016",
    genre: "Comedy, Drama, Music",
    director: "Damien Chazelle",
    plot: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
    poster: "https://m.media-amazon.com/images/M/MV5BMzUzNDM2NzM2MV5BMl5BanBnXkFtZTgwNTM3NTg4OTE@._V1_SX300.jpg",
    imdbRating: "8.0",
    runtime: "128 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Get Out",
    year: "2017",
    genre: "Horror, Mystery, Thriller",
    director: "Jordan Peele",
    plot: "A young African-American visits his white girlfriend's parents for the weekend, where his uneasiness about their reception of him eventually reaches a boiling point.",
    poster: "https://m.media-amazon.com/images/M/MV5BMjUxMDQwNjcyNl5BMl5BanBnXkFtZTgwNzcwMzc0MTI@._V1_SX300.jpg",
    imdbRating: "7.7",
    runtime: "104 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Mad Max: Fury Road",
    year: "2015",
    genre: "Action, Adventure, Sci-Fi",
    director: "George Miller",
    plot: "In a post-apocalyptic wasteland, Max teams up with a mysterious woman, Furiousa, to escape from a tyrannical warlord.",
    poster: "https://m.media-amazon.com/images/M/MV5BN2EwM2I5OWMtMGQyMi00Zjg1LWJkNTctZTdjYWM4OGM2NzQzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    imdbRating: "8.1",
    runtime: "120 min",
    language: "English",
    country: "Australia"
  },
  {
    title: "Whiplash",
    year: "2014",
    genre: "Drama, Music",
    director: "Damien Chazelle",
    plot: "A young and ambitious drummer pursues greatness at a cutthroat music conservatory.",
    poster: "https://m.media-amazon.com/images/M/MV5BOTA5NDZlZGUtMjAxOS00YTRkLTkwYmMtYWQ0NWEwZDZiNjEzXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    imdbRating: "8.5",
    runtime: "106 min",
    language: "English",
    country: "United States"
  },
  {
    title: "The Shawshank Redemption",
    year: "1994",
    genre: "Drama",
    director: "Frank Darabont",
    plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    poster: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    imdbRating: "9.3",
    runtime: "142 min",
    language: "English",
    country: "United States"
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    year: "2003",
    genre: "Action, Adventure, Drama",
    director: "Peter Jackson",
    plot: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
    poster: "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    imdbRating: "9.0",
    runtime: "201 min",
    language: "English",
    country: "New Zealand"
  },
  {
    title: "Pulp Fiction",
    year: "1994",
    genre: "Crime, Drama",
    director: "Quentin Tarantino",
    plot: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    imdbRating: "8.9",
    runtime: "154 min",
    language: "English",
    country: "United States"
  },
  {
    title: "The Good, the Bad and the Ugly",
    year: "1966",
    genre: "Western",
    director: "Sergio Leone",
    plot: "A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.",
    poster: "https://m.media-amazon.com/images/M/MV5BOTQ5NDI3MTI4MF5BMl5BanBnXkFtZTgwNDQ4ODE5MDE@._V1_SX300.jpg",
    imdbRating: "8.8",
    runtime: "178 min",
    language: "Italian",
    country: "Italy"
  },
  {
    title: "Fight Club",
    year: "1999",
    genre: "Drama",
    director: "David Fincher",
    plot: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    poster: "https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    imdbRating: "8.8",
    runtime: "139 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Forrest Gump",
    year: "1994",
    genre: "Drama, Romance",
    director: "Robert Zemeckis",
    plot: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
    poster: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    imdbRating: "8.8",
    runtime: "142 min",
    language: "English",
    country: "United States"
  },
  {
    title: "The Matrix Reloaded",
    year: "2003",
    genre: "Action, Sci-Fi",
    director: "Lana Wachowski, Lilly Wachowski",
    plot: "Neo and the rebel leaders estimate they have 72 hours until 250,000 probes discover Zion and destroy it and its inhabitants. During this, Neo must decide how he can save Trinity from a dark fate in his dreams.",
    poster: "https://m.media-amazon.com/images/M/MV5BODE0MzZhZTgtYzkwYi00YmI5LThlZWYtOWRmNWE5ODk0NzMxXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    imdbRating: "7.2",
    runtime: "138 min",
    language: "English",
    country: "United States"
  },
  {
    title: "The Matrix Revolutions",
    year: "2003",
    genre: "Action, Sci-Fi",
    director: "Lana Wachowski, Lilly Wachowski",
    plot: "The human city of Zion defends itself against the massive invasion of the machines as Neo fights to end the war at another front while also opposing the rogue Agent Smith.",
    poster: "https://m.media-amazon.com/images/M/MV5BNzNlZTZjMDctZGY2Yi00N2M3LThkYmEtZmE0NGY1OTNkMWU2XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    imdbRating: "6.8",
    runtime: "129 min",
    language: "English",
    country: "United States"
  },
  {
    title: "The Dark Knight Rises",
    year: "2012",
    genre: "Action, Crime, Drama",
    director: "Christopher Nolan",
    plot: "Eight years after the Joker's reign of anarchy, Batman, with the help of the enigmatic Catwoman, is forced from his exile to save Gotham City from the brutal guerrilla terrorist Bane.",
    poster: "https://m.media-amazon.com/images/M/MV5BMTk4ODQzNDY3Ml5BMl5BanBnXkFtZTcwODA0NTM4Nw@@._V1_SX300.jpg",
    imdbRating: "8.4",
    runtime: "164 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Inception",
    year: "2010",
    genre: "Action, Sci-Fi, Thriller",
    director: "Christopher Nolan",
    plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    imdbRating: "8.8",
    runtime: "148 min",
    language: "English",
    country: "United States"
  },
  {
    title: "The Avengers",
    year: "2012",
    genre: "Action, Adventure, Sci-Fi",
    director: "Joss Whedon",
    plot: "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
    poster: "https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    imdbRating: "8.0",
    runtime: "143 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Iron Man",
    year: "2008",
    genre: "Action, Adventure, Sci-Fi",
    director: "Jon Favreau",
    plot: "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.",
    poster: "https://m.media-amazon.com/images/M/MV5BMTczNTI2ODUwOF5BMl5BanBnXkFtZTcwMTU0NTIzMw@@._V1_SX300.jpg",
    imdbRating: "7.9",
    runtime: "126 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Captain America: The First Avenger",
    year: "2011",
    genre: "Action, Adventure, Sci-Fi",
    director: "Joe Johnston",
    plot: "Steve Rogers, a rejected military soldier, transforms into Captain America after taking a dose of a 'Super-Soldier serum'. But being Captain America comes at a price as he attempts to take down a war monger and a terrorist organization.",
    poster: "https://m.media-amazon.com/images/M/MV5BMTYzOTc2NzU3N15BMl5BanBnXkFtZTcwNjY3MDA3NQ@@._V1_SX300.jpg",
    imdbRating: "6.9",
    runtime: "124 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Thor",
    year: "2011",
    genre: "Action, Adventure, Fantasy",
    director: "Kenneth Branagh",
    plot: "The powerful but arrogant god Thor is cast out of Asgard to live amongst humans in Midgard (Earth), where he soon becomes one of their finest defenders.",
    poster: "https://m.media-amazon.com/images/M/MV5BOGE4NzU1YTAtNzA3Mi00ZTA2LTg2YmYtMDJmMThiMjlkYjg2XkEyXkFqcGdeQXVyNTgzMDMzMTg@._V1_SX300.jpg",
    imdbRating: "7.0",
    runtime: "115 min",
    language: "English",
    country: "United States"
  },
  {
    title: "The Incredible Hulk",
    year: "2008",
    genre: "Action, Adventure, Sci-Fi",
    director: "Louis Leterrier",
    plot: "Bruce Banner, a scientist on the run from the U.S. Government, must find a cure for the monster he turns into whenever he loses his temper.",
    poster: "https://m.media-amazon.com/images/M/MV5BMTUyNzk3MjA1OF5BMl5BanBnXkFtZTcwMTE1Njg2MQ@@._V1_SX300.jpg",
    imdbRating: "6.7",
    runtime: "112 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Spider-Man",
    year: "2002",
    genre: "Action, Adventure, Sci-Fi",
    director: "Sam Raimi",
    plot: "When bitten by a genetically modified spider, a nerdy, shy, and awkward high school student gains spider-like abilities that he eventually must use to fight evil as a superhero after tragedy befalls his family.",
    poster: "https://m.media-amazon.com/images/M/MV5BZDEyN2NhMjgtMjdhNi00MmNlLWE5YTgtZGE4MzNjMTRlMGEwXkEyXkFqcGdeQXVyNDUyOTg3Njg@._V1_SX300.jpg",
    imdbRating: "7.4",
    runtime: "121 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Spider-Man 2",
    year: "2004",
    genre: "Action, Adventure, Sci-Fi",
    director: "Sam Raimi",
    plot: "Peter Parker is beset with troubles in his failing personal life as he battles a former brilliant scientist named Otto Octavius.",
    poster: "https://m.media-amazon.com/images/M/MV5BMzY2ODk4NmUtOTVmNi00ZTdkLTlmOWYtMmE2OWVhNTU2OTVkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    imdbRating: "7.3",
    runtime: "127 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Spider-Man 3",
    year: "2007",
    genre: "Action, Adventure, Sci-Fi",
    director: "Sam Raimi",
    plot: "A strange black entity from another world bonds with Peter Parker and causes inner turmoil as he contends with new villains, temptations, and revenge.",
    poster: "https://m.media-amazon.com/images/M/MV5BYTk3MDljOWQtNGI2My00OTEzLTlhYjQtOTQ4ODM2MzUwY2IwXkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_SX300.jpg",
    imdbRating: "6.2",
    runtime: "139 min",
    language: "English",
    country: "United States"
  },
  {
    title: "The Amazing Spider-Man",
    year: "2012",
    genre: "Action, Adventure, Sci-Fi",
    director: "Marc Webb",
    plot: "After Peter Parker is bitten by a genetically altered spider, he gains newfound, spider-like powers and ventures out to save the city from the machinations of a mysterious reptilian foe.",
    poster: "https://m.media-amazon.com/images/M/MV5BMjMyOTM4MDMxNV5BMl5BanBnXkFtZTcwNjIyNzExOA@@._V1_SX300.jpg",
    imdbRating: "6.9",
    runtime: "136 min",
    language: "English",
    country: "United States"
  },
  {
    title: "The Amazing Spider-Man 2",
    year: "2014",
    genre: "Action, Adventure, Sci-Fi",
    director: "Marc Webb",
    plot: "When New York is put under siege by Oscorp, it is up to Spider-Man to save the city he swore to protect as well as his loved ones.",
    poster: "https://m.media-amazon.com/images/M/MV5BOTA5NDYxNTg0OV5BMl5BanBnXkFtZTgwODE5NzU1MTE@._V1_SX300.jpg",
    imdbRating: "6.6",
    runtime: "142 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Spider-Man: Homecoming",
    year: "2017",
    genre: "Action, Adventure, Sci-Fi",
    director: "Jon Watts",
    plot: "Peter Parker balances his life as an ordinary high school student in Queens with his superhero alter-ego Spider-Man, and finds himself on the trail of a new menace prowling the skies of New York City.",
    poster: "https://m.media-amazon.com/images/M/MV5BNTk4ODQ1MzgzNl5BMl5BanBnXkFtZTgwMTMyMzM4MTI@._V1_SX300.jpg",
    imdbRating: "7.4",
    runtime: "133 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Spider-Man: Far From Home",
    year: "2019",
    genre: "Action, Adventure, Sci-Fi",
    director: "Jon Watts",
    plot: "Following the events of Avengers: Endgame, Spider-Man must step up to take on new threats in a world that has changed forever.",
    poster: "https://m.media-amazon.com/images/M/MV5BMGZlNTY1ZWUtYTMzNC00ZjUyLWE0MjQtMTMxN2E3ODYxMWVmXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg",
    imdbRating: "7.4",
    runtime: "129 min",
    language: "English",
    country: "United States"
  },
  {
    title: "Spider-Man: No Way Home",
    year: "2021",
    genre: "Action, Adventure, Fantasy",
    director: "Jon Watts",
    plot: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.",
    poster: "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYzgtM2YwNy00ZmVlLTgyYmQtZjU5ZGIzY2Y3MjQzXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg",
    imdbRating: "8.2",
    runtime: "148 min",
    language: "English",
    country: "United States"
  }
];

async function seedUsers() {
  console.log('👤 Starting to seed users...');
  
  try {
    const testUser = await prisma.user.findFirst({
      where: { email: 'test@example.com' }
    });

    if (!testUser) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: hashedPassword,
          name: 'Test User'
        }
      });
      console.log('✅ Added test user: test@example.com / password123');
    } else {
      console.log('⏭️ Test user already exists');
    }
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
}

async function seedMovies() {
  console.log('🎬 Starting to seed movies...');
  
  try {
    for (const movie of sampleMovies) {
      const existingMovie = await prisma.movie.findFirst({
        where: {
          title: movie.title,
          year: movie.year
        }
      });

      if (!existingMovie) {
        await prisma.movie.create({
          data: movie
        });
        console.log(`✅ Added: ${movie.title} (${movie.year})`);
      } else {
        console.log(`⏭️ Skipped: ${movie.title} (${movie.year}) - already exists`);
      }
    }

    const totalMovies = await prisma.movie.count();
    console.log(`🎉 Seeding complete! Total movies in database: ${totalMovies}`);
  } catch (error) {
    console.error('❌ Error seeding movies:', error);
  }
}

async function seedMoodEntries() {
  console.log('💭 Starting to seed mood entries...');
  
  try {
    // Get test user and some movies
    const testUser = await prisma.user.findFirst({
      where: { email: 'test@example.com' }
    });

    const movies = await prisma.movie.findMany({
      take: 5
    });

    if (!testUser || movies.length === 0) {
      console.log('⏭️ Skipping mood entries - no test user or movies found');
      return;
    }

    // Add sample mood entries
    const moodEntries = [
      { movieId: movies[0].id, mood: 'Excited', intensity: 9 },
      { movieId: movies[0].id, mood: 'Excited', intensity: 8 },
      { movieId: movies[0].id, mood: 'Happy', intensity: 7 },
      { movieId: movies[0].id, mood: 'Excited', intensity: 9 },
      { movieId: movies[0].id, mood: 'Happy', intensity: 8 },
      { movieId: movies[0].id, mood: 'Inspired', intensity: 8 },
      
      { movieId: movies[1].id, mood: 'Scared', intensity: 8 },
      { movieId: movies[1].id, mood: 'Excited', intensity: 9 },
      { movieId: movies[1].id, mood: 'Scared', intensity: 7 },
      { movieId: movies[1].id, mood: 'Excited', intensity: 8 },
      { movieId: movies[1].id, mood: 'Curious', intensity: 7 },
      
      { movieId: movies[2].id, mood: 'Nostalgic', intensity: 8 },
      { movieId: movies[2].id, mood: 'Sad', intensity: 7 },
      { movieId: movies[2].id, mood: 'Nostalgic', intensity: 9 },
      { movieId: movies[2].id, mood: 'Melancholic', intensity: 8 },
      { movieId: movies[2].id, mood: 'Nostalgic', intensity: 7 },
    ];

    for (const entry of moodEntries) {
      await prisma.moodEntry.create({
        data: {
          userId: testUser.id,
          movieId: entry.movieId,
          mood: entry.mood,
          intensity: entry.intensity,
          notes: `Sample mood entry for testing`
        }
      });
    }

    console.log(`✅ Added ${moodEntries.length} mood entries`);
  } catch (error) {
    console.error('❌ Error seeding mood entries:', error);
  }
}

async function main() {
  await seedUsers();
  await seedMovies();
  await seedMoodEntries();
  await prisma.$disconnect();
}

main();
