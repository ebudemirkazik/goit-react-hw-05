// MoviesPage.jsx
import style from "./MoviesPage.module.css";
import { fetchSearchedMovie, fetchTrendingMovies } from "../../movie-api";
import { useEffect, useState } from "react";
import MovieList from "../../components/MovieList/MovieList";
import { useSearchParams } from "react-router-dom";

const MoviesPage = () => {
  const [query, setQuery] = useState("");
  const [queryMovies, setQueryMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]); // 🔹 ZORUNLU STATE
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentQuery = searchParams.get("query") ?? "";

  // 🔸 Query varsa arama yap
  useEffect(() => {
    if (!currentQuery) return; // query silinirse arama yapma
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

  // 🔸 Query YOKSA trendleri çek
  useEffect(() => {
    if (currentQuery) return; // arama modunda değilsek
    const getTrending = async () => {
      setLoading(true);
      try {
        const data = await fetchTrendingMovies();
        setTrendingMovies(data);
        setQueryMovies([]); // arama sonuçlarını temizle
      } catch (err) {
        console.error("Trending fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    getTrending();
  }, [currentQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = query.trim();
    if (!next) return;
    setSearchParams({ query: next });
    setQuery("");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={style.movieDiv}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={style.movieInput}
            type="text"
            placeholder="Search movies…"
          />
          <button className={style.searchBtn} type="submit">Search</button>
        </div>
      </form>

      {loading && <p>Loading...</p>}

      {/* Query varsa arama sonuçları, yoksa trendler */}
      {!loading && currentQuery && queryMovies.length > 0 && (
        <MovieList movies={queryMovies} />
      )}
      {!loading && !currentQuery && trendingMovies.length > 0 && (
        <MovieList movies={trendingMovies} />
      )}

      {/* Boş durumlar */}
      {!loading && currentQuery && queryMovies.length === 0 && (
        <p>No results for “{currentQuery}”.</p>
      )}
    </>
  );
};

export default MoviesPage;