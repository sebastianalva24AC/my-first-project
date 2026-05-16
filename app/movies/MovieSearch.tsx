'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'

interface Movie {
  imdbID: string
  Title: string
  Year: string
  Poster: string
  Type: string
}

interface MovieDetail {
  Title: string
  Year: string
  Plot: string
  Poster: string
  Genre: string
  Director: string
  Actors: string
  imdbRating: string
  Runtime: string
  Type: string
  Language: string
  Awards: string
}

interface Props {
  apiKey: string
  popularMovies: Movie[]
}

export default function MovieSearch({ apiKey, popularMovies }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<MovieDetail | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [noResults, setNoResults] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setNoResults(false)
      return
    }
    const timeout = setTimeout(async () => {
      setLoading(true)
      setNoResults(false)
      try {
        const res = await axios.get(`https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`)
        if (res.data.Search) {
          setResults(res.data.Search)
          setNoResults(false)
        } else {
          setResults([])
          setNoResults(true)
        }
      } catch (e) {
        setResults([])
      }
      setLoading(false)
    }, 500)
    return () => clearTimeout(timeout)
  }, [query])

  const openDetail = async (id: string) => {
    const res = await axios.get(`https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`)
    setSelected(res.data)
    setShowModal(true)
  }

  const MovieCard = ({ movie }: { movie: Movie }) => (
    <div
      onClick={() => openDetail(movie.imdbID)}
      className="relative group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-yellow-400/30 hover:shadow-2xl transition-all duration-300 hover:scale-105"
    >
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://placehold.co/300x450/1a1a2e/9ca3af?text=Sin+imagen'}
        alt={movie.Title}
        className="w-full h-72 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="font-bold text-white text-sm leading-tight">{movie.Title}</h3>
        <p className="text-gray-300 text-xs mt-1">{movie.Year} · <span className="capitalize text-yellow-400">{movie.Type}</span></p>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="bg-yellow-400 text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg">▶ Ver detalles</span>
      </div>
    </div>
  )

  return (
    <div>
      {/* Buscador */}
      <div className="relative mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Buscar película o serie..."
          className="w-full p-5 rounded-2xl bg-white/10 backdrop-blur text-white border-2 border-white/20 focus:border-yellow-400 outline-none text-lg placeholder-gray-400 transition"
        />
        {loading && (
          <div className="absolute right-5 top-5 animate-spin h-6 w-6 border-2 border-yellow-400 border-t-transparent rounded-full" />
        )}
      </div>

      {noResults && (
        <p className="text-gray-400 text-center mt-4 mb-8">
          No se encontraron resultados para "<span className="text-yellow-400">{query}</span>"
        </p>
      )}

      {/* Resultados CSR */}
      {results.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold text-white">🔎 Resultados para "<span className="text-yellow-400">{query}</span>"</h2>
            <span className="text-xs bg-blue-500/30 border border-blue-400/50 text-blue-300 px-2 py-1 rounded-full">CSR — tiempo real</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map(movie => <MovieCard key={movie.imdbID} movie={movie} />)}
          </div>
        </div>
      )}

      {/* Populares SSR */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl font-bold text-white">🔥 Populares</h2>
          <span className="text-xs bg-green-500/30 border border-green-400/50 text-green-300 px-2 py-1 rounded-full">SSR — servidor</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {popularMovies.map(movie => <MovieCard key={movie.imdbID} movie={movie} />)}
        </div>
      </div>

      {/* Modal */}
      {showModal && selected && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-gray-900 rounded-3xl max-w-2xl w-full border border-yellow-400/50 shadow-2xl shadow-yellow-400/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="relative h-32 bg-gradient-to-r from-yellow-600 via-orange-500 to-red-600">
              <div className="absolute inset-0 bg-black/40" />
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold transition"
              >✕</button>
            </div>

            <div className="flex flex-col md:flex-row gap-6 p-6 -mt-16 relative">
              <img
                src={selected.Poster !== 'N/A' ? selected.Poster : 'https://placehold.co/300x450/1f2937/9ca3af?text=Sin+imagen'}
                alt={selected.Title}
                className="w-32 md:w-40 rounded-2xl object-cover shadow-2xl border-2 border-yellow-400/50 flex-shrink-0"
              />
              <div className="flex-1 pt-16 md:pt-16">
                <h2 className="text-2xl font-bold text-white leading-tight">{selected.Title}</h2>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">⭐ {selected.imdbRating}</span>
                  <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full">{selected.Year}</span>
                  <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full">{selected.Runtime}</span>
                  <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full capitalize">{selected.Type}</span>
                </div>
                <p className="text-yellow-400/80 text-sm mt-2">{selected.Genre}</p>
              </div>
            </div>

            <div className="px-6 pb-6 space-y-3">
              <p className="text-gray-300 text-sm leading-relaxed border-t border-white/10 pt-4">{selected.Plot}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                <p className="text-xs text-gray-400"><span className="text-gray-200 font-semibold">Director:</span> {selected.Director}</p>
                <p className="text-xs text-gray-400"><span className="text-gray-200 font-semibold">Idioma:</span> {selected.Language}</p>
                <p className="text-xs text-gray-400 md:col-span-2"><span className="text-gray-200 font-semibold">Actores:</span> {selected.Actors}</p>
                <p className="text-xs text-gray-400 md:col-span-2"><span className="text-gray-200 font-semibold">Premios:</span> {selected.Awards}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}