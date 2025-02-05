import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";
import "./App.css";
import CategoryPage from "./CategoryPage";
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
  const [genres, setGenres] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [posters, setPosters] = useState([]);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [popularResponse, trendingResponse, upcomingResponse, genreResponse, moviePoster] = await Promise.all([
          axios.get(`${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`),
          axios.get(`${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`),
          axios.get(`${BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}`),
          axios.get(`${BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`),
          axios.get(`${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`)
        ]);

        setMovies(popularResponse.data.results);
        setTrendingMovies(trendingResponse.data.results);
        setUpcomingMovies(upcomingResponse.data.results);
        setGenres(genreResponse.data.genres);
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

<<<<<<< HEAD
  const displayedMovies = searchQuery ? searchResults : movies;
  const toggleMenu = () => setShowMenu(!showMenu);
  const toggleCategories = () => setShowCategories(!showCategories);

  const categories = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi"];

=======
>>>>>>> 2fb39fb94f1fdb898b4f8fb5bd7ca6bd4310431a
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="header-content">
            <Link to="/">
              <img
                src={logo}
                alt="App Logo"
                className="logo"
                style={{ height: "100px", width: "auto" }}
              />
            </Link>

            <div className="search-container">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={handleSearchInput}
                className="search-input"
              />
              <div className="search-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 21L16.65 16.65"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {/* Menu Dropdown */}
            <div className="menu-container">
              <button onClick={toggleMenu} className="menu-button">
                Menu
              </button>
              {showMenu && (
                <div className="dropdown">
                  <Link to="/" className="dropdown-item">
                    Home
                  </Link>
                  <div className="dropdown-item" onClick={toggleCategories}>
                    Categories
                    {showCategories && (
                      <div className="categories-dropdown">
                        {categories.map((category, index) => (
                          <Link
                            key={index}
                            to={`/categories/${category}`}
                            className="categories-dropdown-item"
                          >
                            {category}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 3D Movie Poster Section*/}
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

        <div>
          <h1>Movie Categories</h1>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              {genres.map((genre) => (
                <li key={genre.id}>
                  <Link to={`/category/${genre.id}`}>{genre.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <Routes>
            <Route path="/category/:genreId" element={<CategoryPage />} />
          </Routes>
        </div>

        <div className="movie-container">
          {/* Search Results Section */}
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

          {/* Show "No results found" message when search yields no results */}
          {searchQuery && searchResults.length === 0 && (
            <div className="no-results">
              <h2>No results found for "{searchQuery}"</h2>
            </div>
          )}

          {/* Only show other sections when not searching */}
          {!searchQuery && (
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
