import { useEffect, useState, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../AuthContext';
import { Search, Plus, ListMusic, X } from 'lucide-react';
import ReactPlayer from 'react-player'

const Home = () => {
    const { user } = useContext(AuthContext);
    const [songs, setSongs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Estados do Modal "Adicionar à Playlist"
    const [selectedSong, setSelectedSong] = useState(null);
    const [myPlaylists, setMyPlaylists] = useState([]);
    const [showModal, setShowModal] = useState(false);

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

    // Abre o modal e carrega as playlists do usuário para ele escolher
    const openPlaylistModal = async (song) => {
        if (!user) {
            alert("Faça login para criar playlists!");
            return;
        }
        setSelectedSong(song);
        try {
            const res = await api.get(`/playlists/user/${user.id}`);
            setMyPlaylists(res.data);
            setShowModal(true);
        } catch (error) {
            alert("Erro ao carregar suas playlists.");
        }
    };

    const addToPlaylist = async (playlistId) => {
        try {
            await api.post(`/playlists/${playlistId}/songs/${selectedSong.id}`);
            alert(`"${selectedSong.title}" adicionada à playlist!`);
            setShowModal(false);
        } catch (error) {
            alert("Erro ao adicionar (talvez já esteja lá?)");
        }
    };

    return (
        <div>
            <div className="mb-8">
                <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
                    <input
                        type="text"
                        placeholder="Buscar músicas..."
                        className="w-full pl-12 pr-4 py-3 rounded-full border border-coffee-200 focus:outline-none focus:border-coffee-500 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-4 top-3.5 text-coffee-400 w-5 h-5" />
                </form>
            </div>

            {/* Grid de Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {songs.map((song) => (
                    <div key={song.id} className="bg-white rounded-xl shadow-sm border border-coffee-100 overflow-hidden group hover:shadow-md transition">

                        {/* Player de Vídeo */}
                        <div className="aspect-video bg-black relative">
                            <ReactPlayer
                                src={song.url}
                                width="100%"
                                height="100%"
                                light={true} // Mostra thumbnail antes de carregar o pesado
                                controls={true}
                            />
                        </div>

                        {/* Info e Botões */}
                        <div className="p-4 flex items-start justify-between">
                            <div className="overflow-hidden pr-2">
                                <h3 className="font-bold text-coffee-900 truncate" title={song.title}>{song.title}</h3>
                                <p className="text-sm text-coffee-600 truncate">
                                    {song.albumArtistName} • {song.albumTitle}
                                </p>
                            </div>

                            <button
                                onClick={() => openPlaylistModal(song)}
                                className="p-2 bg-coffee-50 hover:bg-coffee-200 rounded-full text-coffee-600 transition"
                                title="Adicionar à Playlist"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL DE SELEÇÃO DE PLAYLIST */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-coffee-800">Salvar em...</h3>
                            <button onClick={() => setShowModal(false)}><X className="text-coffee-400" /></button>
                        </div>

                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {myPlaylists.length > 0 ? (
                                myPlaylists.map(pl => (
                                    <button
                                        key={pl.id}
                                        onClick={() => addToPlaylist(pl.id)}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-coffee-50 rounded-lg text-left transition"
                                    >
                                        <div className="w-10 h-10 bg-coffee-200 rounded flex items-center justify-center text-coffee-600">
                                            <ListMusic size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-coffee-900">{pl.name}</div>
                                            <div className="text-xs text-coffee-500">{pl.songs ? pl.songs.length : 0} músicas</div>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <p className="text-center text-coffee-500 py-4">
                                    Você não tem playlists.<br/>
                                    <span className="text-xs">Vá em 'Minhas Playlists' para criar uma.</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;