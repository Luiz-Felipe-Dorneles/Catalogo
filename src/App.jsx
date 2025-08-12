import { use, useEffect, useState } from "react";
import './App.css';
import Buscar from "./components/Buscar.jsx";
import Spinner from "./components/Spinner.jsx";
import { useDebounce } from "react-use";
 
const App = () => {
  const [termoBusca, setTermoBusca] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [filmes, setFilmes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState(''); ;
 

  useDebounce(() => {
    setDebouncedTerm(termoBusca);
  }, 200, [termoBusca]);
  const API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;
  const API_URL_BASE = 'https://api.themoviedb.org/3';
  const API_OPCOES = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_TOKEN}`
    }
  };
 
  const fetchMovies = async () => {
    setErrorMessage('');
    setIsLoading(true);
    try {
      const endpoint = termoBusca
        ? `${API_URL_BASE}/search/movie?query=${encodeURIComponent(termoBusca)}`
        : `${API_URL_BASE}/discover/movie?sort_by=popularity.desc`;
 
      const response = await fetch(endpoint, API_OPCOES);
      if (!response.ok) throw new Error("Erro na requisição.");
 
      const data = await response.json();
      setFilmes(data.results || []);
    } catch (error) {
      console.error(`Erro ao buscar filmes: ${error}`);
      setErrorMessage("Erro ao buscar filmes. Favor tentar mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };
 
  useEffect(() => {
    fetchMovies(debouncedTerm);
     }, [debouncedTerm]);
 
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Banner do Herói" />
          <h1>
            Encontre Os <span className="text-gradient">Filmes</span> Que Você vai Gostar
          </h1>
        </header>
 
        <Buscar termoBusca={termoBusca} setTermoBusca={setTermoBusca} />
        
        <section className="all-movies">
          <h2 className="mt-[40px]">Todos os filmes</h2>
 
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : filmes.length === 0 ? (
            <p className="text-white">Nenhum filme encontrado.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filmes.map((filme) => (
                <div key={filme.id} className="bg-light-100/10 p-4 rounded-lg text-white text-center">
                  {filme.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`}
                      alt={filme.title}
                      className="w-full h-auto mb-2 rounded"
                    />
                  ) : (
                    <div className="w-full h-[300px] bg-gray-700 mb-2 rounded flex items-center justify-center text-sm">
                      Sem imagem
                    </div>
                  )}
                  <h3 className="text-lg font-bold">{filme.title}</h3>
                  <p className="text-sm text-yellow-300">
                    ⭐ IMDb: {filme.vote_average?.toFixed(1) ?? "N/A"} / 10
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
 
export default App;
 