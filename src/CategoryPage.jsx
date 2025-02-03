import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CategoryPage.css'; // Import the CSS file for styling

const apiKey = '19517c2997a6f18d7a87adee2d219374';  // Replace with your TMDb API key

function CategoryPage() {
  const { genreId } = useParams(); // Get the genreId from the URL
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genreName, setGenreName] = useState('');

  useEffect(() => {
    // Fetch movies for the selected genre
    const fetchMovies = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=en-US`
      );
      const data = await response.json();
      setMovies(data.results); // Store movies in state
      setLoading(false); // Set loading state to false once data is fetched
    };

    // Fetch genre name
    const fetchGenreName = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
      );
      const data = await response.json();
      const genre = data.genres.find(g => g.id === parseInt(genreId));
      setGenreName(genre ? genre.name : ''); // Store genre name in state
    };

    fetchGenreName();
    fetchMovies();
  }, [genreId]); // Re-run effect if genreId changes

  if (loading) {
    return <div>Loading movies...</div>;
  }

  return (
    <div>
      <h2>{genreName} Movies</h2>
      <div className="genremovie-grid">
        {movies.map(movie => (
          <div className="genremovie-item" key={movie.id}>
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title} 
              className="genremovie-poster"
            />
            <h3 className="genremovie-title">{movie.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;
