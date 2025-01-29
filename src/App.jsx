import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = "19517c2997a6f18d7a87adee2d219374"; // Replace with your TMDB API key
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch popular movies from TMDB
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/movie/popular?api_key=${API_KEY}`
        );
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="App">
      <h1>Popular Movies</h1>
      <div className="movie-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={`${IMAGE_URL}${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
            <h3>{movie.title}</h3>
            <p>{movie.release_date}</p>
            <p>⭐ {movie.vote_average}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
