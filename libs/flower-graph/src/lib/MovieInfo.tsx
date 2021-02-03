import React from "react";
import { Movie } from "../test-data/movies";

export const MoviesInfo: React.FC<{ movie: Movie }> = ({ movie }) => {
  return <div style={{ width: movie ? 300 : 0, transition: 'all 2s ease' }}>
    <img src={movie.Poster} alt="poster" width="150px" />
    <h3>
      {movie.Title}
    </h3>
    <p>
      {movie.Plot}
    </p>
    <ul>
      {([
        'Genre',
        'Runtime',
        'Rated',
        'Year',
        'Actors',
        'Language',
        'BoxOffice',
        'imdbRating'
      ] as (keyof Movie)[]).map((key) => (
        <li key={key}>
          <p><strong>{key} :</strong> {movie[key]}</p>
        </li>
      ))}
    </ul>
  </div>
}