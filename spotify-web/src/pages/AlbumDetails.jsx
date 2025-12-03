import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../AuthContext';
import { ArrowLeft, Trash2, Pencil, Save, X, Disc, Music, Calendar } from 'lucide-react';
import ReactPlayer from 'react-player';

const AlbumDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [album, setAlbum] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Edição
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ title: '', releaseDate: '' });

    useEffect(() => {
        loadAlbum();
    }, [id]);

    const loadAlbum = async () => {
        try {
            // GET /albums/{id} (Endpoint que ajustamos hoje)
            const res = await api.get(`/albums/${id}`);
            setAlbum(res.data);
            setEditForm({ 
                title: res.data.title, 
                releaseDate: res.data.releaseDate || '' 
            });
            setIsLoading(false);
        } catch (error) {
            alert("Erro ao carregar álbum.");
            navigate('/my-albums');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // PUT /albums/{id}
            const payload = {
                title: editForm.title,
                releaseDate: editForm.releaseDate,
                artistId: user.id // Necessário para validação DTO
            };
            const res = await api.put(`/albums/${id}`, payload);
            setAlbum({ ...album, ...res.data });
            setIsEditing(false);
            alert("Álbum atualizado!");
        } catch (error) {
            alert("Erro ao atualizar.");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("CUIDADO: Isso apagará o álbum e TODAS as músicas dele. Continuar?")) return;
        try {
            await api.delete(`/albums/${id}`);
            alert("Álbum excluído.");
            navigate('/my-albums');
        } catch (error) {
            alert("Erro ao excluir álbum.");
        }
    };

    // Segurança visual: só o dono vê os botões (embora backend valide também)
    const isOwner = user && album && user.id === album.artistId;

    if (isLoading) return <div className="p-8">Carregando...</div>;

    return (
        <div className="max-w-5xl mx-auto pb-10">
            <button onClick={() => navigate('/my-albums')} className="flex items-center gap-2 text-coffee-600 mb-6 hover:text-coffee-800 transition">
                <ArrowLeft size={20} /> Voltar para Discografia
            </button>

            {/* Header do Álbum */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-coffee-200 mb-8 relative">
                {!isEditing ? (
                    // MODO VISUALIZAÇÃO
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-coffee-800 rounded shadow-lg flex items-center justify-center text-white">
                                <Disc size={48} />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-coffee-500 uppercase tracking-wider">Álbum / EP</span>
                                <h1 className="text-4xl font-bold text-coffee-900 mb-1">{album.title}</h1>
                                <div className="flex items-center gap-2 text-coffee-600">
                                    <Calendar size={14} />
                                    <span>Lançado em: {album.releaseDate || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {isOwner && (
                            <div className="flex gap-2">
                                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-coffee-50 text-coffee-600 rounded-lg hover:bg-coffee-100 transition">
                                    <Pencil size={16} /> Editar Info
                                </button>
                                <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition">
                                    <Trash2 size={16} /> Apagar Álbum
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    // MODO EDIÇÃO
                    <form onSubmit={handleUpdate} className="animate-fade-in space-y-4 max-w-lg">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-coffee-800">Editar Metadados</h3>
                            <button type="button" onClick={() => setIsEditing(false)}><X className="text-coffee-400"/></button>
                        </div>
                        <input 
                            className="w-full p-2 border border-coffee-300 rounded text-xl font-bold text-coffee-900" 
                            value={editForm.title} 
                            onChange={e => setEditForm({...editForm, title: e.target.value})}
                        />
                        <input 
                            type="date"
                            className="w-full p-2 border border-coffee-300 rounded" 
                            value={editForm.releaseDate} 
                            onChange={e => setEditForm({...editForm, releaseDate: e.target.value})}
                        />
                        <button type="submit" className="flex items-center gap-2 bg-coffee-600 text-white px-4 py-2 rounded hover:bg-coffee-700 transition">
                            <Save size={16} /> Salvar Alterações
                        </button>
                    </form>
                )}
            </div>

            {/* Lista de Músicas do Álbum */}
            <h2 className="text-xl font-bold text-coffee-800 mb-4 flex items-center gap-2">
                <Music className="w-5 h-5" /> Faixas do Álbum ({album.songs ? album.songs.length : 0})
            </h2>

            {album.songs && album.songs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {album.songs.map(song => (
                        <div key={song.id} className="bg-white rounded-xl shadow-sm border border-coffee-100 overflow-hidden">
                            <div className="aspect-video bg-black relative">
                                <ReactPlayer
                                    src={song.url}
                                    width="100%"
                                    height="100%"
                                    light={true}
                                    controls={true}
                                />
                            </div>
                            <div className="p-3">
                                <h3 className="font-bold text-coffee-900 truncate">{song.title}</h3>
                                <p className="text-xs text-coffee-500">{song.durationSeconds} segundos</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-coffee-50 rounded-xl border border-coffee-100">
                    <p className="text-coffee-400 mb-2">Este álbum ainda não tem músicas.</p>
                    {isOwner && (
                        <button onClick={() => navigate('/upload')} className="text-coffee-600 underline font-bold hover:text-coffee-800">
                            Ir para Upload
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default AlbumDetails;