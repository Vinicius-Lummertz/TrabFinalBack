import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../AuthContext';
import { ArrowLeft, Trash2, Music, Pencil, Save, X, Globe, Lock } from 'lucide-react';
import ReactPlayer from 'react-player';

const PlaylistDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [playlist, setPlaylist] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Estados de Edição
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', description: '', isPublic: false });

    useEffect(() => {
        loadPlaylist();
    }, [id]);

    const loadPlaylist = async () => {
        try {
            const res = await api.get(`/playlists/${id}`);
            setPlaylist(res.data);
            // Prepara o formulário com os dados carregados
            setEditForm({
                name: res.data.name,
                description: res.data.description || '',
                isPublic: res.data.isPublic
            });
            setIsLoading(false);
        } catch (error) {
            alert("Erro ao carregar playlist.");
            navigate('/playlists');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Reutiliza ownerId e songs da original, pois o endpoint de update do backend pede PlaylistRequestDTO completo
            // No Backend, o modelMapper vai ignorar ownerId se configurado, ou usamos o user atual
            const payload = {
                name: editForm.name,
                description: editForm.description,
                isPublic: editForm.isPublic,
                ownerId: user.id // Necessário para passar na validação do DTO
            };

            const res = await api.put(`/playlists/${id}`, payload);
            setPlaylist({ ...playlist, ...res.data }); // Atualiza a view com a resposta do server
            setIsEditing(false);
            alert("Playlist atualizada!");
        } catch (error) {
            alert("Erro ao atualizar playlist.");
        }
    };

    const handleDeletePlaylist = async () => {
        if (!window.confirm("Tem certeza que deseja apagar esta playlist inteira?")) return;
        try {
            await api.delete(`/playlists/${id}`);
            alert("Playlist excluída.");
            navigate('/playlists');
        } catch (error) {
            alert("Erro ao excluir playlist.");
        }
    };

    const removeSong = async (songId) => {
        if (!window.confirm("Remover esta música da playlist?")) return;
        try {
            await api.delete(`/playlists/${id}/songs/${songId}`);
            setPlaylist({
                ...playlist,
                songs: playlist.songs.filter(s => s.id !== songId)
            });
        } catch (error) {
            alert("Erro ao remover música.");
        }
    };

    // Verifica propriedade (OwnerName é "frágil" mas ok para MVP, ideal seria ownerId)
    const isOwner = user && playlist && (user.name === playlist.ownerName || playlist.ownerName === user.name);

    if (isLoading) return <div className="p-8">Carregando...</div>;

    return (
        <div>
            <button onClick={() => navigate('/playlists')} className="flex items-center gap-2 text-coffee-600 mb-6 hover:text-coffee-800 transition">
                <ArrowLeft size={20} /> Voltar
            </button>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-coffee-200 mb-8 relative group">

                {!isEditing ? (
                    // MODO VISUALIZAÇÃO
                    <>
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-bold text-coffee-900 mb-2 flex items-center gap-3">
                                    {playlist.name}
                                    {playlist.isPublic ? <Globe className="text-coffee-300 w-6 h-6"/> : <Lock className="text-coffee-300 w-6 h-6"/>}
                                </h1>
                                <p className="text-coffee-600 text-lg mb-4">{playlist.description || "Sem descrição"}</p>
                                <div className="flex gap-4 text-sm text-coffee-400">
                                    <span>Criada por: <span className="font-bold text-coffee-600">{playlist.ownerName}</span></span>
                                    <span>•</span>
                                    <span>{playlist.songs.length} faixas</span>
                                </div>
                            </div>

                            {isOwner && (
                                <div className="flex gap-2">
                                    <button onClick={() => setIsEditing(true)} className="p-2 bg-coffee-50 hover:bg-coffee-100 rounded-full text-coffee-500 transition" title="Editar Info">
                                        <Pencil size={20} />
                                    </button>
                                    <button onClick={handleDeletePlaylist} className="p-2 bg-red-50 hover:bg-red-100 rounded-full text-red-400 transition" title="Excluir Playlist">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    // MODO EDIÇÃO
                    <form onSubmit={handleUpdate} className="animate-fade-in space-y-4">
                        <div className="flex justify-between">
                            <h2 className="font-bold text-coffee-800">Editar Playlist</h2>
                            <button type="button" onClick={() => setIsEditing(false)}><X className="text-coffee-400"/></button>
                        </div>

                        <input
                            className="w-full p-2 border border-coffee-200 rounded bg-coffee-50 font-bold text-lg"
                            placeholder="Nome da Playlist"
                            value={editForm.name}
                            onChange={e => setEditForm({...editForm, name: e.target.value})}
                            required
                        />

                        <textarea
                            className="w-full p-2 border border-coffee-200 rounded bg-coffee-50"
                            placeholder="Descrição"
                            value={editForm.description}
                            onChange={e => setEditForm({...editForm, description: e.target.value})}
                        />

                        <label className="flex items-center gap-2 text-coffee-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={editForm.isPublic}
                                onChange={e => setEditForm({...editForm, isPublic: e.target.checked})}
                                className="accent-coffee-500 w-4 h-4"
                            />
                            Tornar Playlist Pública
                        </label>

                        <div className="flex gap-2 justify-end">
                            <button type="submit" className="flex items-center gap-2 bg-coffee-600 text-white px-4 py-2 rounded hover:bg-coffee-700 transition">
                                <Save size={18} /> Salvar
                            </button>
                        </div>
                    </form>
                )}
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
                            <div className="aspect-video bg-black relative">
                                <ReactPlayer
                                    src={song.url}
                                    width="100%"
                                    height="100%"
                                    light={true}
                                    controls={true}
                                />
                            </div>

                            <div className="p-4 flex justify-between items-start">
                                <div className="overflow-hidden pr-2">
                                    <h3 className="font-bold text-coffee-900 truncate">{song.title}</h3>
                                    <p className="text-sm text-coffee-600 truncate">{song.albumArtistName}</p>
                                </div>

                                {isOwner && (
                                    <button
                                        onClick={() => removeSong(song.id)}
                                        className="text-red-300 hover:text-red-500 transition p-1"
                                        title="Remover da playlist"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PlaylistDetails;