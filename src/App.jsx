import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";
import "./App.css";
import logo from "./assets/logo.png";
import Modal from "./Modal";
import TrailerModal from "./TrailerModal";

const TMDB_API_KEY = "19517c2997a6f18d7a87adee2d219374"; // Replace with your TMDB API key
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

function App() {
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [posters, setPosters] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [showRotateSlider, setShowRotateSlider] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('');

  const predefinedGenres = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' }
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [popularResponse, trendingResponse, upcomingResponse, moviePoster] = await Promise.all([
          axios.get(`${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`),
          axios.get(`${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`),
          axios.get(`${BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}`),
          axios.get(`${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`)
        ]);

        setMovies(popularResponse.data.results);
        setTrendingMovies(trendingResponse.data.results);
        setUpcomingMovies(upcomingResponse.data.results);
        setPosters(moviePoster.data.results.slice(0, 8));
      } catch (error) {
        console.error("Error fetching movies or trailer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const fetchMovieDetails = async (movieId) => {
    try {
      const movieResponse = await axios.get(
        `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`
      );
      const trailerResponse = await axios.get(
        `${BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`
      );

      const trailer = trailerResponse.data.results.find(
        (video) => video.type === "Trailer"
      );

      const movieDetails = {
        ...movieResponse.data,
        trailerUrl: trailer ? `https://www.youtube.com/embed/${trailer.key}` : null,
      };

      setSelectedMovie(movieDetails);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const handleMovieClick = (movie) => {
    fetchMovieDetails(movie.id);
  };

  const handleShowTrailer = () => {
    if (selectedMovie && selectedMovie.trailerUrl) {
      setTrailerUrl(`${selectedMovie.trailerUrl}?autoplay=1&mute=1`);
      setShowTrailerModal(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handleCloseTrailerModal = () => {
    setShowTrailerModal(false);
    setTrailerUrl("");
  };

  const handleSearch = async (query) => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          query
        )}`
      );
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  };

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      handleSearch(query);
    }, 500);

    setSearchTimeout(timeout);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setSearchQuery('');
    setSearchResults([]);
    setShowRotateSlider(true);
  };

  const handleGenreChange = async (e) => {
    const genreId = e.target.value;
    setSelectedGenre(genreId);
    
    if (genreId === '') {
      // Reset to default view and scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setShowRotateSlider(true);
      const [popularResponse, trendingResponse, upcomingResponse] = await Promise.all([
        axios.get(`${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`),
        axios.get(`${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`),
        axios.get(`${BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}`)
      ]);
      setMovies(popularResponse.data.results);
      setTrendingMovies(trendingResponse.data.results);
      setUpcomingMovies(upcomingResponse.data.results);
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=1`
      );
      setMovies(response.data.results);
      setShowRotateSlider(false);
    } catch (error) {
      console.error("Error fetching genre movies:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="header-content">
            <Link to="/" onClick={handleLogoClick}>
              <img
                src={logo}
                alt="App Logo"
                className="logo"
                style={{ height: "100px", width: "auto" }}
              />
            </Link>

            <div className="search-container">
              <div className="search-input-container">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={handleSearchInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setShowRotateSlider(false);
                    handleSearch(searchQuery);
                  }
                }}
                className="search-input"
              />
              <select 
                value={selectedGenre}
                onChange={handleGenreChange}
                className="genre-select"
              >
                <option value="">Home</option>
                {predefinedGenres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
            </div>
          </div>
        </header>

        <div className="movie-container">
          {/* 3D Movie Poster Section*/}
          {showRotateSlider && (
            <div className="rotate-slider-container">
              <div className="rotate-slider">
                {posters.slice(0, 8).map((movie, index) => (
                  <span key={movie.id} style={{ "--i": index + 1 }}>
                    <img
                      src={`${IMAGE_URL}${movie.poster_path}`}
                      alt={movie.title}
                    />
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Only show other sections when not searching and no genre selected */}
          {!searchQuery && !selectedGenre && (
            <>
              {/* Popular Movies Section */}
              <div className="movie-section">
                <h2>Popular Movies</h2>
                <div className="slider-container">
                  <button
                    className="slider-button left"
                    onClick={() => {
                      const container = document.querySelector(".movie-grid");
                      container.scrollLeft -= container.offsetWidth;
                    }}
                  >
                    ‹
                  </button>
                  <div className="movie-grid">
                    {movies.map((movie) => (
                      <div
                        key={movie.id}
                        className="movie-card"
                        onClick={() => handleMovieClick(movie)}
                      >
                        <img
                          src={`${IMAGE_URL}${movie.poster_path}`}
                          alt={movie.title}
                          className="movie-poster"
                        />
                        <div className="movie-info">
                          <h3>{movie.title}</h3>
                          <div className="movie-details">
                            <span>{new Date(movie.release_date).getFullYear()}</span>
                            <span>⭐ {movie.vote_average.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="slider-button right"
                    onClick={() => {
                      const container = document.querySelector(".movie-grid");
                      container.scrollLeft += container.offsetWidth;
                    }}
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* Trending Movies Section */}
              <div className="movie-section">
                <h2>Trending Movies</h2>
                <div className="slider-container">
                  <button
                    className="slider-button left"
                    onClick={() => {
                      const container = document.querySelector(".trending-movie-grid");
                      container.scrollLeft -= container.offsetWidth;
                    }}
                  >
                    ‹
                  </button>
                  <div className="movie-grid trending-movie-grid">
                    {trendingMovies.map((movie) => (
                      <div
                        key={movie.id}
                        className="movie-card"
                        onClick={() => handleMovieClick(movie)}
                      >
                        <img
                          src={`${IMAGE_URL}${movie.poster_path}`}
                          alt={movie.title}
                          className="movie-poster"
                        />
                        <div className="movie-info">
                          <h3>{movie.title}</h3>
                          <div className="movie-details">
                            <span>{new Date(movie.release_date).getFullYear()}</span>
                            <span>⭐ {movie.vote_average.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="slider-button right"
                    onClick={() => {
                      const container = document.querySelector(".trending-movie-grid");
                      container.scrollLeft += container.offsetWidth;
                    }}
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* Upcoming Movies Section */}
              <div className="movie-section">
                <h2>Upcoming Movies</h2>
                <div className="slider-container">
                  <button
                    className="slider-button left"
                    onClick={() => {
                      const container = document.querySelector(".upcoming-movie-grid");
                      container.scrollLeft -= container.offsetWidth;
                    }}
                  >
                    ‹
                  </button>
                  <div className="movie-grid upcoming-movie-grid">
                    {upcomingMovies.map((movie) => (
                      <div
                        key={movie.id}
                        className="movie-card"
                        onClick={() => handleMovieClick(movie)}
                      >
                        <img
                          src={`${IMAGE_URL}${movie.poster_path}`}
                          alt={movie.title}
                          className="movie-poster"
                        />
                        <div className="movie-info">
                          <h3>{movie.title}</h3>
                          <div className="movie-details">
                            <span>{new Date(movie.release_date).getFullYear()}</span>
                            <span>⭐ {movie.vote_average.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="slider-button right"
                    onClick={() => {
                      const container = document.querySelector(".upcoming-movie-grid");
                      container.scrollLeft += container.offsetWidth;
                    }}
                  >
                    ›
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Show genre results when a genre is selected */}
          {selectedGenre && (
            <div className="movie-section">
              <h2>{predefinedGenres.find(g => g.id === parseInt(selectedGenre))?.name || 'Genre Movies'}</h2>
              <div className="slider-container">
                <button
                  className="slider-button left"
                  onClick={() => {
                    const container = document.querySelector(".genre-movie-grid");
                    container.scrollLeft -= container.offsetWidth;
                  }}
                >
                  ‹
                </button>
                <div className="movie-grid genre-movie-grid">
                  {movies.map((movie) => (
                    <div
                      key={movie.id}
                      className="movie-card"
                      onClick={() => handleMovieClick(movie)}
                    >
                      <img
                        src={`${IMAGE_URL}${movie.poster_path}`}
                        alt={movie.title}
                        className="movie-poster"
                      />
                      <div className="movie-info">
                        <h3>{movie.title}</h3>
                        <div className="movie-details">
                          <span>{new Date(movie.release_date).getFullYear()}</span>
                          <span>⭐ {movie.vote_average.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="slider-button right"
                  onClick={() => {
                    const container = document.querySelector(".genre-movie-grid");
                    container.scrollLeft += container.offsetWidth;
                  }}
                >
                  ›
                </button>
              </div>
            </div>
          )}

          {/* Show search results */}
          {searchQuery && searchResults.length > 0 && (
            <div className="movie-section">
              <h2>Search Results</h2>
              <div className="slider-container">
                <button
                  className="slider-button left"
                  onClick={() => {
                    const container = document.querySelector(".search-results-grid");
                    container.scrollLeft -= container.offsetWidth;
                  }}
                >
                  ‹
                </button>
                <div className="movie-grid search-results-grid">
                  {searchResults.map((movie) => (
                    <div
                      key={movie.id}
                      className="movie-card"
                      onClick={() => handleMovieClick(movie)}
                    >
                      <img
                        src={movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : 'placeholder-image-url'}
                        alt={movie.title}
                        className="movie-poster"
                      />
                      <div className="movie-info">
                        <h3>{movie.title}</h3>
                        <div className="movie-details">
                          <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
                          <span>⭐ {movie.vote_average.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="slider-button right"
                  onClick={() => {
                    const container = document.querySelector(".search-results-grid");
                    container.scrollLeft += container.offsetWidth;
                  }}
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>

        {selectedMovie && (
          <Modal movie={selectedMovie} onClose={handleCloseModal} onShowTrailer={handleShowTrailer} />
        )}

        {showTrailerModal && (
          <TrailerModal trailerUrl={trailerUrl} onClose={handleCloseTrailerModal} />
        )}
      </div>
    </Router>
  );
}

export default App;
