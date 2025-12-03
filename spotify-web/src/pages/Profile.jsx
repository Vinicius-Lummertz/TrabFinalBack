import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { User, Music, Trash2, LogOut, Disc, Pencil, Save, X, Check } from 'lucide-react';

const Profile = () => {
    const { user, login, logout } = useContext(AuthContext); // Precisamos do 'login' para atualizar o contexto
    const navigate = useNavigate();
    const [mySongs, setMySongs] = useState([]);

    // Estados de Edição do Perfil
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: '', email: '', password: '' });

    // Estados de Edição de Música
    const [editingSongId, setEditingSongId] = useState(null); // Qual música está sendo editada?
    const [songForm, setSongForm] = useState({ title: '', url: '' });

    useEffect(() => {
            if (user) {
                // 1. Preenche o formulário com o que já temos
                setProfileForm({ name: user.name, email: user.email, password: user.password });

                // 2. O PULO DO GATO: Busca os dados frescos do servidor agora!
                api.get(`/users/${user.id}`)
                    .then(res => {
                        const freshUser = res.data;

                        // Se o status de artista mudou no banco, atualizamos o Front agora
                        if (freshUser.isArtist !== user.isArtist) {
                            login(freshUser); // Atualiza o Contexto e o LocalStorage
                        }

                        // Se for artista (agora confirmado), carrega as músicas
                        if (freshUser.isArtist) {
                            loadMySongs();
                        }
                    })
                    .catch(err => console.error("Erro ao sincronizar perfil", err));
            }
        }, []);

    const loadMySongs = () => {
        // Busca músicas pelo nome do artista (Backend Search)
        api.get(`/songs/search?term=${user.name}`)
            .then(res => setMySongs(res.data))
            .catch(err => console.error(err));
    };

    // --- AÇÕES DO PERFIL ---

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            // PUT /users/{id}
            const res = await api.put(`/users/${user.id}`, profileForm);

            // Atualiza o contexto global e o localStorage com os novos dados
            login(res.data);
            setIsEditingProfile(false);
            alert("Perfil atualizado!");
        } catch (error) {
            alert("Erro ao atualizar perfil.");
        }
    };

    const handleDeleteAccount = async () => {
            // Confirmação dupla para evitar acidentes
            const confirm1 = window.confirm("ATENÇÃO: Isso excluirá sua conta permanentemente.");
            if (confirm1) {
                const confirm2 = window.confirm("Tem certeza absoluta? Suas músicas e playlists sumirão para sempre.");
                if (confirm2) {
                    try {
                        await api.delete(`/users/${user.id}`);

                        alert("Conta excluída com sucesso. Sentiremos sua falta!");
                        logout();
                        navigate('/login');
                    } catch (error) {
                        console.error(error);
                        alert("Erro ao excluir conta. Tente novamente.");
                    }
                }
            }
        };

    // --- AÇÕES DAS MÚSICAS ---

    const startEditingSong = (song) => {
        setEditingSongId(song.id);
        setSongForm({ title: song.title, url: song.url });
    };

    const handleUpdateSong = async (songId) => {
        try {
            // Precisamos mandar o objeto completo, o backend pede albumId e duration
            // Vamos buscar a musica original na lista para pegar o que falta
            const originalSong = mySongs.find(s => s.id === songId);

            await api.put(`/songs/${songId}`, {
                title: songForm.title,
                url: songForm.url,
                durationSeconds: originalSong.durationSeconds, // Mantém original
                albumId: originalSong.albumId // Mantém original
            });

            // Atualiza lista localmente
            setMySongs(mySongs.map(s => s.id === songId ? { ...s, ...songForm } : s));
            setEditingSongId(null);
        } catch (error) {
            alert("Erro ao atualizar música.");
        }
    };

    const handleDeleteSong = async (songId) => {
        if (!window.confirm("Tem certeza que deseja apagar esta música?")) return;
        try {
            await api.delete(`/songs/${songId}`);
            setMySongs(mySongs.filter(s => s.id !== songId));
        } catch (error) {
            alert("Erro ao deletar música.");
        }
    };


    if (!user) return <p className="p-8">Carregando...</p>;
    if (user) console.log(user)
    return (
        <div className="max-w-4xl mx-auto pb-10">
            <h1 className="text-3xl font-bold text-coffee-800 mb-8 flex items-center gap-3">
                <User className="w-8 h-8" /> Meu Perfil
            </h1>

            {/* CARTÃO DE DADOS (MODO VISUALIZAÇÃO vs MODO EDIÇÃO) */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-coffee-200 mb-8 relative group">

                {!isEditingProfile ? (
                    // MODO LEITURA
                    <div className="flex items-start gap-6">
                        <div className="w-24 h-24 bg-coffee-200 rounded-full flex items-center justify-center text-coffee-500 text-4xl font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h2 className="text-2xl font-bold text-coffee-900">{user.name}</h2>
                                <button
                                    onClick={() => setIsEditingProfile(true)}
                                    className="text-coffee-400 hover:text-coffee-600 transition p-2 bg-coffee-50 rounded-full"
                                    title="Editar Perfil"
                                >
                                    <Pencil size={18} />
                                </button>
                            </div>
                            <p className="text-coffee-600 mb-2">{user.email}</p>
                            <div className="flex gap-2 mt-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user.isArtist ? 'bg-purple-100 text-purple-700' : 'bg-coffee-100 text-coffee-700'}`}>
                                    {user.isArtist ? 'Artista Verificado' : 'Ouvinte'}
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-mono">
                                    ID: {user.id}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    // MODO EDIÇÃO (FORMULÁRIO)
                    <form onSubmit={handleUpdateProfile} className="space-y-4 animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-coffee-800">Editando Perfil</h3>
                            <button type="button" onClick={() => setIsEditingProfile(false)}><X className="text-coffee-400" /></button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-coffee-500">Nome</label>
                                <input
                                    className="w-full p-2 border border-coffee-200 rounded bg-coffee-50"
                                    value={profileForm.name}
                                    onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-coffee-500">Email</label>
                                <input
                                    className="w-full p-2 border border-coffee-200 rounded bg-coffee-50"
                                    value={profileForm.email}
                                    onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold text-coffee-500">Nova Senha (ou atual)</label>
                                <input
                                    type="password"
                                    className="w-full p-2 border border-coffee-200 rounded bg-coffee-50"
                                    value={profileForm.password}
                                    onChange={e => setProfileForm({...profileForm, password: e.target.value })}
                                />
                            </div>
                        </div>
                        <button type="submit" className="flex items-center gap-2 bg-coffee-600 text-white px-4 py-2 rounded hover:bg-coffee-700 transition">
                            <Save size={16} /> Salvar Alterações
                        </button>
                    </form>
                )}
            </div>

            {/* ÁREA DE MÚSICAS (COM EDIÇÃO/DELETE) */}
            {user.isArtist && (
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-coffee-800 mb-4 flex items-center gap-2">
                        <Disc className="w-5 h-5" /> Gerenciar Discografia
                    </h3>
                    <div className="bg-white rounded-xl shadow-sm border border-coffee-100 overflow-hidden">
                        {mySongs.length > 0 ? (
                            <ul className="divide-y divide-coffee-50">
                                {mySongs.map(song => (
                                    <li key={song.id} className="p-4 flex items-center justify-between hover:bg-coffee-50 transition">

                                        {editingSongId === song.id ? (
                                            // MODO EDIÇÃO DA MÚSICA (LINHA VIRA INPUTS)
                                            <div className="flex-1 flex gap-2 items-center animate-fade-in">
                                                <input
                                                    className="flex-1 p-2 border border-coffee-300 rounded text-sm"
                                                    value={songForm.title}
                                                    onChange={e => setSongForm({...songForm, title: e.target.value})}
                                                    placeholder="Nome da Música"
                                                />
                                                <input
                                                    className="flex-1 p-2 border border-coffee-300 rounded text-sm"
                                                    value={songForm.url}
                                                    onChange={e => setSongForm({...songForm, url: e.target.value})}
                                                    placeholder="URL do YouTube"
                                                />
                                                <button onClick={() => handleUpdateSong(song.id)} className="text-green-600 p-2 hover:bg-green-50 rounded"><Check size={18}/></button>
                                                <button onClick={() => setEditingSongId(null)} className="text-red-400 p-2 hover:bg-red-50 rounded"><X size={18}/></button>
                                            </div>
                                        ) : (
                                            // MODO VISUALIZAÇÃO DA MÚSICA
                                            <>
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="w-8 h-8 bg-coffee-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <Music className="w-4 h-4 text-coffee-400" />
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-coffee-800 block truncate w-40 md:w-auto">{song.title}</span>
                                                        <a href={song.url} target="_blank" rel="noreferrer" className="text-xs text-coffee-400 hover:underline truncate block w-40 md:w-auto">{song.url}</a>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => startEditingSong(song)}
                                                        className="p-2 text-coffee-400 hover:text-coffee-600 hover:bg-coffee-100 rounded-full transition"
                                                        title="Editar Música"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSong(song.id)}
                                                        className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                                                        title="Deletar Música"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="p-6 text-coffee-400 text-center text-sm">Você ainda não postou músicas.</p>
                        )}
                    </div>
                </div>
            )}

            {/* ZONA DE PERIGO */}
            <div className="border-t border-coffee-200 pt-8 mt-8">
                <div className="flex gap-4">
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-6 py-2 bg-coffee-100 text-coffee-700 rounded-lg hover:bg-coffee-200 transition font-medium"
                    >
                        <LogOut className="w-4 h-4" /> Sair
                    </button>
                    <button 
                        onClick={handleDeleteAccount}
                        className="flex items-center gap-2 px-6 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium"
                    >
                        <Trash2 className="w-4 h-4" /> Excluir Conta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;