import style from "./MoviesPage.module.css";
import { fetchSearchedMovie } from "../../movie-api";
import { useEffect, useState } from "react";
import MovieList from "../../components/MovieList/MovieList";
import { useSearchParams } from "react-router-dom";
const MoviesPage = () => {
  const [query, setQuery] = useState("");
  const [queryMovies, setQueryMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentQuery = searchParams.get("query") ?? "";

  useEffect(() => {
    if (!currentQuery) return;
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await fetchSearchedMovie(currentQuery);
        setQueryMovies(response);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [currentQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchParams({ query });
    setQuery("");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={style.movieDiv}>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            className={style.movieInput}
            type="text"
          />
          <button className={style.searchBtn} type="submit">Search</button>
        </div>
      </form>
      {loading && <p>Loading...</p>}
      {queryMovies.length > 0 && <MovieList movies={queryMovies} />}
    </>
  );
};

export default MoviesPage;
