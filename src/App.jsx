import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from "axios";
import "./App.css";
import CategoryPage from './CategoryPage';

const API_KEY = "19517c2997a6f18d7a87adee2d219374"; // Replace with your TMDB API key
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

function App() {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState(""); // State to store trailer URL
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    // Fetch popular movies from TMDB
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/movie/popular?api_key=${API_KEY}`
        );
        setMovies(response.data.results);

        // Fetch the trailer for the most popular movie (first movie in the list)
        const movieId = response.data.results[0].id; // Get ID of the most popular movie
        const trailerResponse = await axios.get(
          `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
        );

        // Fetch the list of genres from TMDb when the app loads
      const movieGenre = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
      );
      setGenres(movieGenre.data.genres);
    

        // Find the trailer (usually the first video in the list)
        const trailer = trailerResponse.data.results.find(
          (video) => video.type === "Trailer"
        );

        if (trailer) {
          // Set the trailer URL with autoplay and mute parameters
          setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`);
        }
      } catch (error) {
        console.error("Error fetching movies or trailer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleSearch = async (query) => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
      );
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  };

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debouncing
    const timeout = setTimeout(() => {
      handleSearch(query);
    }, 500);

    setSearchTimeout(timeout);
  };

  const displayedMovies = searchQuery ? searchResults : movies;

  return (
    <Router>
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>NETFLIX</h1>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={handleSearchInput}
              className="search-input"
            />
            <div className="search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </header>

      {trailerUrl && !loading && !searchQuery && (
        <div className="video-player">
          <iframe
            width="100%"
            height="400"
            src={trailerUrl} // Use the trailer URL with autoplay=1
            title="Movie Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

    
      <div>
        <h1>Movie Categories</h1>
        <nav>
          <ul>
          <li>
              <Link to="/">Home</Link> {/* Add Home link */}
            </li>
            {genres.map(genre => (
              <li key={genre.id}>
                <Link to={`/category/${genre.id}`}>{genre.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <Routes>
          {/* Define route for each category page */}
          <Route path="/category/:genreId" element={<CategoryPage />} />
        </Routes>
      </div>
    

      <div className="movie-container">
        <div className="movie-section">
          <h2>{searchQuery ? "Search Results" : "Popular on Netflix"}</h2>
          <div className="slider-container">
            <button className="slider-button left" onClick={() => {
              const container = document.querySelector('.movie-grid');
              container.scrollLeft -= container.offsetWidth;
            }}>‹</button>
            <div className="movie-grid">
              {displayedMovies.map((movie) => (
                <div key={movie.id} className="movie-card">
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
            <button className="slider-button right" onClick={() => {
              const container = document.querySelector('.movie-grid');
              container.scrollLeft += container.offsetWidth;
            }}>›</button>
          </div>
        </div>
      </div>
    </div>
    </Router>
  );
}

export default App;
