import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import api from '../api';
import { ListMusic, Plus, Lock, Globe, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Playlists = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [myPlaylists, setMyPlaylists] = useState([]);
    const [publicPlaylists, setPublicPlaylists] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [isPublic, setIsPublic] = useState(true);

    useEffect(() => {
        loadPublicPlaylists();
        if (user) loadMyPlaylists();
    }, [user]);

    const loadMyPlaylists = async () => {
        try {
            const res = await api.get(`/playlists/user/${user.id}`);
            setMyPlaylists(res.data);
        } catch (error) {
            console.error("Erro ao carregar minhas playlists", error);
        }
    };

    const loadPublicPlaylists = async () => {
        try {
            const res = await api.get('/playlists/public');
            setPublicPlaylists(res.data);
        } catch (error) {
            console.error("Erro ao carregar playlists públicas", error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: newName,
                description: newDesc,
                isPublic: isPublic,
                ownerId: user.id
            };
            await api.post('/playlists', payload);
            setIsCreating(false);
            setNewName('');
            setNewDesc('');
            loadMyPlaylists(); // Recarrega as minhas
            if (isPublic) loadPublicPlaylists(); // Recarrega as públicas se for o caso
        } catch (error) {
            alert("Erro ao criar playlist");
        }
    };

    // Filtro da busca (Client-side search)
    const filteredPublicPlaylists = publicPlaylists.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.ownerName && p.ownerName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-12 pb-10">
            {/* SEÇÃO 1: MINHAS PLAYLISTS (Só aparece se logado) */}
            {user && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-coffee-800 flex items-center gap-3">
                            <ListMusic className="w-8 h-8" /> Minhas Playlists
                        </h1>
                        <button
                            onClick={() => setIsCreating(!isCreating)}
                            className="flex items-center gap-2 bg-coffee-500 text-white px-4 py-2 rounded-full hover:bg-coffee-600 transition shadow-sm"
                        >
                            <Plus className="w-5 h-5" /> Nova Playlist
                        </button>
                    </div>

                    {/* Formulário de Criação */}
                    {isCreating && (
                        <div className="bg-coffee-50 border border-coffee-200 p-6 rounded-xl mb-8 animate-fade-in">
                            <h3 className="font-bold text-coffee-800 mb-4">Criar Nova Playlist</h3>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <input type="text" placeholder="Nome da Playlist" className="w-full p-3 rounded-lg border border-coffee-200 focus:outline-none focus:border-coffee-500" value={newName} onChange={e => setNewName(e.target.value)} required />
                                <input type="text" placeholder="Descrição (Opcional)" className="w-full p-3 rounded-lg border border-coffee-200 focus:outline-none focus:border-coffee-500" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 text-coffee-700 cursor-pointer">
                                        <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="accent-coffee-500 w-4 h-4" />
                                        Tornar Pública
                                    </label>
                                    <button type="submit" className="ml-auto bg-coffee-800 text-white px-6 py-2 rounded-lg hover:bg-coffee-900 transition">Criar</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myPlaylists.map(playlist => (
                            <div key={playlist.id} onClick={() => navigate(`/playlists/${playlist.id}`)} className="bg-white group hover:bg-coffee-50 transition p-6 rounded-xl border border-coffee-100 shadow-sm relative cursor-pointer">
                                <div className="absolute top-4 right-4 text-coffee-300">
                                    {playlist.isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                </div>
                                <div className="w-12 h-12 bg-coffee-100 rounded-lg flex items-center justify-center mb-4 text-coffee-500 group-hover:bg-coffee-200 transition">
                                    <ListMusic className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg text-coffee-900 mb-1 truncate">{playlist.name}</h3>
                                <p className="text-sm text-coffee-500 mb-4 h-10 overflow-hidden line-clamp-2">{playlist.description || "Sem descrição"}</p>
                                <div className="text-xs text-coffee-400 font-medium">{playlist.songs ? playlist.songs.length : 0} faixas</div>
                            </div>
                        ))}
                        {myPlaylists.length === 0 && !isCreating && <p className="text-coffee-400">Você não tem playlists ainda.</p>}
                    </div>
                </div>
            )}

            <hr className="border-coffee-200" />

            {/* SEÇÃO 2: PLAYLISTS PÚBLICAS */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-coffee-800 flex items-center gap-2">
                        <Globe className="w-6 h-6" /> Explorar Públicas
                    </h2>

                    {/* SEARCH BAR */}
                    <div className="relative w-full max-w-xs">
                        <input
                            type="text"
                            placeholder="Buscar playlists..."
                            className="w-full pl-10 pr-4 py-2 rounded-full border border-coffee-200 focus:outline-none focus:border-coffee-500 bg-white"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 text-coffee-400 w-4 h-4" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPublicPlaylists.map(playlist => (
                        <div key={playlist.id} onClick={() => navigate(`/playlists/${playlist.id}`)} className="bg-white group hover:shadow-md transition p-6 rounded-xl border border-coffee-100 shadow-sm relative cursor-pointer">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-coffee-50 rounded-full flex items-center justify-center text-coffee-400">
                                    <ListMusic className="w-5 h-5" />
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-bold text-coffee-900 truncate">{playlist.name}</h3>
                                    <div className="flex items-center gap-1 text-xs text-coffee-500">
                                        <User size={10} />
                                        <span className="truncate">{playlist.ownerName}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-coffee-500 mb-3 h-10 overflow-hidden line-clamp-2">{playlist.description || "Sem descrição"}</p>
                            <div className="text-xs text-coffee-400 font-medium flex justify-between items-center">
                                <span>{playlist.songs ? playlist.songs.length : 0} faixas</span>
                                <span className="text-coffee-300">Pública</span>
                            </div>
                        </div>
                    ))}
                    {filteredPublicPlaylists.length === 0 && (
                        <p className="col-span-3 text-center py-8 text-coffee-400">Nenhuma playlist pública encontrada.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Playlists;