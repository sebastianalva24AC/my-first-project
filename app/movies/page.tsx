import axios from 'axios'
import MovieSearch from './MovieSearch'

const API_KEY = process.env.OMDB_API_KEY || ''
interface Movie {
  imdbID: string
  Title: string
  Year: string
  Poster: string
  Type: string
}

async function getPopularMovies(): Promise<Movie[]> {
  const searches = ['avengers', 'batman', 'fast furious']
  const results: Movie[] = []
  for (const term of searches) {
    const res = await axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${term}`)
    if (res.data.Search) results.push(...res.data.Search.slice(0, 4))
  }
  return results
}

export default async function MoviesPage() {
  const movies = await getPopularMovies()

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Hero banner */}
      <div className="relative bg-gradient-to-b from-yellow-900/40 via-gray-900 to-[#0a0a1a] px-8 pt-16 pb-10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
        <div className="max-w-7xl mx-auto relative">
          <h1 className="text-6xl font-black text-center tracking-tight">
            🎬 <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">CineApp</span>
          </h1>
          <p className="text-center text-gray-400 mt-2 mb-8 text-lg">Descubre películas y series usando SSR y CSR con Next.js</p>
          <MovieSearch apiKey={API_KEY} popularMovies={movies} />
        </div>
      </div>
    </div>
  )
}