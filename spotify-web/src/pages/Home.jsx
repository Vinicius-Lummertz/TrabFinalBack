import { useEffect, useState } from 'react';
import api from '../api';
import { Search, PlayCircle } from 'lucide-react';

const Home = () => {
    const [songs, setSongs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadSongs();
    }, []);

    const loadSongs = async (term = '') => {
        try {
            const url = term ? `/songs/search?term=${term}` : '/songs';
            const response = await api.get(url);
            setSongs(response.data);
        } catch (error) {
            console.error("Erro ao buscar músicas", error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadSongs(searchTerm);
    };

    return (
        <div>
            {/* Search Bar */}
            <div className="mb-8">
                <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
                    <input 
                        type="text"
                        placeholder="Buscar músicas ou artistas..."
                        className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-coffee-200 focus:outline-none focus:border-coffee-500 shadow-sm text-coffee-800 placeholder-coffee-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-4 top-3.5 text-coffee-400 w-5 h-5" />
                </form>
            </div>

            <h1 className="text-3xl font-bold mb-6 text-coffee-800">Explorar Músicas</h1>

            {/* Grid de Músicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {songs.map((song) => (
                    <div key={song.id} className="bg-white p-4 rounded-xl shadow-sm border border-coffee-100 hover:shadow-md transition flex items-center gap-4">
                        <div className="w-12 h-12 bg-coffee-200 rounded-full flex items-center justify-center flex-shrink-0 text-coffee-600">
                           <PlayCircle />
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="font-bold text-coffee-900 truncate">{song.title}</h3>
                            <p className="text-sm text-coffee-600 truncate">{song.albumArtistName} • {song.albumTitle}</p>
                            <a 
                                href={song.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-xs text-coffee-500 mt-1 hover:text-coffee-700 underline block"
                            >
                                Ouvir (Link Externo)
                            </a>
                        </div>
                    </div>
                ))}
            </div>
            
            {songs.length === 0 && (
                <p className="text-center text-coffee-400 mt-10">Nenhuma música encontrada.</p>
            )}
        </div>
    );
};

export default Home;