import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../AuthContext';
import { ArrowLeft, Trash2, Clock, Music } from 'lucide-react';
import ReactPlayer from 'react-player';

const PlaylistDetails = () => {
    const { id } = useParams(); // Pega o ID da URL
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [playlist, setPlaylist] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPlaylist();
    }, [id]);

    const loadPlaylist = async () => {
        try {
            const res = await api.get(`/playlists/${id}`);
            setPlaylist(res.data);
            setIsLoading(false);
        } catch (error) {
            alert("Erro ao carregar playlist.");
            navigate('/playlists');
        }
    };

    const removeSong = async (songId) => {
        if (!window.confirm("Remover esta música da playlist?")) return;
        try {
            // Chama o endpoint DELETE que criamos: /playlists/{id}/songs/{songId}
            await api.delete(`/playlists/${id}/songs/${songId}`);
            // Atualiza a lista localmente removendo a música
            setPlaylist({
                ...playlist,
                songs: playlist.songs.filter(s => s.id !== songId)
            });
        } catch (error) {
            alert("Erro ao remover música.");
        }
    };

    // Verifica se o usuário logado é o dono da playlist (para liberar o botão de excluir)
    // Se o user não estiver logado, assume false
    const isOwner = user && playlist && (user.name === playlist.ownerName || playlist.ownerName === user.name);
    // OBS: O ideal seria comparar por ID (playlist.ownerId), mas no DTO simplificado mandamos nome.
    // Se quiser precisão total, adicione ownerId no PlaylistResponseDTO do Java.

    if (isLoading) return <div className="p-8">Carregando...</div>;

    return (
        <div>
            {/* Cabeçalho */}
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-coffee-600 mb-6 hover:text-coffee-800 transition">
                <ArrowLeft size={20} /> Voltar
            </button>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-coffee-200 mb-8">
                <h1 className="text-4xl font-bold text-coffee-900 mb-2">{playlist.name}</h1>
                <p className="text-coffee-600 text-lg mb-4">{playlist.description || "Sem descrição"}</p>
                <div className="flex gap-4 text-sm text-coffee-400">
                    <span>Criada por: <span className="font-bold text-coffee-600">{playlist.ownerName}</span></span>
                    <span>•</span>
                    <span>{playlist.songs.length} faixas</span>
                </div>
            </div>

            {/* Lista de Músicas */}
            {playlist.songs.length === 0 ? (
                <div className="text-center py-12 text-coffee-400 bg-coffee-50 rounded-xl border border-coffee-100">
                    <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Esta playlist está vazia.</p>
                    <p className="text-sm">Vá para o Início adicionar músicas!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {playlist.songs.map(song => (
                        <div key={song.id} className="bg-white rounded-xl shadow-sm border border-coffee-100 overflow-hidden group hover:shadow-md transition">
                            {/* Player */}
                            <div className="aspect-video bg-black relative">
                                <ReactPlayer
                                    src={song.url}
                                    width="100%"
                                    height="100%"
                                    light={true}
                                    controls={true}
                                />
                            </div>

                            {/* Info */}
                            <div className="p-4 flex justify-between items-start">
                                <div className="overflow-hidden pr-2">
                                    <h3 className="font-bold text-coffee-900 truncate">{song.title}</h3>
                                    <p className="text-sm text-coffee-600 truncate">{song.albumArtistName}</p>
                                </div>

                                {/* Botão de Remover (Só aparece para o dono ou se for livre, depende da regra) */}
                                <button
                                    onClick={() => removeSong(song.id)}
                                    className="text-red-300 hover:text-red-500 transition p-1"
                                    title="Remover da playlist"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PlaylistDetails;