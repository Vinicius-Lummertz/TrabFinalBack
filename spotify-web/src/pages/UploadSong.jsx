import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Disc, Music, Youtube, Plus } from 'lucide-react';

const UploadSong = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [albums, setAlbums] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showNewAlbum, setShowNewAlbum] = useState(false);

    // Form da Música
    const [songData, setSongData] = useState({ title: '', url: '', duration: 180, albumId: '' });
    // Form do Novo Álbum (caso precise)
    const [albumTitle, setAlbumTitle] = useState('');

    useEffect(() => {
        if (user) loadAlbums();
    }, [user]);

    const loadAlbums = async () => {
        try {
            const res = await api.get(`/albums/artist/${user.id}`);
            setAlbums(res.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Erro ao carregar álbuns");
            setIsLoading(false);
        }
    };

    const handleCreateAlbum = async () => {
        if (!albumTitle) return;
        try {
            const res = await api.post('/albums', {
                title: albumTitle,
                artistId: user.id,
                releaseDate: new Date().toISOString().split('T')[0] // Data de hoje
            });
            setAlbums([...albums, res.data]); // Adiciona na lista local
            setSongData({...songData, albumId: res.data.id}); // Já seleciona ele
            setShowNewAlbum(false);
            setAlbumTitle('');
        } catch (error) {
            alert("Erro ao criar álbum.");
        }
    };

    const handleUploadSong = async (e) => {
        e.preventDefault();
        try {
            // Conversão simples: se usuário colocou link do youtube, a gente aceita
            await api.post('/songs', {
                title: songData.title,
                url: songData.url,
                durationSeconds: songData.duration,
                albumId: songData.albumId
            });
            alert("Música postada com sucesso!");
            navigate('/'); // Volta pra home
        } catch (error) {
            alert("Erro ao postar música.");
        }
    };

    if (isLoading) return <div className="p-8">Carregando seus álbuns...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-coffee-800 mb-8 flex items-center gap-3">
                <Youtube className="w-8 h-8 text-red-500" /> Upload de Música
            </h1>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-coffee-200">

                {/* 1. SELEÇÃO DE ÁLBUM */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-coffee-700 mb-2">1. Escolha o Álbum</label>

                    {albums.length === 0 ? (
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-yellow-800 text-sm mb-4">
                            Você precisa criar um álbum (ou EP/Single) antes de postar músicas.
                        </div>
                    ) : null}

                    {!showNewAlbum ? (
                        <div className="flex gap-2">
                            <select
                                className="flex-1 p-3 bg-coffee-50 border border-coffee-200 rounded-lg"
                                value={songData.albumId}
                                onChange={e => setSongData({...songData, albumId: e.target.value})}
                            >
                                <option value="">Selecione um álbum...</option>
                                {albums.map(album => (
                                    <option key={album.id} value={album.id}>{album.title}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => setShowNewAlbum(true)}
                                className="bg-coffee-200 hover:bg-coffee-300 text-coffee-800 px-4 rounded-lg flex items-center gap-2"
                            >
                                <Plus size={18} /> Novo
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2 animate-fade-in">
                            <input
                                type="text"
                                placeholder="Nome do Novo Álbum (ex: Singles 2025)"
                                className="flex-1 p-3 border border-coffee-300 rounded-lg"
                                value={albumTitle}
                                onChange={e => setAlbumTitle(e.target.value)}
                            />
                            <button onClick={handleCreateAlbum} className="bg-coffee-600 text-white px-4 rounded-lg">Criar</button>
                            <button onClick={() => setShowNewAlbum(false)} className="text-coffee-500 px-2">Cancelar</button>
                        </div>
                    )}
                </div>

                {/* 2. DADOS DA MÚSICA */}
                <form onSubmit={handleUploadSong} className={`space-y-4 ${!songData.albumId && albums.length > 0 ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div>
                        <label className="block text-sm font-bold text-coffee-700 mb-2">2. Dados da Faixa</label>
                        <div className="relative">
                            <Music className="absolute left-3 top-3.5 h-5 w-5 text-coffee-400" />
                            <input
                                type="text"
                                placeholder="Nome da Música"
                                className="w-full pl-10 pr-4 py-3 bg-coffee-50 border border-coffee-200 rounded-lg"
                                value={songData.title}
                                onChange={e => setSongData({...songData, title: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <Youtube className="absolute left-3 top-3.5 h-5 w-5 text-coffee-400" />
                        <input
                            type="url"
                            placeholder="Link do YouTube (ex: https://youtu.be/...)"
                            className="w-full pl-10 pr-4 py-3 bg-coffee-50 border border-coffee-200 rounded-lg"
                            value={songData.url}
                            onChange={e => setSongData({...songData, url: e.target.value})}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs text-coffee-500 ml-1">Duração estimada (segundos)</label>
                        <input
                            type="number"
                            className="w-full p-3 bg-coffee-50 border border-coffee-200 rounded-lg"
                            value={songData.duration}
                            onChange={e => setSongData({...songData, duration: e.target.value})}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!songData.albumId}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-md transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Publicar Música
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadSong;