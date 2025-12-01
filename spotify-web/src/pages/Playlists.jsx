import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import api from '../api';
import { ListMusic, Plus, Play, Lock, Globe } from 'lucide-react';

const Playlists = () => {
    const { user } = useContext(AuthContext);
    const [playlists, setPlaylists] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    
    // Form State
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [isPublic, setIsPublic] = useState(true);

    useEffect(() => {
        if (user) loadPlaylists();
    }, [user]);

    const loadPlaylists = async () => {
        try {
            // Busca playlists do usuário logado
            const res = await api.get(`/playlists/user/${user.id}`);
            setPlaylists(res.data);
        } catch (error) {
            console.error("Erro ao carregar playlists", error);
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
            loadPlaylists(); // Recarrega a lista
        } catch (error) {
            alert("Erro ao criar playlist");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
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

            {/* Formulário de Criação (Toggle) */}
            {isCreating && (
                <div className="bg-coffee-50 border border-coffee-200 p-6 rounded-xl mb-8 animate-fade-in">
                    <h3 className="font-bold text-coffee-800 mb-4">Criar Nova Playlist</h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="Nome da Playlist" 
                            className="w-full p-3 rounded-lg border border-coffee-200 focus:outline-none focus:border-coffee-500"
                            value={newName} onChange={e => setNewName(e.target.value)} required
                        />
                        <input 
                            type="text" 
                            placeholder="Descrição (Opcional)" 
                            className="w-full p-3 rounded-lg border border-coffee-200 focus:outline-none focus:border-coffee-500"
                            value={newDesc} onChange={e => setNewDesc(e.target.value)}
                        />
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-coffee-700 cursor-pointer">
                                <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="accent-coffee-500 w-4 h-4" />
                                Tornar Pública
                            </label>
                            <button type="submit" className="ml-auto bg-coffee-800 text-white px-6 py-2 rounded-lg hover:bg-coffee-900 transition">
                                Criar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Grid de Playlists */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playlists.map(playlist => (
                    <div key={playlist.id} className="bg-white group hover:bg-coffee-50 transition p-6 rounded-xl border border-coffee-100 shadow-sm relative cursor-pointer">
                        <div className="absolute top-4 right-4 text-coffee-300">
                            {playlist.isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </div>
                        <div className="w-12 h-12 bg-coffee-100 rounded-lg flex items-center justify-center mb-4 text-coffee-500 group-hover:bg-coffee-200 transition">
                            <ListMusic className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-coffee-900 mb-1">{playlist.name}</h3>
                        <p className="text-sm text-coffee-500 mb-4 h-10 overflow-hidden">{playlist.description || "Sem descrição"}</p>
                        
                        <div className="text-xs text-coffee-400 font-medium">
                            {playlist.songs ? playlist.songs.length : 0} faixas
                        </div>
                    </div>
                ))}
            </div>

            {playlists.length === 0 && !isCreating && (
                <div className="text-center py-12 text-coffee-400">
                    <p>Você ainda não tem nenhuma playlist.</p>
                    <p className="text-sm">Clique em "Nova Playlist" para começar.</p>
                </div>
            )}
        </div>
    );
};

export default Playlists;