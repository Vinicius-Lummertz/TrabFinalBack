import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import api from '../api';
import { Disc, Plus, Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyAlbums = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [albums, setAlbums] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    
    // Form State
    const [form, setForm] = useState({ title: '', releaseDate: '' });

    useEffect(() => {
        if (user && user.isArtist) {
            loadAlbums();
        } else {
            // Se tentar acessar sem ser artista, manda voltar
            navigate('/'); 
        }
    }, [user]);

    const loadAlbums = async () => {
        try {
            const res = await api.get(`/albums/artist/${user.id}`);
            setAlbums(res.data);
        } catch (error) {
            console.error("Erro ao carregar álbuns", error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/albums', {
                title: form.title,
                releaseDate: form.releaseDate, // Formato YYYY-MM-DD
                artistId: user.id
            });
            alert("Álbum criado com sucesso!");
            setForm({ title: '', releaseDate: '' });
            setIsCreating(false);
            loadAlbums();
        } catch (error) {
            alert("Erro ao criar álbum.");
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-coffee-800 flex items-center gap-3">
                    <Disc className="w-8 h-8" /> Meus Álbuns
                </h1>
                <button 
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex items-center gap-2 bg-coffee-600 text-white px-4 py-2 rounded-full hover:bg-coffee-700 transition shadow-sm"
                >
                    <Plus className="w-5 h-5" /> Novo Álbum
                </button>
            </div>

            {/* Formulário de Criação */}
            {isCreating && (
                <div className="bg-coffee-50 border border-coffee-200 p-6 rounded-xl mb-8 animate-fade-in">
                    <h3 className="font-bold text-coffee-800 mb-4">Lançar Novo Álbum (ou Single)</h3>
                    <form onSubmit={handleCreate} className="space-y-4 max-w-lg">
                        <div>
                            <label className="text-xs font-bold text-coffee-500 uppercase">Título da Obra</label>
                            <input 
                                type="text" 
                                className="w-full p-3 rounded-lg border border-coffee-200 focus:outline-none focus:border-coffee-500"
                                value={form.title} 
                                onChange={e => setForm({...form, title: e.target.value})} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-coffee-500 uppercase">Data de Lançamento</label>
                            <input 
                                type="date" 
                                className="w-full p-3 rounded-lg border border-coffee-200 focus:outline-none focus:border-coffee-500"
                                value={form.releaseDate} 
                                onChange={e => setForm({...form, releaseDate: e.target.value})} 
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-coffee-500 hover:bg-coffee-100 rounded">Cancelar</button>
                            <button type="submit" className="bg-coffee-800 text-white px-6 py-2 rounded-lg hover:bg-coffee-900 transition">Criar</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Grid de Álbuns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.map(album => (
                    <div 
                        key={album.id} 
                        onClick={() => navigate(`/albums/${album.id}`)}
                        className="bg-white group hover:-translate-y-1 transition-transform duration-200 p-6 rounded-xl border border-coffee-200 shadow-sm cursor-pointer relative overflow-hidden"
                    >
                        {/* Decorativo de "Disco" saindo */}
                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-coffee-100 rounded-full opacity-50 group-hover:scale-150 transition duration-500"></div>

                        <div className="w-12 h-12 bg-coffee-600 rounded-lg flex items-center justify-center mb-4 text-white shadow-md">
                            <Disc className="w-6 h-6 animate-spin-slow" />
                        </div>
                        
                        <h3 className="font-bold text-xl text-coffee-900 mb-1 truncate">{album.title}</h3>
                        
                        <div className="flex items-center gap-2 text-sm text-coffee-500 mb-4">
                            <Calendar size={14} />
                            <span>{album.releaseDate || "Data desconhecida"}</span>
                        </div>

                        <div className="flex items-center text-coffee-600 text-sm font-medium group-hover:text-coffee-800">
                            Gerenciar Faixas <ChevronRight size={16} />
                        </div>
                    </div>
                ))}
            </div>

            {albums.length === 0 && !isCreating && (
                <div className="text-center py-16 text-coffee-400 bg-white rounded-xl border border-dashed border-coffee-200">
                    <Disc className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Sua discografia está vazia.</p>
                    <p className="text-sm">Clique em "Novo Álbum" para começar sua carreira!</p>
                </div>
            )}
        </div>
    );
};

export default MyAlbums;