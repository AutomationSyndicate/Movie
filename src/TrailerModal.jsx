import React from "react";
import "./TrailerModal.css";

const TrailerModal = ({ trailerUrl, onClose }) => {
  if (!trailerUrl) return null;

  return (
    <div className="trailer-modal-overlay" onClick={onClose}>
      <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="trailer-video">
          <iframe
            width="100%"
            height="400"
            src={trailerUrl}
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <button className="close-trailer-button" onClick={onClose}>
          Close Trailer
        </button>
      </div>
    </div>
  );
};

export default TrailerModal;