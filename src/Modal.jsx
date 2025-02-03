import React from "react";
import "./Modal.css";

const Modal = ({ movie, onClose, onShowTrailer }) => {
  if (!movie) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="modal-header">
          <h2>{movie.title}</h2>
        </div>
        <div className="modal-body">
          <img
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
            alt={movie.title}
            className="modal-poster"
          />
          <div className="modal-details">
            <p><strong>Release Date:</strong> {movie.release_date}</p>
            <p><strong>Rating:</strong> ⭐ {movie.vote_average.toFixed(1)}</p>
            <p>{movie.overview}</p>
            <button className="trailer-button" onClick={onShowTrailer}>
              Show Trailer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;